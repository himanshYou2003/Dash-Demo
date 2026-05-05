# 🚀 Deploying the Frontend to Vercel

Vercel is the best place to host your React Dashboard. 

## Step 1: Push to GitHub
Make sure your latest code is on GitHub.

## Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New** > **Project**.
3. Import your `Dash-Demo` repository.
4. **Configure Project Settings**:
   - **Framework Preset**: `Vite` (Should be detected automatically)
   - **Root Directory**: `client` 👈 **IMPORTANT**
5. **Environment Variables**:
   - Click the "Environment Variables" dropdown.
   - Add Key: **`VITE_API_URL`**
   - Add Value: *(The URL of your live Backend API)*
6. Click **Deploy**!

---

## 🛠️ What about the Backend?
If Render is asking for a card, try **Koyeb** (koyeb.com). 
1. Log in to Koyeb.
2. Create a "New Service".
3. Connect your GitHub.
4. Set **Root Directory** to `server`.
5. Koyeb often has a **"Nano" instance** that is free and doesn't require a card for many regions.
