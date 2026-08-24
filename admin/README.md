# Admin Inquiries Setup

This folder is the admin side of your portfolio contact system.

## What it does
- Contact form submits inquiry to Firebase Firestore (`contactMessages` collection)
- Contact form also sends Web3Forms notification to your email
- Admin dashboard (`admin/index.html`) lets you sign in and manage inquiry status

## 1) Configure Firebase
Edit `src/scripts/inquiry-service.js` and replace all `YOUR_FIREBASE_...` values.

## 2) Enable Firebase services
- Firestore Database
- Authentication (Email/Password)

Create at least one admin user in Firebase Auth.

## 3) Suggested Firestore rules
Use rules similar to this:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contactMessages/{docId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

This allows anyone to submit from your portfolio, but only signed-in admins can read/update.

## 4) Configure Web3Forms
In `src/scripts/main.js`, replace:
- `YOUR_WEB3FORMS_ACCESS_KEY`

## 5) Open admin side
Open `admin/index.html` in your deployed site:
- local example: `/admin/index.html`
- hosted example: `https://yourdomain.com/admin/`

## 6) Enable real reply emails (Firebase Functions + Resend)

This repo now includes:
- `functions/index.js` -> secure HTTPS function `sendAdminReply`
- `functions/package.json` -> function dependencies/scripts

### A. Create a Resend sender
1. Sign in to [Resend](https://resend.com/)
2. Verify your sending domain (or sender) and copy the sender email
   - Example: `Portfolio Admin <noreply@yourdomain.com>`
3. Copy your Resend API key

### B. Deploy the cloud function
From project root:

```bash
cd functions
npm install
```

Set Firebase Function secrets:

```bash
npx firebase functions:secrets:set RESEND_API_KEY
npx firebase functions:secrets:set RESEND_FROM_EMAIL
npx firebase functions:secrets:set ADMIN_EMAILS
```

Use these values when prompted:
- `RESEND_API_KEY`: your Resend API key (`re_xxxxx`)
- `RESEND_FROM_EMAIL`: verified sender (e.g. `Portfolio Admin <noreply@yourdomain.com>`)
- `ADMIN_EMAILS`: comma-separated allowed admin emails (e.g. `nicholetriciaperez@gmail.com`)

Deploy:

```bash
npx firebase deploy --only functions
```

After deploy, copy the `sendAdminReply` function URL from Firebase output.

### C. Connect admin app to the function
In `admin/app.js`, replace:

```js
const SEND_REPLY_FUNCTION_URL = 'YOUR_SEND_REPLY_FUNCTION_URL';
```

with your deployed URL, for example:

```js
const SEND_REPLY_FUNCTION_URL = 'https://us-central1-YOUR_PROJECT.cloudfunctions.net/sendAdminReply';
```

### D. Firebase rules/auth notes
- Admin must be signed in via Firebase Auth (already required by dashboard)
- The function verifies the Firebase ID token and allows only emails listed in `ADMIN_EMAILS`

### E. Test flow
1. Submit contact form from portfolio
2. Open `admin/index.html`
3. Open inquiry -> Reply -> Send
4. Confirm:
   - Email arrives in user's inbox
   - Original inquiry is marked responded
   - Sent record appears in Sent page
