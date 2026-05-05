# 🚀 Deploying to Render.com

Follow these steps to get your Full-Stack Agent Workspace live.

## Step 1: Push your code to GitHub
Render connects directly to your GitHub repository. Make sure your latest changes are pushed.

## Step 2: Deploy the Backend (Web Service)
1. Log in to [Render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Set the following configurations:
   - **Name**: `agent-workspace-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Click **Advanced** and add these **Environment Variables**:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: (Generate a long random string)
   - `DB_TYPE`: `mysql` or `postgres` (Don't use sqlite on Render)
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: (From your Render database)

## Step 3: Deploy the Frontend (Static Site)
1. Click **New +** > **Static Site**.
2. Connect the same GitHub repository.
3. Set the following configurations:
   - **Name**: `agent-workspace-dashboard`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **IMPORTANT**: You must update the `baseURL` in your code (e.g., in a `config.js` or directly in Axios calls) to point to your **Backend URL** (the one from Step 2).

## 💡 Pro Tip: Using a Managed Database
On Render, click **New +** > **PostgreSQL**. Once created, copy the "Internal Database URL" and use it in your Server's environment variables. 

> [!WARNING]
> Do not use `database.sqlite` on Render! It will be deleted every time the server restarts. Use a Render PostgreSQL instance instead.
