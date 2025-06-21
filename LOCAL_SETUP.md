# 🚀 Stealth Code - Local Development Setup

This guide will help you run Stealth Code locally with the privacy-first AI pitch analysis system.

## 📋 Prerequisites

- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **Python 3.9+** (Download from [python.org](https://python.org/))
- **Git** (Download from [git-scm.com](https://git-scm.com/))

## 🔧 Quick Start (Recommended)

### Option 1: Root-Level Next.js with Vercel API Routes

This is the simplest approach using the existing Vercel API structure.

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   # Copy the environment template
   cp .env.example .env.local
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Open Your Browser**
   ```
   http://localhost:3000
   ```

### Option 2: Separate Frontend + FastAPI Backend

For more advanced features and better separation of concerns.

#### Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start Backend Server**
   ```bash
   python start.py
   ```
   
   Backend will be available at: `http://localhost:8000`

#### Frontend Setup (New Terminal)

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Frontend Server**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at: `http://localhost:3000`

## 🔐 Environment Configuration

The API keys are already configured in the codebase, but you can override them:

### Create `.env.local` (Root Level)
```bash
# OpenRouter API (Primary - Mistral Small 3.2 24B)
OPENROUTER_API_KEY=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

# Gemini API (Fallback)
GEMINI_API_KEY=AIzaSyBtSl3hn2Uj-64D5sDZ8ocVrD77ARE-uZo

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pofvejhorpdoydvnjdfb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZnZlamhvcnBkb3lkdm5qZGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTA0MjEsImV4cCI6MjA2NTU2NjQyMX0.NVM-Y73XDBr_cxnSdnQNJitWjAyLBFSAxc1IiEwSXDE

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🧪 Testing the Setup

### 1. Test Backend Health (if using FastAPI)
```bash
curl http://localhost:8000/health
```

### 2. Test Encryption/Decryption
```bash
python test_backend.py
```

### 3. Test Frontend
1. Open `http://localhost:3000`
2. Click "Analyze Your Pitch"
3. Enter a test pitch:
   ```
   We're building an AI-powered platform that revolutionizes how startups 
   get feedback on their pitches. Our solution uses advanced encryption 
   to ensure privacy while providing professional-grade analysis using 
   multiple AI models.
   ```
4. Click "Analyze Pitch"
5. You should see scores for clarity, originality, team strength, and market fit

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

#### 2. Python Dependencies Issues
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies with verbose output
pip install -r requirements.txt -v
```

#### 3. Node.js Version Issues
```bash
# Check Node.js version
node --version

# Should be 18.0.0 or higher
```

#### 4. API Connection Issues
- Check if the backend is running on the correct port
- Verify environment variables are set correctly
- Check browser console for CORS errors

### Debug Mode

#### Enable Verbose Logging (Backend)
```bash
export LOG_LEVEL=DEBUG
python start.py
```

#### Enable React DevTools
1. Install React Developer Tools browser extension
2. Open browser DevTools
3. Check the "Components" and "Profiler" tabs

## 📊 Project Structure

```
stealth-code/
├── api/                    # Vercel API routes (Python)
│   ├── score.py           # Main scoring endpoint
│   └── health.py          # Health check
├── backend/               # FastAPI backend (alternative)
│   ├── main.py           # FastAPI application
│   ├── start.py          # Startup script
│   └── requirements.txt  # Python dependencies
├── frontend/             # Next.js frontend (alternative)
│   └── src/              # React components
├── src/                  # Root-level Next.js app
│   ├── app/              # App router pages
│   └── components/       # React components
├── package.json          # Root dependencies
└── vercel.json          # Vercel configuration
```

## 🎯 Key Features Working Locally

### ✅ Frontend Features
- **🔐 Client-side AES-256-GCM encryption** using Web Crypto API
- **🎨 Modern UI** with Tailwind CSS and Framer Motion
- **📱 Mobile-responsive** design
- **⚡ Real-time analysis** with loading states

### ✅ Backend Features
- **🤖 Dual AI models**: Mistral Small 3.2 24B + Gemini Pro fallback
- **🛡️ Privacy-first**: In-memory processing, no data persistence
- **🔒 Secure decryption** with proper memory cleanup
- **📋 Cryptographic receipts** for verification

### ✅ Security Features
- **🔑 No key reuse**: Unique IV for each encryption
- **🚫 No plaintext logging**: Sensitive data never exposed
- **✨ Input sanitization**: XSS and injection prevention
- **🧹 Memory cleanup**: Explicit clearing of sensitive data

## 🚀 Development Workflow

### Making Changes

1. **Frontend Changes**
   - Edit files in `src/` or `frontend/src/`
   - Hot reload automatically updates the browser

2. **Backend Changes**
   - Edit files in `api/` or `backend/`
   - Restart the server to see changes

3. **Testing Changes**
   ```bash
   # Test encryption/decryption
   python test_backend.py
   
   # Test API endpoints
   curl http://localhost:8000/health
   curl -X POST http://localhost:8000/score -H "Content-Type: application/json" -d '{"test": "data"}'
   ```

### Performance Monitoring

The app includes built-in performance monitoring:
- Check browser DevTools → Network tab for API response times
- Monitor memory usage in DevTools → Memory tab
- Use the built-in performance monitor component

## 📈 Next Steps

Once you have the local setup working:

1. **Customize the UI** - Modify components in `src/components/`
2. **Add new features** - Extend the API endpoints
3. **Deploy to production** - Use Vercel, Railway, or your preferred platform
4. **Scale the backend** - Add Redis caching, database integration

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs** - Look at terminal output for error messages
2. **Verify environment** - Ensure all environment variables are set
3. **Test components** - Use the test script to isolate issues
4. **Browser DevTools** - Check console for frontend errors

---

**🎉 You're ready to start developing with Stealth Code!**

The system is designed to work out of the box with the provided API keys and configuration. Simply run `npm run dev` and start analyzing pitches with complete privacy and security.