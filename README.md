# Digital Complaint Portal 🏢

A modern, full-stack MERN web application designed for colleges, hostels, apartments, offices, and societies to streamline complaint management and issue resolution.

![Digital Complaint Portal](https://res.cloudinary.com/demo/image/upload/v1593000863/avatar_placeholder_o9vaxr.png) <!-- Replace with actual screenshot later -->

## 🌟 Features

### For Users / Residents
- **Dashboard**: Track personal complaint statistics.
- **Raise Complaint**: Submit issues with title, description, category, priority, location, and attach up to 3 image proofs.
- **My Complaints**: Search, filter, and sort all your reported issues.
- **Real-time Tracking**: Monitor status changes (Pending → In Progress → Resolved).
- **Communication**: Add comments to complaints and chat directly with assigned staff.
- **Secure Access**: JWT-based authentication with bcrypt password hashing.

### For Admins / Staff
- **Admin Dashboard**: Comprehensive charts and statistics of all complaints across the system.
- **Complaint Management**: View, filter, and search through all complaints.
- **Status Updates**: Change the status of complaints and add resolution notes.
- **Assignment**: Assign specific staff members to handle complaints.

### UI / UX Highlights
- **Premium Aesthetics**: Built with Tailwind CSS v4, featuring glassmorphism, modern card layouts, and subtle micro-animations.
- **Dark/Light Mode**: Full support for both themes, toggled directly from the header.
- **Responsive**: Fully optimized for mobile, tablet, and desktop viewing.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS v4, React Router v7, Axios, Recharts, Lucide React, React Hot Toast.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose.
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs.
- **Media Storage**: Cloudinary (via Multer memory storage).
- **Real-time**: Socket.io.
- **Deployment**: Configured for Vercel (client and server).

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas cluster (or local instance)
- Cloudinary account

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd digital-complaint
```

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the server (development mode):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory and add the API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment (Vercel)

This project is structured to be deployed easily on Vercel.

1. **Frontend**: Point Vercel to the `client/` directory. Use the default Vite build commands.
2. **Backend**: Point Vercel to the `server/` directory. The `vercel.json` is already configured to expose `server.js` as a serverless function.
   - *Note*: Vercel Serverless Functions do not support persistent WebSockets. The Socket.io integration might require using a long-polling fallback or hosting the backend on platforms like Render or Railway for optimal real-time capabilities.

---

## 📄 License
This project is licensed under the MIT License.
