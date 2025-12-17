# 🎯 Nexus - Club & Event Management Platform

A modern, full-stack web application for discovering, managing, and participating in clubs and events. Built with React, Node.js, MongoDB, and Stripe integration.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Key Features Explained](#key-features-explained)
- [Authentication](#authentication)
- [Payment Integration](#payment-integration)
- [Dashboard Overview](#dashboard-overview)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## ✨ Features

### User Features

- 🔐 **Secure Authentication** - Firebase-based user authentication with email/password
- 🔍 **Advanced Search & Filter** - Search clubs and events with multiple filter options
- 📊 **Smart Sorting** - Sort by date, fee, popularity, and more
- 💳 **Stripe Payments** - Secure payment processing for memberships and events
- 📱 **Responsive Design** - Mobile-first responsive UI with DaisyUI
- 🎨 **Modern Animations** - Smooth Framer Motion animations throughout
- 🌙 **Dark Mode Support** - Built-in theme switching capability

### Club Features

- 📝 **Club Management** - Create and manage clubs with detailed information
- 👥 **Member Management** - Track and manage club memberships
- 📅 **Event Creation** - Organize and manage club events
- 💰 **Membership Fees** - Set flexible pricing for club memberships
- 📊 **Analytics Dashboard** - View member statistics and engagement metrics

### Event Features

- 🎪 **Event Organization** - Create and manage events with detailed information
- 📍 **Location Management** - Track event locations and attendee details
- 🎟️ **Registration** - Easy event registration with optional paid options
- 📈 **Attendance Tracking** - Monitor event attendance and capacity

### Admin Features

- 🛡️ **Club Approval System** - Review and approve/reject new clubs
- 📊 **Platform Analytics** - View overall platform statistics and revenue
- 👤 **User Management** - Manage users and their roles
- 💰 **Payment Monitoring** - Track all transactions and payments
- 📋 **Report Generation** - Export data to CSV format

### Manager Features

- 🏢 **Multi-Club Management** - Manage multiple clubs from one dashboard
- 👥 **Member Management** - Track and manage club members
- 📅 **Event Management** - Create and monitor club events
- 💵 **Revenue Tracking** - Monitor membership and event revenue
- 📊 **Performance Analytics** - View club-specific statistics

### Member Features

- 🔍 **Club Discovery** - Browse and discover clubs matching interests
- 🎫 **Event Registration** - Register for events and receive confirmations
- 💳 **Payment Management** - Manage membership payments and registrations
- 🏆 **Membership Tracking** - View active memberships and status
- 📱 **Personal Dashboard** - Dedicated member dashboard for quick access

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI framework
- **TanStack Query (React Query)** - Server state management
- **React Router v7** - Client-side routing
- **Framer Motion** - Animation library
- **DaisyUI** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Firebase SDK** - Authentication
- **React Hot Toast** - Notifications
- **React Hook Form** - Form management
- **React Icons** - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM (optional)
- **Firebase Admin SDK** - Backend authentication
- **Stripe** - Payment processing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Development Tools

- **Vite** - Fast build tool
- **npm** - Package manager
- **Git** - Version control

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nexus.git
cd nexus
```

### 2. Frontend Setup

```bash
cd src
npm install
```

### 3. Backend Setup

```bash
cd ../nexus-server
npm install
```

## 🔐 Environment Variables

### Frontend (.env.local)

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_API_URL=http://localhost:3000/api
```

### Backend (.env)

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexus
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
FIREBASE_PROJECT_ID=your_firebase_project_id
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## 📁 Project Structure

```
nexus/
├── src/
│   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── manager/
│   │   │   ├── member/
│   │   │   ├── dashboards/
│   │   │   └── root/
│   │   ├── sections/
│   │   ├── animations/
│   │   ├── utilities/
│   │   └── charts/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   └── NotFound.jsx
│   ├── layouts/
│   ├── hooks/
│   ├── contexts/
│   ├── routes/
│   ├── styles/
│   └── App.jsx
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json

nexus-server/
├── index.js
├── .env
├── package.json
└── nexus-ed400-firebase-adminsdk-fbsvc-4cd65fc7ce.json
```

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Frontend:**

```bash
cd nexus
npm run dev
```

**Terminal 2 - Backend:**

```bash
cd nexus-server
npm start
```

The application will be available at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

### Production Build

**Frontend:**

```bash
npm run build
npm run preview
```

**Backend:**

```bash
NODE_ENV=production npm start
```

## 🔌 API Endpoints

### Clubs

- `GET /clubs` - Get all clubs with search & filter
- `GET /clubs/:id` - Get club details
- `GET /clubs/categories` - Get all club categories
- `POST /clubs` - Create new club (Club Manager)
- `PATCH /clubs/:id` - Update club (Club Manager)
- `DELETE /clubs/:id` - Delete club (Club Manager)

### Events

- `GET /events` - Get all events with search & filter
- `GET /events/:id` - Get event details
- `POST /events` - Create new event (Club Manager)
- `PATCH /events/:id` - Update event (Club Manager)
- `DELETE /events/:id` - Delete event (Club Manager)

### Memberships

- `GET /memberships` - Get user memberships
- `POST /memberships` - Create membership
- `PATCH /memberships/:id` - Update membership
- `DELETE /memberships/:id` - Cancel membership

### Payments

- `GET /payments` - Get user payments
- `GET /admin/payments` - Get all payments (Admin)
- `POST /payments/create-intent` - Create payment intent (Stripe)
- `POST /payments/confirm` - Confirm payment

### Admin

- `GET /admin/stats` - Get platform statistics
- `GET /admin/clubs` - Get all clubs for approval
- `PATCH /admin/clubs/:id` - Approve/Reject club

### Manager

- `GET /manager/stats` - Get manager statistics
- `GET /manager/payments` - Get manager payments
- `GET /manager/payments/statistics` - Get payment statistics

### Member

- `GET /member/stats` - Get member statistics
- `GET /member/payments` - Get member payments
- `GET /member/clubs` - Get member's clubs

## 📖 Usage Guide

### For Members

1. **Sign Up** - Create an account with email and password
2. **Explore Clubs** - Browse clubs using search and filters
3. **Join Club** - Click "Join" and complete payment if required
4. **Discover Events** - Find events hosted by your clubs
5. **Register for Events** - Register for events and attend
6. **View Dashboard** - Access your member dashboard for overview

### For Club Managers

1. **Apply for Manager Status** - Apply from member dashboard
2. **Create Club** - Set up your club with details and pricing
3. **Add Events** - Create events under your club
4. **Manage Members** - View and manage club members
5. **View Analytics** - Check membership and event statistics
6. **Track Revenue** - Monitor payments from members

### For Admins

1. **Dashboard Access** - View platform-wide statistics
2. **Approve Clubs** - Review and approve new clubs
3. **Monitor Payments** - Track all transactions
4. **User Management** - Manage user roles and access
5. **Export Reports** - Generate CSV reports

## 🔑 Key Features Explained

### Search & Filter System

- Search by keywords across clubs and events
- Filter by category, location, date range, price
- Real-time results with TanStack Query caching
- Server-side filtering for performance

### Sorting Options

- Newest/Oldest (by creation date)
- Upcoming First (by event date)
- Highest/Lowest Fee (by membership/event cost)
- Customizable sort preferences

### Payment Processing

- Secure Stripe integration
- PCI-compliant payment handling
- Payment history tracking
- Invoice generation
- Multi-currency support

### Animations

- Hero section entrance animations
- Staggered card animations
- Smooth page transitions
- Hover effects on interactive elements
- Scroll-triggered animations

### Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Fast loading times

## 🔐 Authentication

### Firebase Authentication

- Email/password authentication
- Secure token-based sessions
- Role-based access control (Member, Manager, Admin)
- Session persistence

### Protected Routes

- Private routes require authentication
- Role-specific routes with permission checks
- Automatic redirect to login for unauthorized access

## 💳 Payment Integration

### Stripe Setup

1. Create Stripe account at stripe.com
2. Get API keys from dashboard
3. Add keys to `.env` file
4. Payment processing is handled securely

### Payment Flow

1. User initiates payment
2. Create payment intent on backend
3. Confirm payment with Stripe
4. Update membership/registration status
5. Send confirmation email

## 📊 Dashboard Overview

### Member Dashboard

- Active membership count
- Registered events
- Payment history
- Quick access to clubs and events

### Manager Dashboard

- Total members across clubs
- Active clubs
- Upcoming events
- Revenue tracking
- Membership growth charts

### Admin Dashboard

- Total platform users
- All clubs statistics
- Event distribution
- Revenue breakdown
- Platform analytics

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For support, please:

1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include steps to reproduce the problem
4. Provide system information

## 🙏 Acknowledgments

- DaisyUI for beautiful components
- Framer Motion for smooth animations
- Stripe for payment processing
- Firebase for authentication
- TanStack Query for state management
- The React community for amazing tools

## 📞 Contact

- Email: support@nexus.com
- Website: [www.nexus.com](https://nexus.com)

---

**Made with ❤️ by the Nexus Team**

Last Updated: December 18, 2025
