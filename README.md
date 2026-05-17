📋 Prerequisites
They must have the following installed on their system:

PHP (v8.2 or higher)

Composer (PHP package manager)

Node.js & NPM (For React/Vite)

🚀 Setup Instructions
1. Clone the repository and enter the directory:
Bash
git clone https://github.com/your-username/eco-locator.git
cd eco-locator

2. Install Backend Dependencies (Laravel):
Bash
composer install

3. Install Frontend Dependencies (React & Tailwind):
Bash
npm install

4. Setup the Environment File:
Laravel requires a .env file to store secret configurations. Duplicate the example file:

Bash
# On Mac/Linux:
cp .env.example .env

# On Windows (Command Prompt):
copy .env.example .env

5. Generate the Application Key:
This encrypts cookies and standard Laravel data.
Bash
php artisan key:generate

6. Configure the .env File:
Open the newly created .env file in your code editor and update these specific lines:

Change the Database to SQLite:
Delete or comment out all the DB_HOST, DB_PORT, etc. lines, and just set the connection to sqlite.

Code snippet
DB_CONNECTION=sqlite
Fix the Session Driver:
Since we use Clerk for auth, prevent Laravel from looking for a database session table.

Code snippet
SESSION_DRIVER=file

Add the Clerk API Key:
Add this line anywhere in the file (usually at the bottom) so the React frontend can authenticate users.
Code snippet
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxx

7. Build the Database & Inject Seed Data:
Because we configured SQLite in the .env file, running this command will automatically create the database.sqlite file, build all the tables, and inject our real-world facility and device yield data!
Bash
php artisan migrate:fresh --seed

8. Start the Development Servers:
You need to run both the backend API and the frontend compiler simultaneously. Open two separate terminal windows.

In Terminal 1 (Starts the PHP Backend):
Bash
php artisan serve

In Terminal 2 (Starts the Vite/React Compiler):
Bash
npm run dev

🎉 You're Done!
Open your browser and visit http://localhost:8000. The full EcoLocator platform is now running locally on their machine, complete with live OpenStreetMap geolocation and Clerk authentication!