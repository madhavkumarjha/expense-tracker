# 📊 Personal Expense Tracker - Backend

A secure and scalable backend service for managing personal expenses, built with **Fastify**, **MongoDB (Mongoose)**, and modern libraries for authentication, scheduling, and API reliability.

---

## 🚀 Tech Stack

- **Fastify** – High-performance Node.js framework
- **Mongoose** – ODM for MongoDB
- **CORS** – Cross-Origin Resource Sharing
- **jsonwebtoken (JWT)** – Authentication & authorization
- **Agenda** – Job scheduling (e.g., auto-reactivation, reminders)
- **Dotenv** – Environment variable management
- **Nodemon** – Development hot-reloading

---

## 📂 Project Structure
    
    backend/
    │── src/
    │   ├── config/        # Database & environment configs
    │   ├── models/        # Mongoose schemas
    │   ├── routes/        # Fastify route definitions
    │   ├── controllers/   # Business logic
    │   ├── middleware/    # Auth, error handling, validation
    │   ├── jobs/          # Agenda job definitions
    │   └── utils/         # Helper functions
    │── .env               # Environment variables
    │── package.json
    │── README.md


---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**
    ```
    npm install
    ```
3. **Configure environment variables**
    ##### Create a **.env** file:
    ```bash
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/expense-tracker
    JWT_SECRET=your_jwt_secret
    ```

4. **Run the server**
    ```
    npm run dev
    ```

## 🔑 Authentication
    
- JWT-based authentication

- Secure login & signup routes

- Middleware for protected routes
       
- Role-based access (user/admin)

## 📌 API Endpoints (Sample)
```
Method	Endpoint	            Description	Auth        Required

POST	/api/auth/signup	    Register new user	       ❌
POST	/api/auth/login	        Login & get JWT	           ❌
GET	    /api/expenses	        Fetch all expenses	       ✅
POST	/api/expenses/add	    Add new expense	           ✅
PATCH	/api/expenses/:id	    Update expense (partial)   ✅
DELETE	/api/expenses/:id	    Delete expense	           ✅
```

## ⏲️ Scheduled Jobs (Agenda)

- Auto-reactivation of inactive accounts
- Expense reminders (daily/weekly/monthly)
- Data cleanup tasks

  Jobs are defined in src/jobs/ and registered with Agenda during server startup.

## 🛡️ Security Features
- JWT authentication with refresh tokens

- Input validation & sanitization

- CORS configuration

- Centralized error handling

- Secure password hashing (bcrypt)

