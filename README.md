# Field Staff Management Backend

This is the backend API for the Field Staff Management application. It provides endpoints for authentication, farmer management, visit logging, and specialized recommendations.

## Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (with Mongoose)
-   **Authentication**: JWT (JSON Web Tokens)
-   **Image Storage**: Cloudinary (via Multer)

## Prerequisites

Before running this project, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [MongoDB](https://www.mongodb.com/) (Local or AtlasURI)

You will also need a **Cloudinary** account solely for image upload functionality.

## Installation

1.  **Clone the repository** (if applicable) or navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the root of the `backend` directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Running the Server

-   **Development Mode** (with hot reloading):
    ```bash
    npm run dev
    ```

-   **Production Mode**:
    ```bash
    npm start
    ```

The server will start on `http://localhost:5000` (or the port specified in your `.env`).

## Accessing Logs

-   To enable or disable console logs (for debugging), check the `server.js` or middleware configurations.

## API Endpoints

### Authentication
-   `POST /api/auth/register` - Register a new staff user.
-   `POST /api/auth/login` - Login and receive a JWT token.

### Farmers
-   `GET /api/farmers` - Get all farmers (Protected).
-   `POST /api/farmers` - Create a new farmer (Protected).
-   `GET /api/farmers/:id` - Get a specific farmer by ID (Protected).

### Visits
-   `GET /api/visits` - Get all visits (Protected).
-   `POST /api/visits` - Log a new visit (Protected).

### Recommendations
-   `GET /api/recommendations` - Get recommendations (Protected).

### Uploads
-   `POST /api/upload` - Upload an image to Cloudinary (Protected/Public depending on config).

## Folder Structure

-   **config**: Database configuration (`db.js`).
-   **controllers**: Route logic and request handling.
-   **middleware**: Custom middleware (e.g., authentication).
-   **models**: Mongoose schemas (`User`, `Farmer`, `Visit`, `Recommendation`, `Image`).
-   **routes**: API route definitions.
-   **utils**: Utility functions.

## License

This project is licensed under the ISC License.
