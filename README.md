# 📧 Inboxia 

Inboxia is a secure, modern Gmail client built with React, Redux Toolkit, Firebase Authentication, and a Node.js/Express backend. All email operations (inbox, send, reply) are performed via the backend using the Gmail API. No email content is stored in the database; the backend acts as a stateless proxy.

## 🚀 Features

- **Google Sign-In** via Firebase Authentication with OAuth2
- **Redux Toolkit** for efficient state management
- **Inbox, Compose, Reply** email operations
- **Backend proxy** for Gmail API (no direct Gmail API calls from frontend)
- **Secure token management** with access token and refresh token handling
- **No email content stored** in the backend database
- **Responsive UI** with React Bootstrap
- **Protected routes** for authenticated users only
- **Security best practices** (no tokens in logs, no secrets in code)

## 🗂️ Project Structure

```
inboxia/
├── backend/
│   ├── controllers/
│   │   └── emailController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── emailRoutes.js
│   ├── config/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.js
│   │   │   ├── ComposeEmail.js
│   │   │   ├── Dashboard.js
│   │   │   ├── EmailModal.js
│   │   │   ├── EmailOperations.js
│   │   │   ├── Inbox.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── ReplyModal.js
│   │   ├── slices/
│   │   │   ├── emailSlice.js
│   │   │   └── userSlice.js
│   │   ├── utils/
│   │   │   ├── firebase.js
│   │   │   └── sendTokensToBackend.js
│   │   ├── api.js
│   │   ├── store.js
│   │   └── App.js
│   ├── public/
│   ├── .env
│   ├── .gitignore
│   ├── firebase.json
│   ├── .firebaserc
│   ├── package.json
│   └── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **Google APIs** (Gmail API)
- **Google Auth Library** for OAuth2
- **CORS** for cross-origin requests
- **dotenv** for environment variables

### Frontend
- **React 18** with functional components and hooks
- **Redux Toolkit** for state management
- **React Router DOM** for navigation
- **Firebase** for authentication
- **Axios** for HTTP requests
- **React Bootstrap** for UI components

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Platform account
- Firebase project

### 1. **Clone the repository**

```bash
git clone https://github.com/yourusername/inboxia.git
cd inboxia
```

### 2. **Backend Setup**

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
PORT=5000
```

Start the backend:
```bash
npm start
```

### 3. **Frontend Setup**

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/` with:
```env
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

## 🔑 Google Cloud Setup

1. **Enable Gmail API** in your Google Cloud project
2. **Set up OAuth consent screen** and add your Gmail as a test user
3. **Add required Gmail scopes:**
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.modify`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
4. **Add authorized domains** to your OAuth consent screen
5. **Configure redirect URIs** in your OAuth2 client

## 🔥 Firebase Setup

1. **Create a Firebase project**
2. **Enable Authentication** with Google provider
3. **Add your domain** to authorized domains
4. **Configure Firebase hosting** (optional)
5. **Copy configuration** to your frontend `.env` file

## 🔄 How The Project Works

### Architecture Overview

Inboxia follows a secure client-server architecture where the React frontend handles user interface and authentication, while the Node.js backend serves as a secure proxy to the Gmail API.

### Complete Application Flow

#### 1. **User Authentication Process**
```
User clicks "Sign in with Google"
    ↓
Firebase Authentication handles OAuth2 flow
    ↓
Google returns OAuth access token & refresh token
    ↓
Frontend stores tokens securely in Redux store
    ↓
Tokens sent to backend for logging
    ↓
User is redirected to Dashboard
```

#### 2. **Email Operations Flow**
```
User performs action (view inbox, compose, reply)
    ↓
Frontend makes API call to backend with tokens
    ↓
Backend creates Gmail client with user's tokens
    ↓
Backend calls Gmail API on user's behalf
    ↓
Gmail API returns email data
    ↓
Backend processes and returns data to frontend
    ↓
Frontend updates Redux store
    ↓
UI re-renders with new data
```

### Detailed Component Interactions

#### **Frontend Components:**
- **`Auth.js`** - Handles Google sign-in/sign-out with Firebase
- **`ProtectedRoute.js`** - Ensures only authenticated users access the app
- **`Dashboard.js`** - Main container showing inbox and compose options
- **`Inbox.js`** - Displays list of emails from Gmail
- **`EmailModal.js`** - Shows full email content in a modal
- **`ComposeEmail.js`** - Form for writing new emails
- **`ReplyModal.js`** - Interface for replying to emails
- **`EmailOperations.js`** - Handles email actions (view, compose, reply)

#### **Redux State Management:**
- **`userSlice.js`** - Manages user authentication state and tokens
- **`emailSlice.js`** - Manages email data, loading states, and operations
- **`store.js`** - Configures Redux store with all slices

#### **Backend Architecture:**
- **`server.js`** - Express server setup with CORS and route mounting
- **`emailController.js`** - Processes all Gmail API operations
- **`authRoutes.js`** - Routes for authentication endpoints
- **`emailRoutes.js`** - Routes for email operations (GET, POST)

### Security Implementation

#### **Token Management:**
1. **Frontend receives tokens** from Firebase after Google OAuth
2. **Tokens are stored in Redux store** (not in localStorage)
3. **Tokens are sent to backend** with each API request in headers
4. **Backend creates Gmail client** using the user's tokens
5. **No tokens stored** in database
6. **Tokens automatically refresh** when expired

#### **Data Flow Security:**
- All email operations go through backend proxy
- No direct Gmail API calls from frontend
- Backend uses user's tokens to access Gmail API
- No email content stored in database
- CORS configured to allow only frontend domain

### API Endpoints

#### **Email Routes (`/api/email`)**
- `GET /inbox` - Fetches user's inbox
- `GET /message/:id` - Gets specific email content
- `POST /send` - Sends new email
- `POST /reply` - Replies to an email

#### **Authentication Routes (`/api/auth`)**
- `POST /tokens` - Receives and logs tokens from frontend

## 🧑‍💻 Development Workflow

1. **User Authentication**: Firebase handles Google OAuth2 flow
2. **Token Management**: Secure token passing between frontend and backend
3. **API Proxy**: Backend acts as secure proxy to Gmail API
4. **State Management**: Redux manages application state
5. **UI Updates**: React components re-render based on state changes
6. **Security**: No sensitive data stored, all operations validated

## 📱 Available Scripts

### Backend
- `npm start` - Start the production server

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gmail API documentation
- Firebase Authentication
- React and Redux communities
- All contributors and testers

**Happy coding with Inboxia! 📧✨**
