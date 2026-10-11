@echo off
title Check - Production Build Preview
echo ========================================================
echo   Launching Check (Production Build Preview)
echo ========================================================
echo.
echo Starting production preview server...
echo Opening your browser at http://localhost:4173...
echo.
start "" "http://localhost:4173"
call npm run preview
pause
