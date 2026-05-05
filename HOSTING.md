# Hosting Guide: ResellerClub Cloud (cPanel)

Follow these steps to host your Node.js backend and React frontend on ResellerClub Cloud. This project includes a responsive Login, Signup, and Dashboard.

## 1. Prepare React Frontend
1.  Navigate to the `client` directory: `cd client`
2.  Build the project: `npm run build`
3.  This will create a `dist` folder.
4.  Compress the **contents** of the `dist` folder into a ZIP file.
5.  Upload this ZIP to your cPanel's `public_html` directory via **File Manager**.
6.  Extract the ZIP.
7.  **Handle Routing:** Create a `.htaccess` file in `public_html` and paste:
    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>
    ```

## 2. Prepare Node.js Backend
1.  In cPanel, create a new folder named `api-server` in your home directory (above `public_html`).
2.  Upload the `server` folder contents (excluding `node_modules` and `database.sqlite`) to `api-server`.
3.  Go to **"Setup Node.js App"** in cPanel.
4.  Click **"Create Application"**.
5.  Set **Application root** to `api-server`.
6.  Set **Application URL** to your desired endpoint (e.g., `yourdomain.com/api`).
7.  Set **Application startup file** to `index.js`.
8.  Click **"Create"**.
9.  Click **"Run NPM Install"** in the Node.js App interface.

## 3. Database Setup (MySQL)
1.  Go to **"MySQL Databases"** in cPanel.
2.  Create a new database (e.g., `youruser_demodb`).
3.  Create a new user and password.
4.  Add the user to the database with all privileges.
5.  In the **"Setup Node.js App"** interface, add the following **Environment Variables**:
    *   `DB_TYPE`: `mysql`
    *   `DB_HOST`: `localhost`
    *   `DB_USER`: `youruser_dbuser`
    *   `DB_PASSWORD`: `yourpassword`
    *   `DB_NAME`: `youruser_demodb`
    *   `JWT_SECRET`: `a_long_random_string`
6.  Restart the Node.js application.

## 4. Final Connection
*   Ensure your React app's API calls point to the correct production URL. 
*   If you hosted the API at `yourdomain.com/api`, update the frontend code from `http://localhost:5000/api` to `/api` (if using a relative path on the same domain).
