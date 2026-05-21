@echo off
REM Production Deployment Script for Windows
REM Usage: deploy.bat

setlocal enabledelayedexpansion

echo.
echo 🚀 Starting Hunar Hub Production Deployment...
echo.

REM Check Node version
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node version: %NODE_VERSION%

REM Check pnpm
where /q pnpm
if errorlevel 1 (
    echo ✗ pnpm not found. Installing globally...
    npm install -g pnpm
) else (
    echo ✓ pnpm is installed
)

REM Check environment file
if not exist .env.local (
    echo ✗ .env.local not found!
    echo   Please copy .env.example to .env.local and fill in the values
    exit /b 1
)
echo ✓ .env.local found

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call pnpm install
if errorlevel 1 (
    echo ❌ Dependency installation failed
    exit /b 1
)

REM Build project
echo.
echo 🔨 Building project...
call pnpm build
if errorlevel 1 (
    echo.
    echo ❌ Build failed. Check errors above.
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo 📊 Build summary:
echo   - Framework: Next.js 14+
echo   - Language: TypeScript
echo   - Database: MongoDB
echo   - Authentication: NextAuth.js
echo   - Hosting: Ready for Vercel/Docker
echo.
echo 🚀 To start the production server:
echo   pnpm start
echo.
echo ✨ Project is ready for deployment!
echo.

endlocal
