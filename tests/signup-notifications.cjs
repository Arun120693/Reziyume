/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 },
}).outputText, file);
let rows = [], pending = [], mails = [], failMail = false, race = false, insideExisting = false;
const user = { id: 'new', email: 'new@example.com', createdAt: new Date('2026-09-17T00:00:00Z') };
const db = { user: {
  findUnique: async () => rows.find(x => x.email === user.email) || null,
  create: async () => {
    if (race) { rows.push(user); throw { code: 'P2002' }; }
    rows.push(user); return user;
  },
  count: async () => rows.length,
}, $transaction: async callback => {
  if (insideExisting) rows.push(user);
  return callback(db);
} };
const original = Module._load;
Module._load = function(request, ...args) {
  if (request === '@/lib/prisma') return { __esModule: true, default: db };
  if (request === '@/lib/logger') return { logger: { info() {}, warn() {}, error() {} } };
  if (request === 'bcryptjs') return { hash: async () => 'hash' };
  if (request === 'next/server') return { after: cb => pending.push(cb), NextResponse: { json: (body, init) => ({ body, status: init.status }) } };
  if (request === 'nodemailer') return { createTransport: config => {
    assert.equal(config.secure, true);
    assert.equal(config.port, 465);
    return { sendMail: async mail => { if (failMail) throw Error('SMTP unavailable'); mails.push(mail); } };
  } };
  if (request === '@/lib/newUserNotification') return require('../src/lib/newUserNotification.ts');
  return original.call(this, request, ...args);
};
const { POST } = require('../src/app/api/register/route.ts');
const { findOrCreateGoogleUser } = require('../src/services/auth/googleUserService.ts');
const { notifyNewUser } = require('../src/lib/newUserNotification.ts');
const request = () => new Request('http://localhost/api/register', { method: 'POST', body: JSON.stringify({ email: user.email, password: 'test-password' }) });
const flush = async () => { for (const callback of pending.splice(0)) await callback(); };
(async () => {
  process.env.SIGNUP_NOTIFICATIONS_ENABLED = 'true';
  process.env.SMTP_USER = 'support@reziyume.com';
  process.env.SMTP_PASSWORD = 'mock-only';
  rows = [{ email: 'old@example.com' }];
  assert.equal((await POST(request())).status, 201);
  assert.equal(pending.length, 1);
  await flush();
  assert.equal(mails[0].subject, 'New User Signed (new@example.com)');
  assert.equal(mails[0].to, 'support@reziyume.com');
  assert.match(mails[0].text, /including this account\): 2/);
  assert.equal((await POST(request())).status, 409);
  await findOrCreateGoogleUser({ email: user.email });
  assert.equal(pending.length, 0);
  rows = [];
  await findOrCreateGoogleUser({ email: user.email });
  assert.equal(pending.length, 1);
  await flush();
  assert.match(mails[1].text, /Signup method: Google/);
  rows = []; insideExisting = true;
  await findOrCreateGoogleUser({ email: user.email });
  assert.equal(pending.length, 0);
  insideExisting = false; rows = []; race = true;
  await findOrCreateGoogleUser({ email: user.email });
  assert.equal(pending.length, 0);
  rows = [];
  assert.equal((await POST(request())).status, 409);
  assert.equal(pending.length, 0);
  race = false; rows = []; failMail = true;
  assert.equal((await POST(request())).status, 201);
  await flush();
  delete process.env.SMTP_PASSWORD;
  notifyNewUser(user, 'Google'); await flush();
  process.env.SIGNUP_NOTIFICATIONS_ENABLED = 'false';
  notifyNewUser(user, 'Google');
  assert.equal(pending.length, 0);
  assert.equal(mails.length, 2);
  console.log('PASS: new accounts, totals, both signup methods, repeat logins, duplicate races, disabled/missing config, and mail failures.');
})().catch(error => { console.error(error); process.exitCode = 1; });
