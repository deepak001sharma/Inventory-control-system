@echo off
echo Starting Inventory Management System...

echo Starting Backend...
start "Backend Server" cmd /k "cd backend && node server.js"

echo Starting Frontend...
start "Frontend Site" cmd /k "cd frontend && npm run dev"

echo Both servers are starting! Please leave the two popup windows open.
pause
