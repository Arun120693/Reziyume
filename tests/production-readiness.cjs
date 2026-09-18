/* Read-only production checks. Never create a charge or send an email. */
require('dotenv').config({ quiet: true });
const { Pool } = require('pg');
const fs = require('node:fs');
const crypto = require('node:crypto');
async function main() {
  const report = {};
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
  try {
    const migrations = await pool.query('SELECT migration_name, checksum, finished_at, rolled_back_at FROM resumeforge._prisma_migrations ORDER BY started_at');
    report.migrations = migrations.rows.map(m => {
      const file = `prisma/migrations/${m.migration_name}/migration.sql`;
      return { name: m.migration_name, applied: !!m.finished_at, rolledBack: !!m.rolled_back_at, checksumMatches: fs.existsSync(file) && crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') === m.checksum };
    });
    const columns = await pool.query("SELECT table_name,column_name FROM information_schema.columns WHERE table_schema='resumeforge' AND table_name IN ('Resume','ResumeVersion','PaymentTransaction','JobApplication','WritingUsage')");
    report.databaseColumns = columns.rows.reduce((acc, r) => { (acc[r.table_name] ||= []).push(r.column_name); return acc; }, {});
  } catch(e) { report.database = { ok: false, code: e.code || 'connection-failed' }; }
  finally { await pool.end(); }
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    try { const Razorpay = require('razorpay'); const r = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET }); const result = await r.payments.all({ count: 1 }); report.razorpay = { authenticated: true, mode: process.env.RAZORPAY_KEY_ID.startsWith('rzp_live_') ? 'live' : 'test', recordsReturned: result.items.length, webhookSecretConfigured: !!process.env.RAZORPAY_WEBHOOK_SECRET }; }
    catch(e) { report.razorpay = { authenticated: false, status: e.statusCode }; }
  }
  if (process.env.STRIPE_SECRET_KEY) {
    try { const Stripe = require('stripe'); const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); await stripe.balance.retrieve(); report.stripe = { authenticated: true, webhookSecretConfigured: !!process.env.STRIPE_WEBHOOK_SECRET }; }
    catch(e) { report.stripe = { authenticated: false, code: e.code || e.type }; }
  }
  if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    const transport = require('nodemailer').createTransport({ host: process.env.SMTP_HOST || 'smtpout.secureserver.net', port: 465, secure: true, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 10000 });
    try { await transport.verify(); report.email = { authenticated: true, notificationsEnabled: process.env.SIGNUP_NOTIFICATIONS_ENABLED === 'true', deliveryTest: 'not sent' }; }
    catch(e) { report.email = { authenticated: false, code: e.code }; }
    finally { transport.close(); }
  } else report.email = { authenticated: false, reason: 'SMTP configuration incomplete' };
  console.log(JSON.stringify(report, null, 2));
}
main().catch(() => { console.error('Readiness check failed'); process.exitCode = 1; });
