@echo off
echo Installing dependencies...
call npm install

echo.
echo Starting Personal Trainer App...
echo Opening browser at http://localhost:3000
timeout /t 2

start http://localhost:3000

call npm start
pause
