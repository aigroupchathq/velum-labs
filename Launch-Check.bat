@echo off
title Check - Verified Human Compatibility
echo ========================================================
echo   Launching Check - Verified Human Compatibility
echo ========================================================
echo.
echo Starting development server...
echo Opening your browser at http://localhost:5173...
echo.
start "" "http://localhost:5173"
call npm run dev
pause
