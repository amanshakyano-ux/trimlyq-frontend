 
 
# trimlyq-frontend
TrimlyQ is a full-stack salon booking platform built with React.js, Node.js, Express.js, MySQL, and Sequelize. It allows users to search salons, view services, check available slots, book appointments, make online payments, and manage bookings. Salon owners can manage salons, services, bookings, and mark appointments as completed.
 
Frontend Setup
1. Clone the Frontend Repository
git clone <your-frontend-repo-url>
cd <frontend-folder-name>
2. Install Dependencies
npm install
3. Create .env File

Create a .env file in the frontend root folder.

For local backend:

VITE_API_URL=http://localhost:3000

For deployed backend:

VITE_API_URL=https://your-backend-url.onrender.com

Do not add a slash / at the end of the backend URL.

Correct:

VITE_API_URL=http://localhost:3000

Wrong:

VITE_API_URL=http://localhost:3000/
4. Start Frontend
npm run dev

Frontend will run on:

http://localhost:5173
How to Use the App Locally
1. Start Backend
cd backend-folder
npm run dev
2. Start Frontend

Open another terminal:

cd frontend-folder
npm run dev
3. Open Frontend
http://localhost:5173
User Flow
Normal User

A user can:

Sign up
Login
Search salons
View salon details
Select a service
Choose booking date
Choose available time slot
Make payment
View bookings
Cancel bookings
Salon Owner

A salon owner can:

Sign up as owner
Login
Create salon
Edit salon
Delete salon
Add services
Edit services
Delete services
View salon bookings
Mark bookings as completed