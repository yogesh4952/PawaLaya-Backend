# PawLaya - Pet Adoption System Backend

## Description

PawLaya is a pet adoption system that allows users to register, log in, and adopt pets. It features user authentication and a pet adoption process, backed by MongoDB for data storage.

## Installation

### Clone the repository

Clone the project to your local machine:

```bash
git clone https://github.com/yogesh4952/PawaLaya-Backend.git

### Install dependencies
Navigate to the project folder and install the required dependencies:

cd PawLaya-Backend
npm install
Set up environment variables
Create a .env file in the root of the project and add the following variables:

makefile
Copy code
MONGO_URI=your_mongo_connection_string
SECRET_STRING=your_jwt_secret_key
PORT=your_preferred_port
Technologies Used
Node.js: Backend runtime environment
Express.js: Web framework
MongoDB: NoSQL database
Mongoose: ODM for MongoDB
bcrypt: Password hashing
jsonwebtoken: JWT-based authentication
Routes
Auth Routes
POST /auth/register: Register a new user.
POST /auth/login: Login a user.
Folder Structure
bash
Copy code
PawLaya-Backend/
├── controllers/
│   └── auth.controller.js
├── models/
│   └── user.models.js
├── routes/
│   └── auth.routes.js
├── .env
├── index.js
└── package.json
Usage
Run the server
Start the server using:

bash
Copy code
npm start
The server will run at http://localhost:8001 by default.

License
This project is licensed under the MIT License - see the LICENSE file for details.

csharp
Copy code

You can copy this directly into your `README.md` file for a well-structured documentation.
```
