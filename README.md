# Chopade Clinical Laboratory Management System
A production-grade, secure Progressive Web Application (PWA) for managing clinical pathology operations.

🏥 Overview
This system digitizes the workflow for Chopade Clinical Lab, enabling:

Patients: To book appointments, request home visits, and view test history.

Lab Managers: To manage the Test Rate Card, track appointments, and verify payments.

🚀 Key Features
Smart Booking Wizard: Multi-step form for selecting tests (e.g., CBC, Lipid Profile) and scheduling.

Home Collection: Logic to handle home visit requests with automatic convenience fee calculation.

Digital Rate Card: Admin-managed list of tests and prices.

PWA Mobile App: Installable on Android/iOS for instant access.

🛠 Tech Stack
Backend: Java 17, Spring Boot 3, PostgreSQL (Dockerized).

Frontend: React 19, Vite, TanStack Query, Tailwind CSS.

Security: Role-Based Access Control (RBAC) with JWT.

🔐 Security Configuration
Important: This application uses Environment Variables for sensitive credentials.

Required Environment Variables (Render/Local):
SPRING_DATASOURCE_URL: Your PostgreSQL connection string.

JWT_SECRET: A secure random string for token signing.

ADMIN_PASSWORD: The password for the default admin account (Seeded on first run).

🏁 Getting Started
Backend: cd backend -> ./mvnw spring-boot:run

Frontend: cd frontend -> npm install -> npm run dev

Access: Open http://localhost:5173.