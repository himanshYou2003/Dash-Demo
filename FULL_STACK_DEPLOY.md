# 🏁 Full-Stack Deployment Guide (Neon + Vercel)

Follow these 3 steps in order to link your database, backend, and frontend.

---

## Step 1: Set up Neon (The Database)
1. Log in to [Neon.tech](https://neon.tech).
2. Create a new project.
3. On the Dashboard, find the **Connection String** (it starts with `postgresql://`).
4. **Copy this string.** (This is your `DATABASE_URL`).

---

## Step 2: Deploy the Server (The Backend)
1. Go to [Vercel](https://vercel.com) > **Add New** > **Project**.
2. Select your repository.
3. **Configure Project**:
   - **Name**: `agent-api`
   - **Root Directory**: `server`
4. **Environment Variables** (Add these):
   - `DB_TYPE`: `postgres`
   - `DATABASE_URL`: *(Paste the string from Step 1)*
   - `JWT_SECRET`: (Your random secret)
5. **Deploy!** 
6. Once finished, Vercel will give you a URL (e.g., `https://agent-api.vercel.app`). **Copy this URL.**

---

## Step 3: Deploy the Client (The Frontend)
1. Go to Vercel > **Add New** > **Project**.
2. Select the **same** repository.
3. **Configure Project**:
   - **Name**: `agent-dashboard`
   - **Root Directory**: `client`
4. **Environment Variables** (Add this):
   - `VITE_API_URL`: *(Paste the Server URL from Step 2)*
5. **Deploy!**

---

### ✅ Success!
Your Frontend now talks to your Backend, and your Backend talks to your Neon Database. 

> [!TIP]
> If you make any changes to your code locally and push to GitHub, Vercel will automatically redeploy both the client and the server for you!
