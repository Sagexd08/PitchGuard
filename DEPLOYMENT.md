# Stealth Code - Vercel Deployment Guide

This guide covers deploying Stealth Code with a Python backend on Vercel.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/stealth-code)

## 📋 Prerequisites

- Vercel account
- OpenRouter API key
- GitHub repository

## 🔧 Deployment Steps

### 1. Prepare Your Repository

Ensure your project structure looks like this:
```
stealth-code/
├── api/
│   └── score.py          # Python backend
├── frontend/
│   └── src/              # Next.js frontend
├── requirements.txt      # Python dependencies
├── vercel.json          # Vercel configuration
└── package.json         # Node.js dependencies
```

### 2. Configure Environment Variables

In your Vercel dashboard, add these environment variables:

**Required:**
- `OPENROUTER_API_KEY`: Your OpenRouter API key

**Optional:**
- `PYTHON_VERSION`: `3.9` (default)

### 3. Deploy to Vercel

#### Option A: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables
6. Deploy

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 4. Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## 🔒 Security Configuration

### Environment Variables Setup

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add `OPENROUTER_API_KEY` with your API key
3. Set environment to "Production"

### CORS Configuration

The `vercel.json` file includes CORS headers:
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

## 🐍 Python Backend Details

### Runtime Configuration

The Python backend uses:
- **Runtime**: Python 3.9
- **Dependencies**: cryptography, requests
- **Memory**: 1024MB (Vercel default)
- **Timeout**: 10s (Vercel default)

### API Endpoint

The backend is accessible at:
- Development: `http://localhost:3000/api/score`
- Production: `https://your-domain.vercel.app/api/score`

### Request Format

```json
{
  "ciphertext": "base64_encrypted_content",
  "aes_key": "base64_key",
  "iv": "base64_iv",
  "model": "mistralai/mistral-7b-instruct"
}
```

### Response Format

```json
{
  "scores": {
    "clarity": 8.5,
    "originality": 7.2,
    "team_strength": 9.1,
    "market_fit": 8.8
  },
  "receipt": "sha256_hash",
  "timestamp": "1640995200",
  "model": "mistralai/mistral-7b-instruct"
}
```

## 🔍 Monitoring & Debugging

### Vercel Functions Logs

1. Go to Vercel Dashboard
2. Select your project
3. Navigate to "Functions" tab
4. Click on `/api/score` to view logs

### Common Issues

**Issue**: `Module not found: cryptography`
**Solution**: Ensure `requirements.txt` is in the root directory

**Issue**: `CORS error`
**Solution**: Check `vercel.json` CORS configuration

**Issue**: `Timeout error`
**Solution**: OpenRouter API might be slow, check API status

### Health Check

Test your deployment:
```bash
curl -X POST https://your-domain.vercel.app/api/score \
  -H "Content-Type: application/json" \
  -d '{
    "ciphertext": "test",
    "aes_key": "test",
    "iv": "test"
  }'
```

## 📊 Performance Optimization

### Cold Start Mitigation

Vercel functions have cold starts. To minimize impact:
- Keep dependencies minimal
- Use connection pooling for external APIs
- Consider upgrading to Vercel Pro for better performance

### Caching Strategy

The backend doesn't cache responses for security reasons, but you can:
- Cache static assets with Vercel's CDN
- Use client-side caching for UI components

## 🔄 CI/CD Pipeline

### Automatic Deployments

Vercel automatically deploys when you push to your main branch:

1. Push code to GitHub
2. Vercel detects changes
3. Builds and deploys automatically
4. Updates production URL

### Preview Deployments

Every pull request gets a preview deployment:
- Unique URL for testing
- Full functionality including Python backend
- Perfect for testing before merging

## 🛠️ Local Development

### Running Locally

```bash
# Install dependencies
npm install
pip install -r requirements.txt

# Set environment variables
export OPENROUTER_API_KEY="your-key-here"

# Start development server
npm run dev
```

### Testing Python Backend Locally

```bash
# Install Vercel CLI
npm i -g vercel

# Run Vercel dev server (includes Python functions)
vercel dev
```

## 📈 Scaling Considerations

### Vercel Limits

- **Function Duration**: 10s (Hobby), 60s (Pro)
- **Function Memory**: 1024MB
- **Concurrent Executions**: 1000 (Pro)

### Upgrade Path

For high-traffic applications:
1. Upgrade to Vercel Pro
2. Consider edge functions for better performance
3. Implement request queuing for burst traffic

## 🆘 Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check `package.json` and `requirements.txt`
   - Verify Node.js and Python versions

2. **Runtime Errors**
   - Check Vercel function logs
   - Verify environment variables

3. **API Errors**
   - Test OpenRouter API key
   - Check request format

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Runtime](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [OpenRouter API Docs](https://openrouter.ai/docs)

---

**Need help?** Open an issue on GitHub or contact support.