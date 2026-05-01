# <img src="public/icon.png" alt="Nexus Icon" width="30" height="30" style="vertical-align: middle; margin-bottom: 5px;" /> Nexus

Nexus is a club management platform for student communities. It helps manage clubs, members, events, and payments with role-based access.

## Live Links

- Frontend: https://nexus-2ev.pages.dev/
- Backend: https://nexus-server-flame-theta.vercel.app/

## Demo Account

- Email: `admin@nexus-2ev.pages.dev`
- Password: `Meraj@`

## Tech Stack

- React + Vite
- Tailwind CSS + DaisyUI
- Firebase Authentication
- Express.js
- MongoDB
- Stripe

## Run Locally

### Frontend

```bash
git clone https://github.com/buildwithmeraj/nexus.git
cd nexus
npm install
npm run dev
```

### Backend

```bash
git clone https://github.com/buildwithmeraj/nexus-server.git
cd nexus-server
npm install
npm start
```

## Environment Variables

Use these frontend `.env` fields:

```env
VITE_SITE_NAME=your_site_name
VITE_BACKEND_URL=http://localhost:3000
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_FIREBASE_apiKey=your_firebase_api_key
VITE_FIREBASE_authDomain=your_firebase_auth_domain
VITE_FIREBASE_projectId=your_firebase_project_id
VITE_FIREBASE_storageBucket=your_firebase_storage_bucket
VITE_FIREBASE_messagingSenderId=your_firebase_messaging_sender_id
VITE_FIREBASE_appId=your_firebase_app_id
```
