# Field Staff Management Backend

This is the backend API for the Field Staff Management application, built with Node.js, Express, and MongoDB. It provides a robust set of features for authentication, farmer data management, agricultural visit logging, and administrative reporting.

## 🚀 Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (Mongoose ODM)
-   **Authentication**: JWT (JSON Web Tokens)
-   **Media Storage**: Cloudinary (via Multer)
-   **Notifications**: Internal notification system for administrative events

## ⚙️ Prerequisites

-   **Node.js**: v18.0.0+
-   **MongoDB**: Local instance or Atlas URI
-   **Cloudinary**: Account for image storage (Field session evidence)

## 🔧 Installation & Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

3.  **Seed Admin Account**:
    ```bash
    npm run seed:admin
    ```

4.  **Start Server**:
    - Development: `npm run dev`
    - Production: `npm start`

## 📡 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - Register new staff
- `POST /api/auth/login` - Authenticate and receive JWT

### 🌾 Farmers
- `GET /api/farmers` - List all farmers
- `POST /api/farmers` - Register a new farmer
- `GET /api/farmers/:id` - Get detailed farmer profile
- `DELETE /api/farmers/:id` - Remove farmer record

### 🚜 Farm Visits
- `GET /api/visits` - List visits (Role-filtered)
- `POST /api/visits` - Log a new visit session
- `GET /api/visits/:id` - View visit details and evidence

### 📊 Reports & Admin
- `POST /api/reports` - Submit Staff EOD report
- `GET /api/reports/daily-stats` - Get current day activity for logged-in staff
- `GET /api/reports/admin` - Admin: View all staff submissions
- `GET /api/admin/metrics` - Admin: Dashboard analytics data
- `GET /api/admin/visits` - Admin: List visits for verification
- `PATCH /api/admin/visits/:id/verify` - Admin: Verify or Reject visit reports

### 📩 Communications
- `POST /api/contact` - Submit public contact form messages
- `GET /api/notifications` - Retrieve system notifications

### 🖼️ Media
- `POST /api/upload` - Secure image upload to Cloudinary

## 📂 Project Structure

- **config/**: Database connection logic
- **controllers/**: Business logic and request handling
- **middleware/**: Auth protection and role validation
- **models/**: Mongoose schemas (Farmer, User, Visit, DailyReport, Contact, etc.)
- **routes/**: API endpoint definitions
- **scripts/**: Database seeding and maintenance utilities
- **utils/**: Shared helper functions

## 📄 License
ISC License
