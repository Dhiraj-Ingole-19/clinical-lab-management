# Development Workflow Strategy: "Local-First"

This document outlines the standard procedure for developing features for **Chopade Clinical Lab** to ensure speed and stability.

## 🔴 The Golden Rule
**Do NOT deploy to Render/Vercel for small changes.**
Deployments take 10-20 minutes. Only deploy when a full feature set is complete and tested locally.

## 1. Local Development Loop (Fast)

### Backend (Java/Spring Boot)
*   **Run**: `mvn spring-boot:run` or use your IDE's "Run" button.
*   **Port**: `http://localhost:8080`
*   **Database**: Connects to the Render DB (if configured in `application.properties`) or a local DB.

### Frontend (React/Vite)
*   **Run**: `npm run dev`
*   **Port**: `http://localhost:5173`
*   **API Connection**: Automatically proxies to `localhost:8080` (or `VITE_API_URL` if set).

## 2. When to Push to GitHub (Trigger Deployment)
Only push to `main` when:
1.  **Feature is Complete**: All UI and Backend logic works locally.
2.  **Tests Pass**: Verify basic flows (Login, Booking, Admin Dashboard).
3.  **Code is Clean**: No `console.log` spam or unused imports.

## 3. Deployment Checklist
Before pushing, run these commands to catch errors early:

**Backend**:
\`\`\`bash
cd backend
./mvnw clean package -DskipTests
\`\`\`
*(If this fails, Render will fail too)*

**Frontend**:
\`\`\`bash
cd frontend
npm run build
\`\`\`
*(If this fails, Vercel will fail too)*

## 4. Troubleshooting Slowness
*   **Backend Startup Slow?** We enabled `lazy-initialization=true`. Beans are now created only when needed.
*   **Database Slow?** We tuned HikariCP connection timeouts to handle Render's "sleeping" database better.
