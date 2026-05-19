@echo off
setlocal

cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo Creating local Python environment...
  python -m venv .venv
  if errorlevel 1 goto error
)

echo Installing or checking dependencies...
".venv\Scripts\python.exe" -m pip install -r dev\requirements.txt
if errorlevel 1 goto error

echo Starting Voice Input Memo WebUI...
".venv\Scripts\python.exe" dev\web_app.py
if errorlevel 1 goto error

exit /b 0

:error
echo.
echo Could not start Voice Input Memo.
echo Please check that Python is installed and available from PowerShell or Command Prompt.
pause
exit /b 1
