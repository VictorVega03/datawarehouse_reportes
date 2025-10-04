@echo off
cd /d "%~dp0"
echo Starting backend server...
call node_modules\.bin\tsx src\server.ts
