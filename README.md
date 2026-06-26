# E-Waste Facility Locator & Gamified Recycling Platform

A comprehensive, gamified platform designed to encourage responsible electronic waste disposal. Users can locate nearby certified recycling centers, calculate their recycling rewards, earn badges, rise through eco-levels on a global leaderboard, and schedule free doorstep pickups.

---

## 🚀 Implemented Modules

1. **Module 1: Authentication & Profile Management**
   - Separate login portals for standard users and admins.
   - Profile management with dynamic custom profile picture uploads, verified email middleware, and password enforcement rules.
2. **Module 2: Certified Facility Locator**
   - Interactive center locator featuring geographical nearby calculations and search queries.
   - Expandable details pane displaying accepted items, operating times, and star ratings/comments.
3. **Module 3: E-Waste Education**
   - Educational resource detail database for key devices (Mobile, Laptop, Battery, TV, Printer, etc.).
   - Interactive popups highlighting harmful materials, health hazards, and environmental impacts.
4. **Module 4: Reward Calculator & Admin Moderation**
   - Carbon offset, metal recovery, and eco-point calculator tool based on retired hardware statistics.
   - Admin review moderation board to approve/reject user center reviews before they go public.
5. **Module 5: Gamification System**
   - Dynamic Green Levels: *Eco Beginner*, *Green Warrior*, and *Earth Saver*.
   - Automatic badges allocation system based on user achievements.
   - Global Leaderboard showcasing points, rankings, and unlocked badge achievements.
6. **Module 6: E-Waste Home Pickup Request**
   - Doorstep collection scheduling wizard including device category cards, future date filters, and preferred time slots.
   - Interactive user logs to monitor scheduled pickups and cancel pending requests.
   - Admin/Recycling partner scheduling console to manage collections, add driver notes, and update statuses inline.
7. **Module 7: Admin Panel**
   - **Manage Users**: Toggle user/admin roles, delete user profiles, and view member parameters.
   - **Manage Reward Points**: Adjust user eco-points dynamically via an administrative modal form (milestone badges re-evaluate automatically).
   - **Manage Education**: Dedicated page to manage educational device hazards data.
   - **Generate Reports**: Downloadable CSV reports for registered users, certified facilities, and pickup collection logs.

---

## 🛠️ Quick Local Setup

### 1. Database & Backend Setup
```bash
# Install PHP dependencies
composer install

# Copy environment file and generate app key
cp .env.example .env
php artisan key:generate

# Set up your DB details in .env (DB_DATABASE, DB_USERNAME, DB_PASSWORD)

# Run migrations and seed database
php artisan migrate:fresh --seed

# Create storage symlink for uploaded avatars
php artisan storage:link

# Start the Laravel application server
php artisan serve
```
*(Backend server runs on: `http://127.0.0.1:8000`)*

### 2. Frontend Assets compilation
```bash
# Install JS dependencies
npm install

# Compile production bundles
npm run build

# Start the Vite development hot-reload server (optional, for active editing)
npm run dev
```

---

## 🔑 Default Seed Credentials
You can log in immediately after running `php artisan db:seed` using these defaults:
- **Standard User**: `user@ewaste.com` / `password`
- **System Admin**: `admin@ewaste.com` / `password`

---

## 🔗 Complete Application URLs / Routes

Here is the table of all routes and URLs you can visit to go through and verify the application's functionality:

| URL Path | Access Level | Applicable Module | Description / Features to Verify |
| :--- | :--- | :--- | :--- |
| **[`/`](http://127.0.0.1:8000/)** | Public | Module 1 & 6 | **Landing Page**: Upgraded dashboard selector containing side-by-side **Log In** & **Register** buttons for users, guest lookup, and admin access. |
| **[`/login`](http://127.0.0.1:8000/login)** | Public | Module 1 | **User Login**: Standard user authentication page. |
| **[`/register`](http://127.0.0.1:8000/register)** | Public | Module 1 | **User Register**: Sign up page to create a new user profile. |
| **[`/admin/login`](http://127.0.0.1:8000/admin/login)** | Public | Module 1 | **Admin Login**: Separate login form tailored specifically for administrative credentials. |
| **[`/locator`](http://127.0.0.1:8000/locator)** | Public / User | Module 2 | **Facility Locator**: Interactive map to filter centers by state/city/devices, read reviews, and write reviews (requires login). |
| **[`/dashboard`](http://127.0.0.1:8000/dashboard)** | User (`role:user`) | Module 1 | **User Dashboard**: Welcome view and navigation menu for authenticated users. |
| **[`/calculator`](http://127.0.0.1:8000/calculator)** | User (`role:user`) | Module 4 | **Reward Calculator**: Visual device selector wizard; estimates eco-points, recovered metals, and carbon offset values. |
| **[`/leaderboard`](http://127.0.0.1:8000/leaderboard)** | User (`role:user`) | Module 5 | **Leaderboard & Badges**: Leaderboard rankings, animated level status indicators, and unlocked/locked badge achievements grid. |
| **[`/pickups`](http://127.0.0.1:8000/pickups)** | User (`role:user`) | Module 6 | **Home Pickups**: Schedule doorstep collections, select slots/future dates, track historical requests, and cancel pending orders. |
| **[`/profile`](http://127.0.0.1:8000/profile)** | User (`role:user`) | Module 1 | **Profile Manager**: Edit profile details, change passwords, and upload/delete custom avatar images. |
| **[`/admin/dashboard`](http://127.0.0.1:8000/admin/dashboard)** | Admin (`role:admin`) | Module 1 & 4 | **Admin Dashboard**: Displays aggregate analytics metrics for users, facilities, and calculations. |
| **[`/admin/facilities`](http://127.0.0.1:8000/admin/facilities)** | Admin (`role:admin`) | Module 2 | **Facility CRUD Manager**: Admin panel to add, edit, or delete certified recycling centers. |
| **[`/admin/reviews`](http://127.0.0.1:8000/admin/reviews)** | Admin (`role:admin`) | Module 4 | **Review Moderation**: Approve or delete pending reviews submitted by users. |
| **[`/admin/pickups`](http://127.0.0.1:8000/admin/pickups)** | Admin (`role:admin`) | Module 6 | **Manage Pickups**: Schedule pending pickups, mark completed, and log driver instructions. |
| **[`/admin/users`](http://127.0.0.1:8000/admin/users)** | Admin (`role:admin`) | Module 7 | **Manage Users**: Toggle user/admin roles, delete users, and adjust user eco-points. |
| **[`/admin/education`](http://127.0.0.1:8000/admin/education)** | Admin (`role:admin`) | Module 7 | **Manage Education**: Add, edit, or delete educational device hazard profiles. |
| **[`/admin/reports`](http://127.0.0.1:8000/admin/reports)** | Admin (`role:admin`) | Module 7 | **System Reports**: View summary statistics and export database tables. |

---

## ⚡ API Endpoints (Laravel API Routes)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/facilities/nearby` | Resolves centers closest to specified coordinates (`lat`, `lng`). |
| `GET` | `/api/facilities/search` | Performs text matches over certified facility attributes (city, state, code, device). |
| `GET` | `/api/facilities/{id}` | Fetches details and approved reviews for a single facility. |
| `POST` | `/api/facilities/{id}/review` | Saves a new star rating and review comment (auth required). |
| `GET` | `/api/devices` | Returns educational details, hazardous elements, and health facts for electronic devices. |
| `GET` | `/admin/reports/download/{type}` | Generates and downloads a CSV report for `users`, `facilities`, or `pickups` (admin required). |