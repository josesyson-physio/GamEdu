#!/usr/bin/env node
// Gamified Edu security gate. No dependencies. Run: node scripts/security-check.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const fail = [], ok = [];
const check = (cond, msg) => (cond ? ok : fail).push(msg);
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const html = readFileSync('index.html', 'utf8');
const jsFiles = [...walk('js'), ...walk('content')].filter(f => f.endsWith('.js'));
const js = Object.fromEntries(jsFiles.map(f => [f, readFileSync(f, 'utf8')]));
const allJs = Object.values(js).join('\n');
const ALLOWED_HOSTS = new Set(['fonts.googleapis.com', 'fonts.gstatic.com', 'josesyson-physio.github.io', 'www.w3.org']);

// 1. no inline script at all; every script is a same-origin file
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
check(scripts.length > 0 && scripts.every(m => /\bsrc="(js|content)\/[\w-]+\.js"/.test(m[1]) && !m[2].trim()), `only same-origin script files, no inline script (${scripts.length})`);
check(!/<[^>]+\son[a-z]+\s*=/i.test(html), 'no inline on* handlers in HTML');

// 2. CSP
const csp = (html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/) || [])[1] || '';
check(!!csp, 'Content-Security-Policy present');
for (const d of ["default-src 'none'", "script-src 'self'", "connect-src 'none'", "object-src 'none'", "base-uri 'none'", "form-action 'none'"])
  check(csp.includes(d), `CSP has ${d}`);
check(!/script-src[^;]*'unsafe-(inline|eval)'/.test(csp), "CSP script-src has no 'unsafe-inline'/'unsafe-eval'");
check(!/frame-src|child-src/.test(csp) || /frame-src 'none'/.test(csp), 'no frames allowed in CSP');

// 3. dangerous code
for (const [re, name] of [[/\beval\s*\(/, 'eval('], [/new\s+Function\s*\(/, 'new Function('], [/document\.write/, 'document.write'],
  [/\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon/, 'network calls'], [/<iframe|createElement\(['"]iframe/i, 'iframes (Anatomy Run must never be embedded)']])
  check(!re.test(allJs) && !re.test(html), `no ${name}`);

// 4. Anatomy Run save is read-only
check(!/setItem\(\s*(AR_KEY|['"]physio-quest['"])/.test(allJs) && !/removeItem\(\s*(AR_KEY|['"]physio-quest['"])/.test(allJs), 'never writes or deletes the Anatomy Run save');
// 5. frame guard
check(/window\.top !== window\.self/.test(js['js/app.js'] || ''), 'anti-framing guard present');
// 6. external hosts and links
const hosts = new Set([...(html + allJs).matchAll(/https?:\/\/([a-z0-9.-]+)/gi)].map(m => m[1].toLowerCase()));
for (const h of hosts) check(ALLOWED_HOSTS.has(h), `external host allowed: ${h}`);
const blank = [...(html + allJs).matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)].map(m => m[0]);
check(blank.every(a => /noopener/.test(a) && /noreferrer/.test(a)), `new-tab links use noopener noreferrer (${blank.length})`);
// 7. no payments, accounts, trackers, secrets
check(!/<form|type="password"|razorpay|stripe|paypal|gtag\(|google-analytics|fbq\(/i.test(html + allJs), 'no payment, login or tracking code');
check(![/AKIA[0-9A-Z]{16}/, /gh[pousr]_[A-Za-z0-9]{36}/, /github_pat_/, /sk-[A-Za-z0-9]{32,}/, /AIza[0-9A-Za-z_-]{35}/, /-----BEGIN [A-Z ]*PRIVATE KEY/].some(re => re.test(html + allJs)), 'no keys, tokens or secrets');
// 8. user-visible content escaped
check(/const esc = /.test(js['js/art.js'] || '') && /esc\(c\.question\)/.test(js['js/lab.js'] || ''), 'lab content is escaped before display');
// 9. every JS file parses
for (const f of jsFiles) { try { execFileSync(process.execPath, ['--check', f]); ok.push(`parses: ${f}`); } catch { fail.push(`parses: ${f}`); } }

for (const m of ok) console.log('  PASS', m);
for (const m of fail) console.log('  FAIL', m);
console.log(`\n${ok.length} passed, ${fail.length} failed`);
process.exit(fail.length ? 1 : 0);
