# New account notifications

After a successful new email/password or Google account creation, Reziyume schedules
one email to support@reziyume.com. Existing accounts signing in do not trigger mail.
The subject is `New User Signed (their@email.com)`.

The body includes the email, signup method, UTC creation time, and total registered
accounts including the new account. This counts accounts, not login events, and is
a database snapshot when the notification runs (concurrent signups may also count).

## Activate on the website host

Set these private server environment variables, then redeploy:

```dotenv
SIGNUP_NOTIFICATIONS_ENABLED=true
SMTP_HOST=smtpout.secureserver.net
SMTP_USER=support@reziyume.com
SMTP_PASSWORD=<mailbox password entered privately in the hosting dashboard>
```

Do not commit the password, put it in a NEXT_PUBLIC variable, or paste it in chat.
Port 465 with SSL is configured for
[GoDaddy Professional Email powered by Titan](https://www.godaddy.com/en-ph/help/set-up-third-party-plugins-or-websites-using-smtp-settings-42788).

Notifications are disabled unless explicitly enabled. No production credentials
are included. After activation, create one new account and check the support inbox;
sign out and sign in again to confirm there is no second notification.

## Pro payment notifications

Successful Stripe invoices and Razorpay subscription charges are recorded in the
`PaymentTransaction` table. A single email is sent to the same support inbox with
the subscriber email, provider, current payment, successful transaction count, and
cumulative amount paid. The migration must be applied with `npx prisma migrate deploy`
before payment webhooks are enabled in production.

Delivery runs after the response using Next.js `after`. Mail failures do not block
signup. This is best-effort delivery with no automatic retries or durable queue;
an outage can lose a notification. There is no historical-account backfill.

Regression tests (mocked database and SMTP, no real mail):
`node tests/signup-notifications.cjs`
