# 🚂 Railway Setup Guide for Formative Platform

## 🎯 Quick Setup Steps

### 1. **Set Environment Variables**

Go to your [Railway Project](https://railway.com/project/aadc3cae-41eb-464d-817f-d00380087e94):

**For your "Formative" service:**
1. Click on **"Formative"** service
2. Go to **"Variables"** tab
3. Add these variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `JWT_SECRET` | `formative-super-secret-jwt-key-2024` | JWT signing secret |

### 2. **Connect Database**

1. In your Railway dashboard
2. Click on **"Formative"** service
3. Go to **"Settings"** tab
4. Click **"Connect"** next to your **Postgres** service
5. Railway will automatically set `DATABASE_URL`

### 3. **Deploy & Test**

Railway will automatically:
- Install dependencies
- Start your backend server
- Initialize database tables
- Make your API live

## 🔍 **Testing Your Setup**

### **Check if everything is working:**

1. **Health Check:**
   ```
   https://your-app-name.railway.app/api/health
   ```

2. **Test Registration:**
   ```bash
   curl -X POST https://your-app-name.railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123","userType":"influencer"}'
   ```

3. **Test Login:**
   ```bash
   curl -X POST https://your-app-name.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

## 🗄️ **Database Tables Created**

Your database will automatically have:
- **`users`** - User accounts
- **`opportunities`** - Collaboration opportunities  
- **`applications`** - User applications
- **`messages`** - Messaging system

## 🚀 **Your Live URLs**

- **Frontend:** `https://your-app-name.railway.app/`
- **API:** `https://your-app-name.railway.app/api/`
- **Health Check:** `https://your-app-name.railway.app/api/health`

## 🔧 **Troubleshooting**

### **If signup button doesn't work:**
1. Check browser console for errors
2. Ensure JavaScript is enabled
3. Try refreshing the page

### **If database connection fails:**
1. Check `DATABASE_URL` is set
2. Verify Postgres service is running
3. Check Railway logs for errors

### **If API calls fail:**
1. Ensure environment variables are set
2. Check that backend is running
3. Verify CORS is configured

## 📊 **Monitoring**

- **Railway Logs:** Check your service logs in Railway dashboard
- **Database:** Check Postgres service status
- **API Health:** Visit `/api/health` endpoint

## 🎯 **Next Steps**

Once everything is working:
1. Test user registration
2. Test user login  
3. Create some opportunities
4. Test the full user flow

Your Formative platform will be fully functional with real user accounts! 🌟
