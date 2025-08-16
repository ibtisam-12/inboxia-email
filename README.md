# 📧 Inboxia

Inboxia is a secure, modern Gmail client built with React, Redux Toolkit, Firebase Authentication, and a Node.js/Express backend. All email operations (inbox, send, reply) are performed via the backend using the Gmail API. No email content is stored in the database; the backend acts as a stateless proxy. The application features a unified inbox that combines both inbox and spam emails into a single view, plus advanced folder management and email filtering capabilities.

---

## 🚀 Features

- **Google Sign-In** via Firebase Authentication with OAuth2
- **Redux Toolkit** for efficient state management
- **Inbox, Compose, Reply** email operations
- **Unified Inbox** combining both inbox and spam emails
- **🔍 Filtered Inbox** with keyword-based email organization
- **📁 Folder Management** - Create custom Gmail labels as folders
- **📧 Folder Email Viewing** - Click folders to view contained emails
- **🔄 Email Filtering** - Automatically organize emails based on keywords
- **Backend proxy** for Gmail API (no direct Gmail API calls from frontend)
- **Secure token management** with access token and refresh token handling
- **No email content stored** in the backend database
- **Responsive UI** with React Bootstrap
- **Protected routes** for authenticated users only
- **Security best practices** (no tokens in logs, no secrets in code)
- **Modular backend** with controllers, services, DTOs, and middleware
- **Firebase Integration** for processed email tracking

---

## 🗂️ Project Structure

```
inboxia/
├── backend/
│   ├── controllers/
│   │   └── email/
│   │       ├── getInboxController.js
│   │       ├── sendEmailController.js
│   │       ├── replyEmailController.js
│   │       ├── getEmailByIdController.js
│   │       ├── getUnifiedInboxController.js
│   │       ├── logUnifiedInboxBodiesController.js
│   │       ├── getFilteredInboxController.js
│   │       ├── getLabelsController.js
│   │       └── getFolderEmailsController.js
│   ├── dtos/
│   │   └── email.dto.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── emailRoutes.js
│   ├── services/
│   │   ├── gmailService.js
│   │   └── firebaseService.js
│   ├── config/
│   │   └── passport.js
│   ├── models/
│   │   ├── Email.js
│   │   ├── Settings.js
│   │   └── User.js
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
│   │   │   ├── ReplyModal.js
│   │   │   ├── FilteredInbox.js
│   │   │   ├── FolderList.js
│   │   │   ├── FolderEmails.js
│   │   │   └── LogUnifiedInboxBodies.js
│   │   ├── slices/
│   │   │   ├── emailSlice.js
│   │   │   └── userSlice.js
│   │   ├── utils/
│   │   │   ├── firebase.js
│   │   │   ├── gmailApi.js
│   │   │   └── sendTokensToBackend.js
│   │   ├── api.js
│   │   ├── store.js
│   │   └── App.js
│   ├── public/
│   ├── .env
│   ├── .gitignore
│   ├── firebase.json
│   ├── firebasejson
│   ├── package.json
│   └── README.md
```

---

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **Google APIs** (Gmail API)
- **Google Auth Library** for OAuth2
- **Firebase Admin SDK** for database operations
- **CORS** for cross-origin requests
- **dotenv** for environment variables
- **DTOs** for clean API responses
- **Middleware** for authentication and error handling

### Frontend
- **React 18** with functional components and hooks
- **Redux Toolkit** for state management
- **React Router DOM** for navigation
- **Firebase** for authentication
- **Axios** for HTTP requests
- **React Bootstrap** for UI components

---

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
API_KEY=your-firebase-api-key
AUTH_DOMAIN=your-firebase-auth-domain
DATABASE_URL=your-firebase-database-url
PROJECT_ID=your-firebase-project-id
STORAGE_BUCKET=your-firebase-storage-bucket
MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
APP_ID=your-firebase-app-id
```

Start the backend:
```bash
cd backend
npm start
```

### 3. **Frontend Setup**

```bash
cd frontend
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

---

## 🔑 Google Cloud Setup

1. **Enable Gmail API** in your Google Cloud project
2. **Set up OAuth consent screen** and add your Gmail as a test user
3. **Add required Gmail scopes:**
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.modify`
   - `https://www.googleapis.com/auth/gmail.labels`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
4. **Add authorized domains** to your OAuth consent screen
5. **Configure redirect URIs** in your OAuth2 client

---

## 🔥 Firebase Setup

1. **Create a Firebase project**
2. **Enable Authentication** with Google provider
3. **Enable Realtime Database** for tracking processed emails
4. **Add your domain** to authorized domains
5. **Configure Firebase hosting** (optional)
6. **Copy configuration** to your frontend `.env` file
7. **Set up database rules** for security

---

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
Tokens sent to backend for email operations
    ↓
User is redirected to Dashboard
```

#### 2. **Email Operations Flow**
```
User performs action (view inbox, compose, reply)
    ↓
Frontend makes API call to backend with tokens
    ↓
Backend auth middleware checks tokens
    ↓
Backend controller calls Gmail service with tokens
    ↓
Gmail service interacts with Gmail API
    ↓
Service returns data, controller wraps it in DTOs
    ↓
Backend sends clean, predictable data to frontend
    ↓
Frontend updates Redux store and UI
```

#### 3. **Unified Inbox Flow**
The unified inbox combines both inbox and spam emails into a single view:
```
User views inbox in UI
    ↓
Frontend calls /api/email/unified-inbox endpoint
    ↓
Backend fetches both inbox and spam emails from Gmail API
    ↓
Emails are combined, deduplicated, and sorted by date
    ↓
Backend returns unified email list to frontend
    ↓
Frontend displays emails with visual indicators for spam
```

#### 4. **Filtered Inbox & Folder Management Flow**
```
User creates filter with keywords and folder name
    ↓
Frontend calls /api/email/filtered-inbox endpoint
    ↓
Backend fetches unified inbox emails
    ↓
Backend applies keyword filters to email content
    ↓
Matching emails are moved to specified Gmail label (folder)
    ↓
Processing is tracked in Firebase to prevent duplicates
    ↓
Backend returns matching emails to frontend
    ↓
Frontend displays results and folder creation status
```

#### 5. **Folder Viewing Flow**
```
User clicks on a folder in the Folders tab
    ↓
Frontend calls /api/email/folder-emails endpoint
    ↓
Backend fetches emails with the specific Gmail label
    ↓
Emails are sorted by date and returned to frontend
    ↓
Frontend displays emails in the selected folder
```

---

### **Backend Modularity**

- **Controllers**: Handle HTTP requests, call services, and return DTOs. Includes controllers for inbox, send, reply, get email by ID, unified inbox, filtered inbox, labels, and folder emails operations.
- **Services**: Contain all Gmail API logic and Firebase integration.
- **DTOs**: Shape and sanitize data sent to the frontend.
- **Middleware**: Handles authentication and error responses.

---

### **API Endpoints**

#### **Email Routes (`/api/email`)**
- `GET /inbox` - Fetches user's inbox
- `GET /message/:id` - Gets specific email content
- `POST /send` - Sends new email
- `POST /reply` - Replies to an email
- `GET /unified-inbox` - Fetches unified inbox combining inbox and spam emails
- `GET /log-unified-inbox-bodies` - Logs email bodies and headers to console
- `GET /filtered-inbox` - Applies filters and organizes emails into folders
- `GET /labels` - Fetches all user-created Gmail labels (folders)
- `GET /folder-emails` - Fetches emails from a specific folder

#### **Authentication Routes (`/api/auth`)**
- `POST /tokens` - Receives and logs tokens from frontend (for demo/logging only)

---

## 🛡️ Security Implementation

- **Tokens are never stored** in the backend or database.
- **All email operations** go through the backend proxy.
- **CORS** is configured to allow only your frontend domain.
- **No email content is stored** in the backend.
- **Middleware** ensures only authenticated requests are processed.
- **Firebase security rules** protect processed email tracking data.

---

## 🧑‍💻 Development Workflows

### 1. **Email Management Workflow**
1. **User Authentication**: Firebase handles Google OAuth2 flow
2. **Token Management**: Secure token passing between frontend and backend
3. **API Proxy**: Backend acts as secure proxy to Gmail API
4. **State Management**: Redux manages application state
5. **UI Updates**: React components re-render based on state changes
6. **Unified Inbox**: Combines inbox and spam emails into a single view
7. **Security**: No sensitive data stored, all operations validated

### 2. **Folder Management Workflow**
1. **Filter Creation**: User defines keywords and folder name
2. **Email Processing**: Backend fetches and filters emails
3. **Label Creation**: Gmail labels are created automatically
4. **Email Organization**: Matching emails are moved to labels
5. **Duplicate Prevention**: Firebase tracks processed emails
6. **Folder Viewing**: Users can click folders to view contained emails
7. **Real-time Updates**: Refresh functionality keeps data current

### 3. **Filtered Inbox Workflow**
1. **Keyword Input**: User enters comma-separated keywords
2. **Folder Specification**: User provides folder name for organization
3. **Email Fetching**: Backend retrieves unified inbox emails
4. **Content Analysis**: Email bodies and headers are searched for keywords
5. **Matching Logic**: Any keyword match triggers email inclusion
6. **Label Assignment**: Matching emails receive the specified Gmail label
7. **Result Display**: Frontend shows processed emails and folder status

### 4. **Folder Navigation Workflow**
1. **Folder Discovery**: User views all created folders in Folders tab
2. **Folder Selection**: Clicking a folder triggers email fetch
3. **Email Retrieval**: Backend fetches emails with specific label
4. **Data Sorting**: Emails are sorted by date (newest first)
5. **Display Rendering**: Frontend shows emails with metadata
6. **Navigation**: Back button returns to folder list
7. **Refresh Capability**: Users can update folder contents

---

## 📁 New Features Added

### **Filtered Inbox System**
- **Keyword-based filtering**: Search emails by keywords in content and headers
- **Automatic folder creation**: Gmail labels created dynamically
- **Email organization**: Matching emails moved to specified folders
- **Duplicate prevention**: Firebase tracks processed emails
- **Real-time feedback**: Success messages and email counts

### **Folder Management System**
- **Folder listing**: View all created Gmail labels
- **Interactive folders**: Click to view contained emails
- **Email display**: Clean list view with metadata
- **Navigation**: Easy back-and-forth between folders and list
- **Refresh functionality**: Update folder contents

### **Enhanced User Experience**
- **Visual feedback**: Loading states, success messages, error handling
- **Responsive design**: Works on all screen sizes
- **Intuitive navigation**: Clear folder structure and email viewing
- **Real-time updates**: Refresh buttons for current data

---

## 🔧 Technical Implementation Details

### **Backend Enhancements**
- **New Gmail service functions**: `fetchAllLabels()`, `fetchEmailsByFolder()`, `applyFiltersAndMoveToLabel()`
- **Firebase integration**: `saveProcessedEmail()`, `isEmailProcessed()` for duplicate prevention
- **Label management**: `ensureLabel()` for dynamic Gmail label creation
- **Email filtering**: `applyFilters()` with keyword matching logic

### **Frontend Enhancements**
- **New components**: `FilteredInbox.js`, `FolderList.js`, `FolderEmails.js`
- **Enhanced Dashboard**: Added Folders tab with navigation
- **Interactive UI**: Clickable folder cards with hover effects
- **State management**: Local state for loading, errors, and success messages

### **API Extensions**
- **New endpoints**: `/labels`, `/folder-emails`, enhanced `/filtered-inbox`
- **Query parameters**: Support for folder names and keywords
- **Response formatting**: Consistent data structures across endpoints

---

