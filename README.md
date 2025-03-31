# User Profile Management API

A RESTful API for user profile management with JWT authentication built with Express.js and MongoDB.

## Features

- User registration and authentication
- JWT-based authentication
- Profile management (create, retrieve, update)
- Protected routes

## Tech Stack

- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Packages**: Mongoose, bcrypt, cors, morgan

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kirigaya07/Backend_assignment.git
   cd user-profile-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/user_profile_db
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRES_IN=1d
   ```

   Note: For production, use a strong, unique JWT secret.

4. Start the server:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## Testing with Postman

### Import the Collection

1. Open Postman
2. Click on "Import" button in the top left
3. Select the `postman_collection.json` file from your project directory
4. The collection will be imported with all predefined API requests

### Set Up Environment Variables

1. The collection uses two variables:

   - `base_url` (already set to `http://localhost:5000`)
   - `jwt_token` (you'll need to set this after login/registration)

2. To set the JWT token after registration/login:
   - Copy the token from the response
   - Click on the environment quick-look (eye icon)
   - Set the `jwt_token` value with the copied token

### Testing Endpoints

1. **Register a User**:

   - Select "Register User" from the collection
   - The request body contains sample data you can modify
   - Send the request
   - Copy the JWT token from the response

2. **Login**:

   - Use the "Login User" request with your credentials
   - You'll receive a new token that you can update in your environment

3. **Get Profile**:

   - Use the "Get User Profile" request
   - This request automatically includes your JWT token

4. **Update Profile**:
   - Use the "Update User Profile" request
   - Modify the JSON body with the fields you want to update

Note: All authenticated endpoints automatically include the JWT token in the Authorization header.

## API Endpoints

### Authentication

#### Register a new user

- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**:

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword",
    "address": "123 Main St, City, Country",
    "bio": "Optional bio information",
    "profilePicture": "Optional profile picture URL"
  }
  ```

- **Response**:

  ```json
  {
    "message": "User registered successfully",
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "address": "123 Main St, City, Country",
      "bio": "Optional bio information",
      "profilePicture": "Optional profile picture URL",
      "createdAt": "timestamp"
    }
  }
  ```

#### Login

- **URL**: `/api/users/login`
- **Method**: `POST`
- **Body**:

  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```

- **Response**:

  ```json
  {
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "address": "123 Main St, City, Country",
      "bio": "Optional bio information",
      "profilePicture": "Optional profile picture URL",
      "createdAt": "timestamp"
    }
  }
  ```

### Profile Management

#### Get user profile

- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer your_jwt_token`
- **Response**:

  ```json
  {
    "message": "Profile retrieved successfully",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "address": "123 Main St, City, Country",
      "bio": "Optional bio information",
      "profilePicture": "Optional profile picture URL",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```

#### Update user profile

- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer your_jwt_token`
- **Body**: (all fields are optional)

  ```json
  {
    "name": "Updated Name",
    "address": "Updated address",
    "bio": "Updated bio",
    "profilePicture": "Updated profile picture URL"
  }
  ```

- **Response**:

  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "_id": "user_id",
      "name": "Updated Name",
      "email": "john@example.com",
      "address": "Updated address",
      "bio": "Updated bio",
      "profilePicture": "Updated profile picture URL",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication failure or invalid token
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Authentication Flow

This API uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. Obtain a token by registering or logging in
2. Include the token in the Authorization header of your requests:

   ```http
   Authorization: Bearer your_jwt_token
   ```

## Security

- Passwords are hashed using bcrypt
- JWT is used for stateless authentication
- Users can only access their own profiles
