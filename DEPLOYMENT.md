# ResuMate AI - Deployment Guide

## Overview
ResuMate AI is a full-stack MERN application consisting of:
- **Frontend**: React + Vite (deploy to Vercel)
- **Backend**: Node.js + Express (deploy to Render or Railway)
- **Database**: MongoDB Atlas (cloud-hosted)

---

## Prerequisites

Before deploying, ensure you have accounts for:
1. **MongoDB Atlas** (https://www.mongodb.com/cloud/atlas)
2. **Vercel** (https://vercel.com) - for frontend
3. **Render** (https://render.com) or **Railway** (https://railway.app) - for backend
4. **OpenAI API** (https://platform.openai.com) - for AI features
5. **ImageKit** (https://imagekit.io) - for image processing

---

## Step 1: Get Required API Keys

### 1.1 OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Set spending limits and key permissions
4. Copy the key (starts with `sk-`)

### 1.2 ImageKit Credentials
1. Sign up at https://imagekit.io
2. Go to Dashboard → Developer → API Keys
3. Copy the **Private Key**
4. (Optional) Note Public Key and URL Endpoint for image delivery

### 1.3 MongoDB Atlas Connection
1. Go to https://cloud.mongodb.com
2. Select your cluster
3. Click "Connect" → "Drivers"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Ensure your IP is whitelisted (Security → Network Access)

### 1.4 JWT Secret
Generate a strong random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 2: Environment Variable Setup

### Server (.env)
1. Copy `server/.env.example` to `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```

2. Fill in the values:
   ```env
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net
   JWT_SECRET=<generated-random-string>
   CLIENT_URL=https://resumate.vercel.app  # Update with your frontend URL
   OPENAI_API_KEY=sk-...
   IMAGEKIT_PRIVATE_KEY=private_...
   PORT=3000
   NODE_ENV=production
   ```

### Client (.env.local for development)
Already created. For production, use Vercel environment variables.

---

## Step 3: Deploy Backend

### Option A: Deploy to Render (Recommended for Free Tier)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Dashboard → New → Web Service
   - Select your GitHub repository
   - Configure:
     - Name: `resumate-api` (or your choice)
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `node server/server.js`
     - Region: Choose closest to your users

3. **Set Environment Variables**
   - In Render dashboard, go to Environment
   - Add all variables from `server/.env`:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `OPENAI_API_KEY`
     - `IMAGEKIT_PRIVATE_KEY`
     - `CLIENT_URL=https://your-frontend-domain.vercel.app`
     - `PORT=3000` (Render sets this automatically)
     - `NODE_ENV=production`

4. **Deploy**
   - Render auto-deploys on push to main branch
   - Watch deployment logs in dashboard
   - Wait for "Service is live at https://resumate-api.onrender.com"

### Option B: Deploy to Railway

1. Go to https://railway.app
2. Create new project
3. Deploy from GitHub
4. Add environment variables
5. Railway will auto-detect Node.js and deploy

---

## Step 4: Deploy Frontend

### Deploy to Vercel

1. **Connect Repository**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel auto-detects Vite + React

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `./client`

3. **Set Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add:
     ```
     VITE_BASE_URL=https://resumate-api.onrender.com
     ```
   - (Replace with your actual backend URL)

4. **Deploy**
   - Vercel auto-deploys on push to main branch
   - Visit https://resumate.vercel.app (or your custom domain)

---

## Step 5: Verify Deployment

### Test Backend Health
```bash
curl https://resumate-api.onrender.com/
# Expected: "Server is live..."
```

### Test API Endpoints
1. Register a new user
2. Login
3. Create a resume
4. Test ATS scoring

### Monitor Logs
- **Backend**: Render Dashboard → Logs
- **Frontend**: Vercel Dashboard → Functions/Analytics
- **Database**: MongoDB Atlas → Monitoring

---

## Step 6: Post-Deployment Configuration

### 1. MongoDB Atlas Security
- **IP Whitelist**: Add your backend server IP
  - Go to Security → Network Access
  - Add current IP (Render provides static IPs in paid tier)
  - Or use "Allow Access from Anywhere" (0.0.0.0/0) for development

- **Database User**: Create dedicated database user
  - Security → Database Access
  - Set strong password
  - Restrict to your database only

### 2. CORS Configuration
- Backend already configured to accept `CLIENT_URL`
- After Vercel deployment, update `CLIENT_URL` env var in Render

### 3. OpenAI API Monitoring
- Set spending limits in OpenAI dashboard
- Monitor usage: https://platform.openai.com/account/usage/overview
- Set billing alerts

### 4. ImageKit Configuration
- (Optional) Set up custom domain for image delivery
- Configure transformation rules in ImageKit dashboard

---

## Troubleshooting

### Backend won't start
- Check all environment variables are set
- Verify MongoDB URI is correct
- Ensure IP is whitelisted in MongoDB Atlas
- Check OpenAI API key is valid
- View logs in Render dashboard

### Frontend can't reach backend
- Verify `VITE_BASE_URL` is set correctly
- Check backend is running and accessible
- Verify CORS is configured (`CLIENT_URL` env var)
- Check browser console for errors

### Database connection timeout
- Verify IP whitelist in MongoDB Atlas
- Check database user password in connection string
- Test connection locally: `npm run test:smoke` in server folder

### AI features not working
- Verify `OPENAI_API_KEY` is set and valid
- Check OpenAI account has sufficient credits
- Review API error logs in OpenAI dashboard

---

## Performance Optimization

### Backend (Render)
- Upgrade to paid tier for dedicated dyno (prevents sleep)
- Use regional datacenters closer to users
- Monitor logs for performance issues

### Frontend (Vercel)
- Builds are already optimized with code-splitting
- Monitor bundle size in Vercel analytics
- Use Vercel's edge functions for faster response

### Database (MongoDB Atlas)
- Use M2 or higher tier for production
- Enable auto-scaling for large workloads
- Use connection pooling (Render provides this)
- Set up automated backups

---

## Scaling & Maintenance

### Monitor Performance
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Track errors with Sentry or similar
- Monitor API response times

### Regular Maintenance
- Update dependencies monthly
- Rotate API keys quarterly
- Review MongoDB backups
- Monitor OpenAI costs

### Backup Strategy
- MongoDB Atlas auto-backups (check retention)
- Export critical data regularly
- Keep environment variables documented (but never in code)

---

## Production Checklist

- [ ] All environment variables set in backend (Render)
- [ ] All environment variables set in frontend (Vercel)
- [ ] MongoDB IP whitelist updated for production IPs
- [ ] JWT secret is strong and random
- [ ] CORS configured for production domain
- [ ] OpenAI API key rate limits set
- [ ] ImageKit private key is secure
- [ ] Backend deployed and health check passes
- [ ] Frontend deployed and loading correctly
- [ ] Smoke tests pass against production URLs
- [ ] SSL/HTTPS enabled (auto on Vercel and Render)
- [ ] Error logging enabled
- [ ] Performance monitoring setup
- [ ] Backup strategy documented
- [ ] Team has access to credentials (use a password manager)

---

## Support & Resources

- **MongoDB Docs**: https://docs.mongodb.com
- **Express Docs**: https://expressjs.com
- **Vite Docs**: https://vitejs.dev
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs
- **ImageKit Docs**: https://docs.imagekit.io

---

## Questions?

For issues or questions:
1. Check the troubleshooting section above
2. Review service logs (Render, Vercel, MongoDB)
3. Test locally first before deploying
4. Review GitHub Issues for similar problems
