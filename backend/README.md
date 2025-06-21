# Stealth Code Backend

Privacy-first AI pitch analysis backend built with FastAPI, featuring end-to-end encryption and dual AI model support.

## 🚀 Features

- **🔒 End-to-End Encryption**: AES-256-GCM decryption with secure memory handling
- **🤖 Dual AI Support**: Mistral Small 3.2 24B (primary) + Gemini Pro (fallback)
- **🛡️ Privacy-First**: No data persistence, in-memory processing only
- **📊 Supabase Integration**: User management and analytics
- **⚡ High Performance**: FastAPI with async/await support
- **🔐 JWT Authentication**: Secure user authentication with Supabase
- **📈 Monitoring**: Redis integration for metrics and caching

## 🛠️ Tech Stack

- **FastAPI 0.104.1** - Modern Python web framework
- **Uvicorn** - ASGI server with auto-reload
- **Cryptography** - AES-GCM encryption/decryption
- **Supabase** - Database and authentication
- **Redis** - Caching and session management
- **Pydantic** - Data validation and serialization

## 🔧 Installation

### Prerequisites

- Python 3.9+
- Redis (optional, for caching)
- Supabase account

### Local Development

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

5. **Start the server**
   ```bash
   python start.py
   ```

   Or directly with uvicorn:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Docker Development

1. **Using Docker Compose (recommended)**
   ```bash
   docker-compose up --build
   ```

2. **Using Docker directly**
   ```bash
   docker build -t stealth-code-backend .
   docker run -p 8000:8000 --env-file .env stealth-code-backend
   ```

## 🔐 Environment Configuration

### Required Variables

```bash
# AI API Keys
OPENROUTER_API_KEY=sk-or-v1-your-key-here
GEMINI_API_KEY=your-gemini-key-here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

### Optional Variables

```bash
# Redis (for caching and metrics)
REDIS_URL=redis://localhost:6379

# Web3 (for blockchain features)
WEB3_PROVIDER_URL=https://mainnet.infura.io/v3/your-key

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret

# Development
DEBUG=True
LOG_LEVEL=INFO
```

## 📡 API Endpoints

### Core Endpoints

#### `POST /score`
Analyze encrypted pitch data and return scores.

**Request:**
```json
{
  "ciphertext": "base64_encrypted_content",
  "iv": "base64_iv",
  "aes_key": "base64_key",
  "use_gemini_fallback": false,
  "metadata": {
    "wallet_address": "0x...",
    "additional_data": "..."
  }
}
```

**Response:**
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
  "model": "mistralai/mistral-small-2409",
  "federated_confidence": 0.95
}
```

#### `GET /health`
Health check with service status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": 1640995200.123,
  "service": "stealth-code-backend",
  "version": "2.0.0",
  "python_version": "3.9",
  "openrouter_configured": true,
  "gemini_configured": true,
  "primary_model": "mistralai/mistral-small-2409",
  "fallback_model": "gemini-pro",
  "features": {
    "encryption": true,
    "ai_analysis": true,
    "receipt_generation": true,
    "dual_ai_support": true
  }
}
```

### User Management

#### `GET /user/profile`
Get current user profile (requires authentication).

#### `PUT /user/profile`
Update user profile (requires authentication).

## 🔒 Security Features

### Encryption
- **AES-256-GCM**: Industry-standard encryption with authentication
- **Secure Key Handling**: Keys cleared from memory after use
- **IV Validation**: Proper initialization vector handling
- **No Key Reuse**: Each encryption uses unique IV

### Privacy Protection
- **In-Memory Processing**: No pitch data persistence
- **Secure Logging**: Sensitive data never logged
- **Memory Clearing**: Explicit memory cleanup after processing
- **Input Sanitization**: XSS and injection prevention

### Authentication
- **JWT Tokens**: Supabase-issued JWT validation
- **Optional Auth**: Anonymous usage supported
- **User Credits**: Credit-based usage tracking
- **Session Management**: Secure session handling

## 🤖 AI Model Configuration

### Primary Model: Mistral Small 3.2 24B
- **Provider**: OpenRouter
- **Model ID**: `mistralai/mistral-small-2409`
- **Temperature**: 0.0 (deterministic)
- **Max Tokens**: 200
- **Use Case**: Primary pitch analysis

### Fallback Model: Gemini Pro
- **Provider**: Google AI
- **Model ID**: `gemini-pro`
- **Temperature**: 0.0 (deterministic)
- **Max Tokens**: 200
- **Use Case**: Fallback when Mistral unavailable

### Model Selection Logic
1. Use Mistral Small 3.2 24B by default
2. Fall back to Gemini if Mistral fails
3. Use mock scores if both APIs unavailable
4. Support explicit Gemini selection via `use_gemini_fallback`

## 📊 Monitoring & Logging

### Health Monitoring
- **Health Endpoint**: `/health` for service status
- **Dependency Checks**: API key validation
- **Service Status**: Database and cache connectivity

### Logging
- **Structured Logging**: JSON-formatted logs
- **Privacy-Safe**: No sensitive data in logs
- **Error Tracking**: Comprehensive error handling
- **Performance Metrics**: Request timing and success rates

### Redis Integration
- **Metrics Storage**: Evaluation statistics
- **Caching**: API response caching
- **Session Management**: User session data

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   export OPENROUTER_API_KEY=your-production-key
   export GEMINI_API_KEY=your-production-key
   export SUPABASE_URL=your-production-url
   # ... other production variables
   ```

2. **Production Server**
   ```bash
   python start.py --production --host 0.0.0.0 --port 8000
   ```

3. **Docker Production**
   ```bash
   docker build -t stealth-code-backend .
   docker run -d -p 8000:8000 --env-file .env.production stealth-code-backend
   ```

### Cloud Deployment

#### Railway
```bash
railway login
railway init
railway add
railway deploy
```

#### Heroku
```bash
heroku create stealth-code-backend
heroku config:set OPENROUTER_API_KEY=your-key
heroku config:set GEMINI_API_KEY=your-key
git push heroku main
```

#### DigitalOcean App Platform
```yaml
name: stealth-code-backend
services:
- name: api
  source_dir: /backend
  github:
    repo: your-username/stealth-code
    branch: main
  run_command: python start.py --production
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: OPENROUTER_API_KEY
    value: your-key
    type: SECRET
```

## 🧪 Testing

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test encryption/decryption
python test_encryption.py

# Load testing
python test_load.py
```

### Automated Testing
```bash
# Run test suite
pytest tests/

# Coverage report
pytest --cov=main tests/
```

## 🔧 Development

### Code Structure
```
backend/
├── main.py              # FastAPI application
├── start.py             # Startup script
├── requirements.txt     # Python dependencies
├── Dockerfile          # Container configuration
├── docker-compose.yml  # Development environment
├── .env                # Environment variables
└── tests/              # Test suite
```

### Adding New Features

1. **New Endpoint**
   ```python
   @app.post("/new-endpoint")
   async def new_endpoint(request: NewRequest):
       # Implementation
       return response
   ```

2. **New AI Model**
   ```python
   async def analyze_with_new_model(pitch_text: str):
       # Model integration
       return scores
   ```

3. **New Authentication Method**
   ```python
   async def verify_new_auth(token: str):
       # Auth verification
       return user_data
   ```

## 📈 Performance

### Benchmarks
- **Encryption/Decryption**: ~1ms per operation
- **AI Analysis**: 2-5 seconds (depending on model)
- **Database Operations**: ~50ms per query
- **Memory Usage**: ~100MB base + ~10MB per request

### Optimization Tips
- Use Redis for caching frequent requests
- Implement connection pooling for databases
- Use async/await for I/O operations
- Monitor memory usage for large payloads

## 🆘 Troubleshooting

### Common Issues

1. **Import Errors**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   ```bash
   # Check if .env file exists and is properly formatted
   cat .env
   ```

3. **API Key Issues**
   ```bash
   # Test API keys
   curl -H "Authorization: Bearer $OPENROUTER_API_KEY" https://openrouter.ai/api/v1/models
   ```

4. **Database Connection**
   ```bash
   # Test Supabase connection
   python -c "from supabase import create_client; print('OK')"
   ```

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
python start.py
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ for privacy-conscious entrepreneurs**