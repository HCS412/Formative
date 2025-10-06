# 🚂 Railway Environment Variables Setup

## Required Environment Variables

Set these in your Railway project dashboard:

### Database Connection
```
DATABASE_URL=postgresql://username:password@host:port/database
```
*Railway automatically provides this when you connect your Postgres service*

### JWT Secret
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Node Environment
```
NODE_ENV=production
```

## 🔧 How to Set Environment Variables in Railway:

1. **Go to your Railway project dashboard**
2. **Click on your "Formative" service**
3. **Go to the "Variables" tab**
4. **Add the following variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `JWT_SECRET` | `your-super-secret-jwt-key-here` | JWT signing secret |
| `DATABASE_URL` | *(auto-provided)* | Postgres connection string |

## 🔗 Connecting Services in Railway:

1. **In your Railway project dashboard:**
2. **Click on your "Formative" service**
3. **Go to "Settings" tab**
4. **Click "Connect" next to your Postgres service**
5. **Railway will automatically set the DATABASE_URL**

## 🚀 Deployment Steps:

1. **Set environment variables** (see above)
2. **Connect Postgres service** to your Formative service
3. **Deploy** - Railway will automatically:
   - Install dependencies from package.json
   - Run the backend server
   - Connect to your Postgres database
   - Initialize database tables

## 📊 Database Initialization:

The backend will automatically:
- Create all necessary tables
- Set up relationships between tables
- Insert sample data for testing

## 🔍 Testing Your API:

Once deployed, test these endpoints:

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/opportunities` - Get opportunities
- `POST /api/opportunities` - Create opportunity (requires auth)

## 🎯 Your Live API:

Your API will be available at:
`https://your-app-name.railway.app/api/`

## 🔧 Troubleshooting:

### Database Connection Issues:
- Ensure Postgres service is running
- Check DATABASE_URL is set correctly
- Verify service connection in Railway dashboard

### Authentication Issues:
- Ensure JWT_SECRET is set
- Check token expiration (7 days default)
- Verify user exists in database

### Deployment Issues:
- Check Railway logs for errors
- Ensure all dependencies are in package.json
- Verify environment variables are set
