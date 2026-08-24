# Firebase Function: Admin Reply Email (Resend)

This folder contains the Cloud Function used by `admin/app.js` to send real reply emails to users.

## Files
- `index.js` - `sendAdminReply` HTTPS function
- `package.json` - Node dependencies and scripts

## Prerequisites
- Firebase project with:
  - Authentication (Email/Password)
  - Cloud Functions enabled
- Resend account with verified sender/domain
- Firebase CLI installed and logged in

## Setup

1) Install dependencies

```bash
cd functions
npm install
```

2) Set function secrets

```bash
npx firebase functions:secrets:set RESEND_API_KEY
npx firebase functions:secrets:set RESEND_FROM_EMAIL
npx firebase functions:secrets:set ADMIN_EMAILS
```

Example values:
- `RESEND_API_KEY`: `re_xxxxx`
- `RESEND_FROM_EMAIL`: `Portfolio Admin <noreply@yourdomain.com>`
- `ADMIN_EMAILS`: `nicholetriciaperez@gmail.com`

3) Deploy

```bash
npx firebase deploy --only functions
```

4) Copy the deployed URL

Use the `sendAdminReply` URL in `admin/app.js`:

```js
const SEND_REPLY_FUNCTION_URL = 'https://us-central1-YOUR_PROJECT.cloudfunctions.net/sendAdminReply';
```

## Security Model
- Function requires `Authorization: Bearer <Firebase ID token>`
- Token is verified server-side
- Requester email must be listed in `ADMIN_EMAILS`
