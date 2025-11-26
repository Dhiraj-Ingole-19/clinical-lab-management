# Digital Banking Full-Stack

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A complete full-stack web application that simulates a modern digital banking platform. This project features a secure, token-based REST API backend built with Java (Spring Boot) and a responsive, interactive frontend built with React (Vite).

It includes separate functionalities for standard users (account management, transactions) and a dedicated admin panel for administrative tasks.

---

## 🚀 Key Features

This application is divided into two main roles, each with its own set of capabilities:

### **User Features**
* **Authentication:** Secure user registration and JWT (JSON Web Token) based login.
* **Account Dashboard:** View account balance, account number, and user details.
* **Transaction History:** A complete, paginated list of all past transactions (deposits, withdrawals, transfers).
* **Core Banking Actions:**
    * **Deposit:** Add funds to an account.
    * **Withdraw:** Remove funds from an account.
    * **Transfer:** Send money to another user's account.
* **Dispute/Rollback Requests:** Users can submit a request to an admin to review or roll back a specific transaction.

### **Admin Features**
* **Secure Admin Dashboard:** A separate, protected route and dashboard for all administrative actions.
* **User Management:** Search for users and manage their accounts.
* **View All Transactions:** Access to the complete transaction history for all users on the platform.
* **Transaction Rollback Queue:** View and process user-submitted requests for transaction rollbacks.

---

## 💻 Tech Stack

This project is a monorepo containing two separate applications:

### **Backend (The "Engine")**
* **Java 17**
* **Spring Boot 3:** The core application framework.
* **Spring Security 6:** For handling all authentication, authorization, and security.
* **Spring Data JPA (Hibernate):** For database interaction (Object-Relational Mapping).
* **MySQL:** The relational database for storing all user and transaction data.
* **JWT (JSON Web Tokens):** For stateless, token-based security.
* **Maven:** For project and dependency management.

### **Frontend (The "Face")**
* **React:** The core UI library.
* **Vite:** A high-speed build tool and development server.
* **React Router:** For client-side routing and page navigation.
* **React Context API:** For global state management (e.g., managing user's login status).
* **Axios / Fetch:** For making API calls to the Spring Boot backend.
* **CSS Modules:** For component-level, scoped styling.

---

## 📂 Project Structure

This monorepo is organized with a clear separation of concerns:

digital-banking-fullstack/ │ ├── .git/ ├── Digital Banking Backend/ (Spring Boot API) │ ├── src/main/java/com/fintech/digitalbanking/ │ │ ├── controller/ (API Endpoints) │ │ ├── service/ (Business Logic) │ │ ├── entity/ (Database Models) │ │ ├── repository/ (Database Access) │ │ ├── dto/ (Data Transfer Objects) │ │ └── security/ (JWT & Security Config) │ └── pom.xml (Backend Dependencies) │ └── digital-banking-frontend/ (React + Vite UI) ├── src/ │ ├── pages/ (App Screens - Dashboard, Login, etc.) │ ├── components/ (Reusable UI parts - Navbar, Card, etc.) │ ├── services/ (API client files) │ └── context/ (Global Auth State) └── package.json (Frontend Dependencies)


---

## 🏁 Getting Started

To run this project on your local machine, follow these steps.

### **Prerequisites**
* **Java JDK 17** or newer
* **Node.js v18** or newer (with npm)
* **MySQL Server** running on your machine
* **Git**

### **1. Clone the Repository**
Run this command in your terminal:
```bash
git clone [https://github.com/Dhiraj-Ingole-19/digital-banking-fullstack.git](https://github.com/Dhiraj-Ingole-19/digital-banking-fullstack.git)
cd digital-banking-fullstack
2. Configure the Backend (Spring Boot)
Open Database: Start your local MySQL server.

Create Database: Create a new database for the project (e.g., digital_banking_db).

Configure: Navigate to Digital Banking Backend/src/main/resources/application.properties.

Edit Properties: Update the file to match your MySQL setup.

Properties

spring.datasource.url=jdbc:mysql://localhost:3306/digital_banking_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
Run: Open a terminal inside the Digital Banking Backend folder and run the application using the Maven wrapper:

Bash

./mvnw spring-boot:run
The backend API will be running at http://localhost:8080.

3. Configure the Frontend (React)
Open a new terminal.

Navigate & Install: Go to the digital-banking-frontend folder and install the npm packages:

Bash

npm install
Run: In that same folder, start the Vite development server:

Bash

npm run dev
The frontend will be running at http://localhost:5173.

You're all set! Open http://localhost:5173 in your browser to use the application.

📜 License
This project is licensed under the MIT License. See the LICENSE file for more details.

👤 Author
Dhiraj Ingole

GitHub: @Dhiraj-Ingole-19

## 🔒 Security

This application uses environment variables for sensitive configuration.

### Admin Password
The admin password is **NOT** hardcoded. You must set the `ADMIN_PASSWORD` environment variable in your deployment environment or IDE run configuration.

- **Default (Fallback):** `Admin@123` (Only if env var is missing, NOT recommended for production)
- **Production:** Set `ADMIN_PASSWORD` to a strong, unique password.

Example (Linux/Mac):
```bash
export ADMIN_PASSWORD=MySuperSecretPassword!
./mvnw spring-boot:run
```

Example (Windows PowerShell):
```powershell
$env:ADMIN_PASSWORD="MySuperSecretPassword!"
./mvnw spring-boot:run
```