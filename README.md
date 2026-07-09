# Inboxia Email

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=fff)
![Express](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=000)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff)
![Redux](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=fff)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=fff)
![Google APIs](https://img.shields.io/badge/Google%20APIs-4285F4?logo=google&logoColor=fff)

Intelligent inbox management and email analysis platform powered by machine learning.

## Features

- **ML-Based Classification** — Automatically categorizes and prioritizes incoming emails
- **Smart Filtering** — Intelligent filters to surface what matters most
- **Unified Inbox** — Aggregates email across folders into a single streamlined view
- **Automated Workflows** — Reply, send, and manage emails programmatically
- **Google OAuth & Gmail API** — Secure authentication with passport-google-oauth20 and full Gmail integration
- **Real-Time Sync** — Firebase-powered real-time data synchronization
- **Redux State Management** — Predictable state container with Redux Toolkit
- **Responsive UI** — Bootstrap 5 + TailwindCSS with React

## Tech Stack

| Layer       | Technology                                     |
| ----------- | ---------------------------------------------- |
| Frontend    | React 18, Redux Toolkit, React Router, Axios   |
| Styling     | Bootstrap 5, React-Bootstrap, TailwindCSS      |
| Backend     | Node.js, Express 5                             |
| Database    | MongoDB (Mongoose), Firebase                   |
| Auth        | Passport.js (Google OAuth 2.0), Firebase Auth  |
| Email API   | Google Gmail API, googleapis, Nodemailer       |
| State       | Redux, Redux Thunk                             |
| Platform    | Firebase Hosting, Firebase Functions           |

## Quick Start

```bash
# Clone the repo
git clone https://github.com/<your-org>/inboxia-email.git
cd inboxia-email

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Configure environment
# Edit frontend/.env with your Firebase config
# Create backend/.env with your MongoDB URI, Google OAuth credentials, etc.

# Start the backend
cd ../backend
npm start

# In a separate terminal, start the frontend
cd ../frontend
npm start
```

## Project Structure

```
inboxia-email/
├── backend/
│   ├── controllers/email/      # Email route handlers (inbox, send, reply, filter, etc.)
│   ├── dtos/                   # Data transfer objects
│   ├── logs/                   # Application logs
│   ├── middlewares/            # Auth & error handling middleware
│   ├── routes/                 # Express route definitions (auth, email)
│   ├── services/               # Firebase & Gmail service integrations
│   ├── server.js               # Express app entry point
│   └── package.json
├── frontend/
│   ├── public/                 # Static assets (favicon, manifest, robots.txt)
│   ├── src/
│   │   ├── components/         # React components (Auth, Inbox, Dashboard, etc.)
│   │   ├── slices/             # Redux slices (emailSlice, userSlice)
│   │   ├── utils/              # Firebase config, token helpers
│   │   ├── api.js              # Axios API client
│   │   ├── store.js            # Redux store configuration
│   │   ├── App.js              # Root React component
│   │   └── index.js            # React DOM entry point
│   ├── .env                    # Frontend environment variables
│   └── package.json
└── README.md
```

## License

[MIT](https://opensource.org/licenses/MIT)
