# Appointment Booking System

## Overview
A healthcare appointment booking system with Spring Boot (MySQL database) backend and React.js frontend.

## Prerequisites
- Java 17
- Node.js 18
- Maven
- MySQL (username: root, password: madhu@9248)
- Docker (optional)

## Backend Setup
1. Ensure MySQL is running with database 'healthcare'.
2. Navigate to `backend/`
3. Update `application.properties` if needed.
4. Run `mvn spring-boot:run`
5. Access Swagger UI at `http://localhost:8080/swagger-ui.html`

## Frontend Setup
1. Navigate to `frontend/`
2. Run `npm install`
3. Run `npm run dev`
4. Access at `http://localhost:3000`

## Roles
- Patient: Register, login, book appointments, view history.
- Admin: Approve hospital/doctor registrations. Default admin: email=admin@example.com, password=admin123
- Hospital: Manage appointments, add records.
- Doctor: Set availability, manage appointments, add records.

## Testing
- Backend: `mvn test`
- Frontend: `npm test`

## Deployment
- Backend: Build with `mvn package` and deploy with Docker
- Frontend: Build with `npm run build` and deploy with Docker or Vercel/Netlify
