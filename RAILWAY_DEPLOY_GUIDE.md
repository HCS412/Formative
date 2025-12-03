# 🚀 Complete Railway Deployment Guide

## Step-by-Step Deployment Instructions

### 📋 Prerequisites
- Railway account (already set up: https://railway.com/project/aadc3cae-41eb-464d-817f-d00380087e94)
- GitHub repository connected
- Railway CLI (optional, but recommended)

---

## 🎯 **Method 1: Deploy via Railway Dashboard** (Easiest)

### Step 1: Set Up PostgreSQL Database

1. Go to your Railway project: https://railway.com/project/aadc3cae-41eb-464d-817f-d00380087e94
2. Click **"+ New"** button
3. Select **"Database"** → **"PostgreSQL"**
4. Railway will create and provision your database automatically
5. **Write down the database service name** (usually "Postgres")

### Step 2: Configure Your Formative Service

1. Click on your **"Formative"** service in Railway dashboard
2. Go to the **"Variables"** tab
3. Click **"+ New Variable"** and add these THREE variables:

   | Variable Name | Value |
   |--------------|--------|
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | `formative-super-secret-jwt-key-2024-change-this` |
   | `PORT` | `3000` |

4. Click **"Add"** for each one

### Step 3: Connect Database to Your Service

1. Still in your "Formative" service
2. Go to the **"Settings"** tab
3. Scroll down to **"Service Connections"**
4. Click **"Connect"** next to your PostgreSQL database
5. Railway will automatically add `DATABASE_URL` environment variable

### Step 4: Configure Build Settings

1. In your "Formative" service, go to **"Settings"** tab
2. Under **"Build Command"**, leave it empty or set to: `npm install`
3. Under **"Start Command"**, set to: `npm start`
4. Under **"Root Directory"**, leave as `/` (root)

### Step 5: Deploy!

1. Make sure all changes are pushed to GitHub:
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push origin main
   ```

2. Railway will automatically detect the push and start deploying!

3. Watch the deployment logs in Railway dashboard

### Step 6: Get Your Live URL

1. In Railway dashboard, click your "Formative" service
2. Go to **"Settings"** tab
3. Under **"Domains"**, click **"Generate Domain"**
4. Railway will give you a URL like: `formative-production.up.railway.app`
5. **Copy this URL!**

---

## 🎯 **Method 2: Deploy via Railway CLI** (Advanced)

### Install Railway CLI:
```bash
npm install -g @railway/cli
```

### Login to Railway:
```bash
railway login
```

### Link Your Project:
```bash
cd /Users/brandonbrooks/.cursor-tutor/Formative
railway link
```
(Select your existing project: aadc3cae-41eb-464d-817f-d00380087e94)

### Set Environment Variables:
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=formative-super-secret-jwt-key-2024-change-this
railway variables set PORT=3000
```

### Deploy:
```bash
railway up
```

### View Logs:
```bash
railway logs
```

---

## ✅ **Verify Deployment**

### 1. Check Health Endpoint
Open in browser or use curl:
```
https://your-app-name.railway.app/api/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-..."
}
```

### 2. Test User Registration
```bash
curl -X POST https://your-app-name.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "userType": "influencer"
  }'
```

Should return user data and JWT token.

### 3. Test User Login
```bash
curl -X POST https://your-app-name.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🔧 **Update Frontend to Use Railway API**

### Option 1: Use Railway as Both Frontend and Backend (Current Setup)
✅ Already configured! Your Railway deployment serves both:
- Frontend files: `https://your-app.railway.app/`
- Backend API: `https://your-app.railway.app/api/`

### Option 2: Keep GitHub Pages for Frontend, Railway for Backend
If you want to keep using GitHub Pages for the frontend:

1. Update API calls in your code to use the Railway URL
2. Add this at the top of your JavaScript files:
```javascript
const API_URL = 'https://your-app-name.railway.app';
```

3. Update all fetch calls to use `API_URL`:
```javascript
fetch(`${API_URL}/api/auth/login`, { ... })
```

---

## 📊 **Monitoring Your Deployment**

### View Logs:
1. Go to Railway dashboard
2. Click your "Formative" service
3. Click **"Logs"** tab
4. See real-time logs

### Check Database:
1. Click on your Postgres service
2. Click **"Data"** tab
3. See your database tables and data

### Metrics:
1. Click **"Metrics"** tab
2. See CPU, memory, network usage

---

## 🐛 **Troubleshooting**

### Error: "Port already in use"
- Railway automatically sets the PORT variable
- Make sure your code uses `process.env.PORT`
- Already configured in your `backend/server.js`

### Error: "Database connection failed"
- Check that Postgres service is running
- Verify `DATABASE_URL` variable is set
- Check connection in Settings → Service Connections

### Error: "Module not found"
- Make sure all dependencies are in `package.json`
- Railway runs `npm install` automatically
- Check build logs for errors

### Frontend can't reach API:
- Check CORS is enabled (already configured)
- Verify API URL is correct
- Check Railway domain is generated

---

## 🎉 **Success Checklist**

- [ ] PostgreSQL database created
- [ ] Environment variables set (NODE_ENV, JWT_SECRET)
- [ ] Database connected to service
- [ ] Deployment successful
- [ ] Domain generated
- [ ] `/api/health` endpoint working
- [ ] User registration working
- [ ] User login working
- [ ] Frontend can communicate with backend

---

## 💡 **Pro Tips**

1. **Custom Domain**: In Settings → Domains, add your own domain
2. **Auto-Deploy**: Railway auto-deploys on every git push to main
3. **Staging Environment**: Create a new Railway environment for testing
4. **Database Backups**: Railway automatically backs up your Postgres database
5. **Logs**: Always check logs when troubleshooting

---

## 📞 **Need Help?**

- Railway Docs: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app/

---

## 🚀 **Your Next Steps**

After successful deployment:

1. **Test the complete user flow:**
   - Sign up → Onboarding → Dashboard → Profile

2. **Create sample data:**
   - Add opportunities
   - Test messaging
   - Upload profile photos

3. **Share your platform:**
   - Give the Railway URL to users
   - Start demoing to clients!

Your Formative platform is now LIVE with a real database! 🎊



