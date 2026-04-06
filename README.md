# admin employee task management system(MERN)

This is a full-stack Task Management System built using the MERN stack. The main idea of this project is to manage employees and their tasks efficiently with proper role-based access.

The application has two separate portals — one for Admin and one for Employees — with controlled access and real-time task tracking.

# features
## admin portal
View overall dashboard with employee and task details
Approve or reject newly registered employees
Assign tasks to approved employees
Track task progress (Pending, In Progress, Completed)
## employee portal
Register and wait for admin approval
View assigned tasks in a simple dashboard
Update task status based on progress
Track personal task activity
# tech stack
Frontend: React (Vite), Tailwind CSS, Framer Motion
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Authentication: JWT
# how to run the project
1.backend setup
cd server
npm install

create a .env file inside the server folder:

PORT=5000
MONGO_URI=mongodb://localhost:27017/admin_employee
JWT_SECRET=supersecret123

Seed the admin user:

node seed.js

start the backend:

npm start
2.frontend setup
cd client
npm install
npm run dev

Open in browser:

http://localhost:5173
📂 Project Structure
admin_employee_portal/
├── client/        #react frontend
├── server/        #node and express for backend
models/ → database schemas
routes/ → api endpoints
middleware/ → auth and role checking
context/ → state management(frontend)
# database design

the project uses separate collections:

admins → stores admin details
employees → stores employee data + approval status
tasks → stores tasks assigned to employees
# security
JWT authentication for login sessions
role-based access (Admin / Employee)
employees can access dashboard only after admin approval