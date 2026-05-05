# 🚀 Deploying Backend to Hostinger

Hostinger supports Node.js on most of their VPS and some Shared Hosting plans.

## Step 1: Upload your Files
1. Create a zip of your `server` folder.
2. Log in to Hostinger **File Manager**.
3. Upload and extract the `server` folder into your public directory (e.g., `/public_html/api`).

## Step 2: Set up Node.js (Shared Hosting)
If you are using Hostinger Shared Hosting:
1. Go to **Advanced** > **Node.js**.
2. Select your App directory.
3. Set **App Entry Point** to `index.js`.
4. Click **Install Dependencies** (this runs `npm install`).
5. Click **Start**.

## Step 3: Set up Node.js (VPS)
If you are using a Hostinger VPS:
1. Connect via SSH.
2. Install PM2: `npm install -g pm2`.
3. Navigate to your folder and start the app:
   ```bash
   npm install
   pm2 start index.js --name "agent-api"
   ```

## Step 4: Connecting the Frontend
Once your Hostinger server is running, it will give you a URL (e.g., `http://your-domain.com:5000` or a proxied URL).
1. Copy this URL.
2. Go to your **Vercel Dashboard** (where your Frontend is).
3. Update the **`VITE_API_URL`** environment variable to point to your new Hostinger URL.

---

### 🔑 Important: Port 5000
If you are on a VPS, make sure you open **Port 5000** in the Hostinger Firewall settings, or use a Reverse Proxy (Nginx) to point your domain to the app.
