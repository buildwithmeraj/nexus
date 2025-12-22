# Nexus - Club Management Platform

A modern, full-stack web application for managing student clubs, events, and memberships with role-based access control.

## 🌐 Live Demo

- **Frontend**: [https://nexus-2ev.pages.dev/](https://nexus-2ev.pages.dev/)
- **Backend API**: [https://nexus-server-flame-theta.vercel.app/](https://nexus-server-flame-theta.vercel.app/)

### Demo Credentials

**Admin Account:**

- Email: `admin@nexus-2ev.pages.dev`
- Password: `Meraj@`

## 📦 Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **DaisyUI** - Component library
- **Firebase** - Authentication & Real-time database
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Query (TanStack)** - Server state management
- **React Router** - Client-side routing
- **Stripe** - Payment processing
- **React Hot Toast** - Notifications

### Backend

- **Express.js** - Server framework
- **MongoDB** - Database
- **Firebase Admin SDK** - Authentication verification
- **Stripe API** - Payment handling
- **CORS** - Cross-origin resource sharing

## ✨ Features

### Authentication & Authorization

- Email/Password registration and login
- Google OAuth authentication
- Role-based access control (Member, Club Manager, Admin)
- Firebase token-based security
- Persistent authentication across page reloads

### Club Management

- Create and manage clubs
- Browse all clubs with filters
- Club categorization
- Club details and member management
- Club manager dashboard

### Event Management

- Create events for clubs
- Event registration and ticketing
- Event filtering and search
- Event details and RSVP management

### Membership

- Join clubs as member
- Member approval workflow
- Membership status tracking
- Club member listings

### Payments

- Stripe integration for event payments
- Payment history tracking
- Secure payment processing
- Invoice generation

### User Profiles

- Custom profile pictures with ImgBB upload
- User role management
- Account settings and preferences
- Profile visibility controls

### Admin Dashboard

- User management
- Club moderation
- Event oversight
- Payment monitoring
- Analytics and reporting

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Stripe account
- ImgBB account

### Installation

#### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/buildwithmeraj/nexus.git
cd nexus

# Install dependencies
npm install

# Create .env file with required variables
cp .env.example .env

# Start development server
npm run dev
```

#### Backend Setup

```bash
# Clone the backend repository
git clone https://github.com/buildwithmeraj/nexus-server.git
cd nexus-server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the server
npm start
```

### Environment Variables

#### Frontend (.env)

```
VITE_SITE_NAME=Nexus
VITE_BACKEND_URL=https://nexus-server-flame-theta.vercel.app
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_FIREBASE_apiKey=your_firebase_key
VITE_FIREBASE_authDomain=your_firebase_auth_domain
VITE_FIREBASE_projectId=your_firebase_project_id
VITE_FIREBASE_storageBucket=your_firebase_storage_bucket
VITE_FIREBASE_messagingSenderId=your_firebase_messaging_sender_id
VITE_FIREBASE_appId=your_firebase_app_id
```

#### Backend (.env)

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
FB_SERVICE_KEY=your_firebase_service_account_key
CLIENT_URL=http://localhost:5173
```

## 📁 Project Structure

```
nexus/
├── src/
│   ├── components/
│   │   ├── pages/
│   │   │   └── auth/
│   │   │   └── dashboard/
│   │   └── utilities/
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useSecureAxiosInstance.jsx
│   ├── routes/
│   │   └── Routes.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.css
└── package.json
```

## 🔐 Security Features

- Firebase authentication with ID token verification
- Role-based access control (RBAC)
- Secure Axios interceptors with token refresh
- CORS protection
- Input validation and sanitization
- Stripe PCI compliance

## 📝 API Endpoints

### Public Routes

- `GET /` - Server status
- `GET /users/role/:email` - Get user role
- `GET /clubs` - List all clubs
- `GET /clubs/categories` - Get club categories
- `GET /clubs/details/:param` - Get club details
- `GET /events` - List all events
- `GET /events/:eventId` - Get event details

### Protected Routes

- `POST /users` - Create new user
- `POST /clubs` - Create club (Manager only)
- `POST /events` - Create event (Manager only)
- `POST /payments` - Process payment (Member only)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License

## 👨‍💻 Author

**Meraj**

- GitHub: [@buildwithmeraj](https://github.com/buildwithmeraj)
- Email: buildwithmeraj@gmail.com

## 📞 Support

For support, open an issue in the GitHub repository or contact the author.

---

**Built with ❤️ using React, Express, and MongoDB**
