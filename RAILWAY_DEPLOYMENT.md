# 🚂 Railway Deployment Guide for Formative Platform

## Quick Deploy to Railway

### Method 1: Railway CLI (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Link to your existing project:**
   ```bash
   railway link aadc3cae-41eb-464d-817f-d00380087e94
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

### Method 2: GitHub Integration

1. **Connect your GitHub repository to Railway:**
   - Go to [Railway Dashboard](https://railway.com/project/aadc3cae-41eb-464d-817f-d00380087e94)
   - Click "Connect GitHub Repository"
   - Select your `HCS412/Formative` repository
   - Railway will automatically deploy from your main branch

### Method 3: Railway Dashboard

1. **Manual Deploy:**
   - Go to your Railway project dashboard
   - Click "Deploy from GitHub"
   - Select your repository
   - Railway will automatically detect it's a Node.js project

## 🛠️ Configuration

### Environment Variables (Optional)
Set these in your Railway dashboard if needed:

```
NODE_ENV=production
PORT=3000
```

### Custom Domain (Optional)
1. Go to your Railway project settings
2. Add your custom domain
3. Update DNS records as instructed

## 📊 Monitoring

### View Logs
```bash
railway logs
```

### Check Status
```bash
railway status
```

## 🚀 Deployment Commands

```bash
# Deploy to Railway
npm run railway:deploy

# View logs
npm run railway:logs

# Check deployment status
railway status
```

## 🔧 Troubleshooting

### Common Issues:

1. **Port Issues:**
   - Railway automatically sets the PORT environment variable
   - Our server is configured to use `process.env.PORT || 3000`

2. **Build Failures:**
   - Ensure all dependencies are in package.json
   - Check that start-dev.js is executable

3. **Static Files:**
   - Our custom server serves static files correctly
   - All CSS/JS files are properly linked

## 📱 Your Live URL

Once deployed, your Formative platform will be available at:
`https://your-app-name.railway.app`

## 🔄 Auto-Deploy

Railway can automatically deploy when you push to your main branch:
1. Enable auto-deploy in Railway dashboard
2. Push changes to GitHub
3. Railway automatically builds and deploys

## 📈 Performance

Railway provides:
- Automatic scaling
- Global CDN
- SSL certificates
- Health checks
- Monitoring and analytics

## 🎯 Next Steps

After deployment:
1. Test your live application
2. Set up custom domain (optional)
3. Configure environment variables
4. Monitor performance and logs
5. Set up auto-deploy from GitHub
