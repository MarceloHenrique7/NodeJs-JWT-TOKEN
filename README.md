Authentication and User Management API
This API provides basic functionalities for user registration, login, and management, using Express, MongoDB, and JWT for authentication.

Features
User Registration: Allows for creating a new user.
User Login: Allows authentication and generation of a JWT token for access to protected routes.
Get User Data: Allows fetching information about a specific user, excluding the password.
Prerequisites
Before starting, make sure you have the following installed:

Node.js (version 14 or higher)
MongoDB (local or cloud instance)
A .env file configured with the necessary environment variables
Installation
Clone the repository:

bash
Copiar código
git clone <REPOSITORY_URL>
Navigate to the project directory:

bash
Copiar código
cd repository-name
Install the dependencies:

bash
Copiar código
npm install
Create a .env file at the root of the project with the following content:

env
Copiar código
SECRET=<your_jwt_secret_key>
DB_USER=<your_mongodb_user>
DB_PASS=<your_mongodb_password>
Endpoints
1. User Registration
Route: POST /auth/register
Request Body:
json
Copiar código
{
  "name": "User Name",
  "email": "email@example.com",
  "password": "password",
  "confirmpassword": "confirm_your_password"
}
Responses:
201 Created: User created successfully.
422 Unprocessable Entity: Invalid data or validation errors.
500 Internal Server Error: Server error.
2. User Login
Route: POST /auth/login
Request Body:
json
Copiar código
{
  "email": "email@example.com",
  "password": "password"
}
Responses:
200 OK: Successful authentication. Returns a JWT token.
422 Unprocessable Entity: Invalid data or incorrect password.
404 Not Found: User not found.
500 Internal Server Error: Server error.
3. Get User Data (Protected)
Route: GET /user/:id
Parameters:
id (URL): User ID.
Request Header:
Authorization: Bearer <jwt_token>
Responses:
200 OK: Returns user data (excluding password).
401 Unauthorized: Invalid or missing token.
404 Not Found: User not found.
500 Internal Server Error: Server error.
Database Configuration
This API uses MongoDB to store data. Ensure that MongoDB is correctly configured and accessible with the provided credentials.

Running the Server
To start the server, run the following command:

bash
Copiar código
npm start
The server will be available at http://localhost:3000.

Contributing
Contributions are welcome! If you find a bug or have a suggestion for improvement, feel free to open an issue or submit a pull request.

License
This project is licensed under the MIT License.
