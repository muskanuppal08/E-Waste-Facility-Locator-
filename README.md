# E-Waste Facility Locator — Authentication System

## Tech Stack
- **Backend:** Laravel 11 (Auth + API)
- **Frontend:** Blade Templates + React (Vite)
- **Database:** MySQL
- **Microservice:** Spring Boot (optional, future-ready)

## Quick Setup

### 1. Laravel Setup
```bash
cd laravel
composer install
cp .env.example .env
php artisan key:generate

# Configure .env:
# DB_DATABASE=ewaste_db
# MAIL_MAILER=smtp
# MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD

php artisan migrate --seed
npm install && npm run dev
php artisan storage:link
php artisan serve
```

### 2. Spring Boot Setup (Optional)
```bash
cd spring-boot
./mvnw spring-boot:run
# Runs on http://localhost:8081
```

## Credentials (after seeding)
- **Admin:** admin@ewaste.com / password
- **User:** user@ewaste.com / password

## Routes
| Route | Description |
|---|---|
| `/` | Home (role selection) |
| `/register` | User registration |
| `/login` | User login |
| `/admin/login` | Admin login |
| `/dashboard` | User dashboard |
| `/admin/dashboard` | Admin dashboard |
| `/profile` | User profile |
| `/forgot-password` | Password reset |
| `/verify-email` | Email verification |

## API Endpoints (Spring Boot - Port 8081)
| Endpoint | Description |
|---|---|
| `GET /api/analytics/users` | User statistics |
| `GET /api/rewards/{userId}` | Reward points |
| `POST /api/rewards/{userId}/calculate` | Calculate points |