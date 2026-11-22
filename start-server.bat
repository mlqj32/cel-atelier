@echo off
cd /d "%~dp0"
echo Serving CEL ATELIER at http://127.0.0.1:8788/
python -m http.server 8788
pause
