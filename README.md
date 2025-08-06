# 📧 Inboxia

Inboxia is a modern, secure, and scalable Gmail client built with React, Redux, Firebase Authentication, and a Node.js/Express backend.  
All email operations (inbox, send, reply) are performed via the backend using the Gmail API.  
No email content is stored in the database; the backend acts as a stateless proxy.


## 🚀 Features

- **Google Sign-In** via Firebase Authentication
- **Redux** for state management
- **Inbox, Compose, Reply** email operations
- **Backend proxy** for Gmail API (no direct Gmail API calls from frontend)
- **Access token and refresh token** securely passed from frontend to backend
- **No email content stored** in the backend database
- **Responsive, modern UI** with React-Bootstrap
- **Security best practices** (no tokens in logs, no secrets in code)

---

## 🗂️ Project Structure

```
inboxia/
├── backend/
│   ├── controllers/
│   │   └── emailController.js
│   ├── routes/
│   │   └── emailRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.js
│   │   │   ├── Dashboard.js
│   │   │   ├── EmailOperations.js
│   │   │   ├── Inbox.js
│   │   │   ├── EmailModal.js
│   │   │   └── ReplyModal.js
│   │   ├── slices/
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── firebase.js
│   │   └── App.js
│   ├── .env
│   ├── package.json
│   └── ...
```

---

## ⚙️ Setup Instructions

### 1. **Clone the repository**

```bash
git clone https://github.com/yourusername/inboxia.git
cd inboxia
```

---

### 2. **Backend Setup**

```bash
cd backend
npm install
```

- Create a `.env` file in `backend/` with:
  ```
  GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=your-google-client-secret
  PORT=5000
  ```

- Start the backend:
  ```bash
  npm start
  ```

---

### 3. **Frontend Setup**

```bash
cd ../frontend
npm install
```

- Create a `.env` file in `frontend/` with:
  ```
  REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
  REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
  REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
  REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
  REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
  REACT_APP_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
  REACT_APP_API_BASE_URL=http://localhost:5000/api
  ```

- Start the frontend:
  ```bash
  npm start
  ```

---

## 🔑 **Google Cloud Setup**

- Enable **Gmail API** in your Google Cloud project.
- Set up **OAuth consent screen** and add your Gmail as a test user.
- Add all required Gmail scopes:
  - `https://www.googleapis.com/auth/gmail.readonly`
  - `https://www.googleapis.com/auth/gmail.send`
  - `https://www.googleapis.com/auth/gmail.modify`
  - `https://www.googleapis.com/auth/userinfo.email`
  - `https://www.googleapis.com/auth/userinfo.profile`
- Add your frontend and backend URLs to **Authorized JavaScript origins** and **redirect URIs**.

---

## 🛡️ Security Notes

- **Never log access tokens or refresh tokens in production.**
- **Do not store tokens in localStorage or cookies.**
- **Do not expose secrets in frontend code.**
- **Use HTTPS in production.**
- **Set CORS policy on backend to allow only your frontend domain.**

---

## 🧑‍💻 Development Workflow

- **Frontend** authenticates with Firebase, gets tokens, and calls backend for all email operations.
- **Backend** receives tokens, calls Gmail API, and returns results.
- **No email content is stored** in the backend database.

---

## 📝 License

MIT License

---

## 🙋‍♂️ Questions?

Open an issue or contact [yourname@yourdomain.com](mailto:yourname@yourdomain.com).

---

**Happy coding with Inboxia!**
