# 🏁 Master Full-Stack Deployment Guide

This is the final, consolidated guide for your **Neon (DB) + Hostinger (Backend) + Vercel (Frontend)** stack.

---

## 1️⃣ Step 1: Database (Neon.tech)
1. Log in to [Neon.tech](https://neon.tech).
2. Copy your **Connection String** (it starts with `postgresql://`).
3. This is your **`DATABASE_URL`**.

---

## 2️⃣ Step 2: Backend (Hostinger)
1. **Upload**: Upload the `server` folder to your Hostinger account.
2. **Environment Variables**: Set these in your Hostinger Node.js configuration or `.env` file:
   - `DB_TYPE`: `postgres`
   - `DATABASE_URL`: *(Paste your Neon string)*
   - `JWT_SECRET`: *(A long random string)*
   - `PORT`: `5000` (or whatever Hostinger provides)
3. **Start**: Install dependencies (`npm install`) and start the server (`node index.js` or use PM2).
4. **Copy URL**: Once live, copy your Hostinger API URL (e.g., `https://api.yourdomain.com`).

---

## 3️⃣ Step 3: Frontend (Vercel)
1. Log in to [Vercel](https://vercel.com) and import your repo.
2. **Root Directory**: Select **`client`**.
3. **Environment Variables**:
   - Add Key: **`VITE_API_URL`**
   - Add Value: *(Paste your Hostinger API URL from Step 2)*
4. **Deploy**: Click Deploy and you are live!

---

### 🛡️ Security Note
Your `.env` file and `node_modules` are automatically ignored by Git to keep your credentials safe. Always set your secrets directly in the Hostinger/Vercel dashboards.
