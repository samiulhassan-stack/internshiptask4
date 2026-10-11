@echo off
echo ================================
echo Event Registration Form
echo ================================
echo.
echo Installing dependencies...
call npm install
echo.
echo ================================
echo Starting servers...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press Ctrl+C to stop both servers
echo ================================
echo.
call npm run dev
