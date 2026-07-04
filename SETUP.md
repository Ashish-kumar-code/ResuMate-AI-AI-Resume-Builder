# Local Development Setup Guide

Get ResuMate AI running locally in 5 minutes.

---

## Prerequisites

- **Node.js**: v18+ (check with `node --version`)
- **npm**: v9+ (check with `npm --version`)
- **MongoDB Atlas Account** (https://www.mongodb.com/cloud/atlas) - Free tier works
- **OpenAI Account** (https://platform.openai.com) - $5 free credits
- **ImageKit Account** (https://imagekit.io) - Free tier available

---

## Step 1: Clone Repository & Install Dependencies

```bash
# Clone the repo
git clone https://github.com/yourusername/ResuMate-AI.git
cd ResuMate-AI

# Install backend dependencies
cd server
npm install

# Install frontend dependencies (in new terminal)
cd client
npm install

# Return to root
cd ..
```

---

## Step 2: Setup Environment Variables

### Backend Configuration

1. Create `server/.env` from template:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Get MongoDB URI from Atlas:
   - Go to https://cloud.mongodb.com
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

3. Get OpenAI API Key:
   - Go to https://platform.openai.com/api-keys
   - Create a new secret key
   - Copy and paste into `.env`

4. Get ImageKit Private Key:
   - Go to https://imagekit.io/dashboard/developer/api-keys
   - Copy the Private Key

5. Generate JWT Secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. Fill in `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net
   JWT_SECRET=<your-generated-secret>
   CLIENT_URL=http://localhost:5173
   OPENAI_API_KEY=sk-...
   IMAGEKIT_PRIVATE_KEY=private_...
   PORT=3000
   ```

### Frontend Configuration

Already configured. File `client/.env.local` is ready to use:
```env
VITE_BASE_URL=http://localhost:3000
```

---

## Step 3: Start the Application

### Terminal 1 - Backend Server
```bash
cd server
npm run dev
# Or: node server.js

# Expected output:
# Database connected successfully
# Server is running on port 3000
```

### Terminal 2 - Frontend Dev Server
```bash
cd client
npm run dev

# Expected output:
# VITE v7.1.7  ready in 234 ms
# ➜  Local:   http://localhost:5173/
```

### Terminal 3 - Run Tests (Optional)
```bash
cd server
npm run test:smoke

# Runs end-to-end smoke test
```

---

## Step 4: Verify Everything Works

1. Open http://localhost:5173 in your browser
2. You should see the ResuMate AI homepage
3. Click "Get Started" or "Login"
4. Register a new account
5. Create a resume and test all features

---

## Troubleshooting

### MongoDB Connection Error
```
Could not connect to any servers in your MongoDB Atlas cluster
```
**Fix**: 
- Check your IP is whitelisted in MongoDB Atlas (Security → Network Access)
- Verify connection string is correct
- Check password in URI is URL-encoded (special chars like `@` become `%40`)

### OpenAI API Error
```
Missing credentials. Please pass an `apiKey`
```
**Fix**:
- Verify `OPENAI_API_KEY` is set in `server/.env`
- Check API key is valid at https://platform.openai.com/api-keys
- Verify account has sufficient credits

### CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Fix**:
- Ensure backend is running on port 3000
- Check `CLIENT_URL` is set to `http://localhost:5173` in server/.env
- Restart backend after changing .env

### Frontend can't reach backend
```
Failed to fetch (or 404 errors)
```
**Fix**:
- Verify `VITE_BASE_URL` is `http://localhost:3000` in client/.env.local
- Check backend is running: http://localhost:3000 should show "Server is live..."
- Restart frontend dev server

### ImageKit Upload Error
```
Private key is missing or invalid
```
**Fix**:
- Verify `IMAGEKIT_PRIVATE_KEY` is correct in server/.env
- Get the Private Key from ImageKit dashboard (not Public Key)

---

## Available Commands

### Backend
```bash
cd server

npm run dev          # Start with nodemon (auto-reload)
node server.js       # Start without auto-reload
npm run test:smoke   # Run smoke tests
npm run test:load    # Run 100-VU load test
```

### Frontend
```bash
cd client

npm run dev          # Start dev server
npm run build        # Create production build
npm run preview      # Preview production build
npm run lint         # Check code style
```

---

## Project Structure

```
ResuMate-AI/
├── server/               # Express backend
│   ├── configs/         # Configuration (DB, AI, ImageKit)
│   ├── controllers/     # Route handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middlewares/     # Auth, error handling
│   ├── tests/           # Smoke & load tests
│   ├── server.js        # Main entry point
│   ├── .env             # Environment variables (local)
│   └── .env.example     # Template for .env
│
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── assets/      # Resume templates
│   │   ├── app/         # Redux store
│   │   ├── configs/     # API client
│   │   └── App.jsx      # Root component
│   ├── .env.local       # Environment variables (local)
│   └── vite.config.js   # Vite configuration
│
└── DEPLOYMENT.md        # Production deployment guide
```

---

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Check [API Documentation](./server/API.md) for backend endpoints
- Review [Contributing Guidelines](./CONTRIBUTING.md) (if applicable)

---

## Support

- **Issues**: Report bugs on GitHub Issues
- **Questions**: Check existing issues first
- **Contributions**: See CONTRIBUTING.md

Happy coding! 🚀
