# URL Shortener & Analytics Dashboard (Micro-SaaS)

A full-stack application built with React and Node.js that allows users to shorten long URLs, generate QR codes, and track click analytics, similar to a mini Bitly.

## 🚀 Features

*   **Authentication:** Secure login using Email/Password and JWT.
*   **URL Shortening:**
    *   Create short links from long URLs.
    *   Optionally provide a custom alias.
    *   Optionally set an expiration date.
    *   Generates a short URL like `https://yourdomain.com/x9kQ2A`.
*   **Redirection:** Short URLs correctly redirect to their original long URL.
*   **Click Tracking:**
    *   Asynchronously logs click data upon redirection (IP address, timestamp, user agent).
    *   Parses user agent to determine device type, browser, and OS.
*   **Analytics Dashboard:**
    *   Displays a table of user-created links (Original URL, Short URL, Clicks, Creation Date, Expiration Status).
    *   Shows charts for link performance:
        *   Clicks over time (Line Chart).
        *   Breakdown by Device Type (Pie Chart).
        *   Breakdown by Browser (Pie Chart).
        *   Breakdown by Operating System (Pie Chart).
*   **QR Code Generation:** Generate and download a QR code for each short URL.
*   **Pagination & Search:** Paginate through the list of links and search by original URL or alias on the dashboard.
*   **Responsive UI:** Clean interface built with Tailwind CSS.

## 🛠️ Tech Stack

*   **Frontend:**
    *   React.js (`v18+` or as installed)
    *   Redux Toolkit (`@reduxjs/toolkit`)
    *   React Router (`react-router-dom`)
    *   Axios
    *   Recharts (for charts)
    *   Tailwind CSS (styling)
    *   Vite (build tool, adjust if using CRA)
    *   `qrcode.react` (for QR codes)
    *   `date-fns` (for date formatting)
    *   `clsx` (for conditional class names)
*   **Backend:**
    *   Node.js (`v18+` recommended)
    *   Express
    *   MongoDB (Database)
    *   Mongoose (ODM)
    *   JSON Web Token (`jsonwebtoken`) (Authentication)
    *   bcryptjs (Password Hashing)
    *   nanoid (Short Code Generation)
    *   `ua-parser-js` (User Agent Parsing)
    *   `cors` (Cross-Origin Resource Sharing)
    *   `dotenv` (Environment variables)
*   **Database:**
    *   MongoDB (Cloud Atlas recommended, or local instance)

## 📁 Project Structure

```
link-shortener-app/
├── client/             # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── app/        # Redux store, API setup
│   │   ├── components/ # UI components (Auth, Dashboard, Common, Layout)
│   │   ├── features/   # Redux slices (auth, links)
│   │   ├── hooks/      # Custom hooks (e.g., useAuth)
│   │   ├── pages/      # Page components (LoginPage, DashboardPage)
│   │   ├── utils/      # Utility functions (e.g., formatDate)
│   │   ├── App.jsx     # Main routing component
│   │   ├── index.css   # Tailwind directives & base styles
│   │   └── main.jsx    # React app entry point (or index.js for CRA)
│   ├── .env            # Frontend environment variables (!!! IMPORTANT !!!)
│   ├── tailwind.config.js
│   ├── postcss.config.js # (May be removed if using @tailwindcss/vite)
│   ├── vite.config.js    # (Or relevant CRA files)
│   └── package.json
├── server/             # Backend (Node.js/Express)
│   ├── config/         # DB connection
│   ├── controllers/    # Request handling logic
│   ├── middleware/     # Auth middleware, error handlers
│   ├── models/         # Mongoose schemas (User, Link, Click)
│   ├── routes/         # API route definitions
│   ├── utils/          # Helper functions (e.g., generateShortCode, seedUser)
│   ├── .env            # Backend environment variables (!!! IMPORTANT !!!)
│   ├── server.js       # Main entry point
│   └── package.json
└── README.md           # This file
```

## 📋 Prerequisites

*   [Node.js](https://nodejs.org/) (v18.x or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)
*   [MongoDB](https://www.mongodb.com/):
    *   A local MongoDB instance running.
    *   OR a cloud-based MongoDB Atlas cluster (free tier available). You will need the connection string.

## ⚙️ Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/pswitchy/Link-Shortener-App.git
    cd Link-Shortener-App
    ```

2.  **Setup Backend (`server`):**
    *   Navigate to the server directory:
        ```bash
        cd server
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `server` directory (`server/.env`). Copy the contents of `.env.example` (if provided) or use the template below:
        ```dotenv
        # server/.env

        # Port the backend server will run on
        PORT=5001

        # Your MongoDB connection string
        MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database_name>?retryWrites=true&w=majority
        # Replace with your actual connection string (local or Atlas)

        # Secret key for signing JWT tokens (USE A STRONG, RANDOM KEY)
        JWT_SECRET=your_very_strong_and_secret_jwt_key_please_change_me

        # The EXACT URL your frontend runs on (for CORS configuration)
        # Development: Typically http://localhost:5173 (Vite) or http://localhost:3000 (CRA)
        # Production: Your deployed frontend URL (e.g., https://your-app.vercel.app)
        FRONTEND_URL=http://localhost:5173
        ```
    *   **(One Time Only) Seed the Database:** This creates the hardcoded user. Ensure your `MONGODB_URI` is correctly set in `.env`.
        ```bash
        node utils/seedUser.js
        ```
        *(You should see "Hardcoded user created!" or "Hardcoded user already exists.")*

3.  **Setup Frontend (`frontend`):**
    *   Navigate to the client directory:
        ```bash
        cd ../frontend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `client` directory (`client/.env`). Copy `.env.example` (if provided) or use the template below:

        **If using Vite:**
        ```dotenv
        # frontend/.env (for Vite)

        # The root URL of your backend server (NO /api path)
        REACT_APP_API_BASE_URL=http://localhost:5001
        ```

        **If using Create React App:**
        ```dotenv
        # client/.env (for Create React App)

        # The root URL of your backend server (NO /api path) - MUST start with REACT_APP_
        REACT_APP_API_BASE_URL=http://localhost:5001
        ```

## ▶️ Running the Application

You need two terminals open: one for the backend and one for the frontend.

1.  **Start Backend Server:**
    *   Open a terminal in the `server` directory.
    *   Run:
        ```bash
        npm run dev
        ```
    *   This uses `nodemon` for automatic restarts on file changes. The server should start, connect to MongoDB, and listen on the port specified in `server/.env` (e.g., 5001). Look for `Server running on port 5001`.

2.  **Start Frontend Development Server:**
    *   Open a *separate* terminal in the `client` directory.
    *   **If using Vite:**
        ```bash
        npm run dev
        ```
    *   **If using Create React App:**
        ```bash
        npm start
        ```
    *   The frontend server will start and should automatically open your default browser to its URL (e.g., `http://localhost:5173` for Vite, `http://localhost:3000` for CRA).

3.  **Access the Application:**
    *   Navigate to the frontend URL mentioned in the terminal (e.g., `http://localhost:5173`).

## 🔑 Testing Credentials

Use the following hardcoded credentials to log in:

*   **Email:** `intern@dacoid.com`
*   **Password:** `Test123`

## 🧪 How to Test

1.  Navigate to the running frontend application URL.
2.  You should be redirected to the `/login` page.
3.  Enter the test credentials provided above and click "Sign in".
4.  Upon successful login, you should be redirected to the dashboard (`/`).
5.  Use the "Create New Short Link" form:
    *   Enter a valid long URL (e.g., `https://www.google.com`).
    *   Optionally add a custom alias (e.g., `my-google`).
    *   Optionally select an expiration date/time.
    *   Click "Create Link".
6.  The new link should appear in the table below.
7.  Test the **Short URL**: Click the generated short link in the table (or copy/paste it into a new tab). It should redirect you to the original long URL.
8.  Test **QR Code**: Click the "QR" button for a link. A modal should appear with the QR code. Try scanning it with a phone. You can also download the QR code.
9.  Test **Analytics**: Click the "Stats" button. An expanded section should appear below the link row showing charts (Clicks over Time, Device, Browser, OS). *Note: Data appears after the short link is clicked.* Click the short link a few times using different browsers or browser modes (e.g., mobile simulation in DevTools) to generate data. Click "Hide Stats" to close.
10. Test **Pagination**: If you create more than 10 links, pagination controls should appear below the table. Test navigating between pages.
11. Test **Search**: Use the search bar above the table to filter links by original URL or alias. Click "Search". Click "Clear" to remove the filter.
12. Test **Logout**: Click the "Logout" button in the navbar. You should be redirected to the login page.

## ☁️ Deployment

*   **Frontend Deployed Link:** https://link-shortener-app-gilt.vercel.app/
*   **Backend API Deployed Link :** https://link-shortener-app-9kt8.onrender.com/
