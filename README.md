PawLaya Backend
Overview
PawLaya is a backend system for a pet adoption platform. It manages user authentication, including registration, login, and token-based sessions.

Technologies Used
Node.js
Express.js
MongoDB (MongoDB Atlas)
JWT (JSON Web Tokens) for authentication
bcrypt for password hashing
Installation
Clone this repository:

bash
Copy code
git clone https://github.com/yogesh4952/PawaLaya-Backend.git
Install dependencies:

bash
Copy code
npm install
Set up environment variables in a .env file:

SECRET_STRING (for JWT signing)
MongoDB URI (if using MongoDB Atlas)
Run the server:

bash
Copy code
npm start
API Documentation
User Registration (POST /api/register)
Request:

json
Copy code
{
"username": "exampleUser",
"email": "user@example.com",
"password": "password123"
}
Response:

json
Copy code
{
"message": "User registered successfully",
"success": true,
"user": { ...userDetails }
}
User Login (POST /api/login)
Request:

json
Copy code
{
"email": "user@example.com",
"password": "password123"
}
Response:

json
Copy code
{
"message": "Login successful",
"success": true,
"token": "JWT_token_here"
}
Error Codes
400: Bad Request (Missing or invalid input)
401: Unauthorized (Invalid credentials)
500: Internal Server Error
License
MIT License

This README provides a basic outline for your project’s structure and usage. Feel free to customize it as per your project's specific needs.
