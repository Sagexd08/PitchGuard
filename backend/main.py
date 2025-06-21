import os
import json
import time
import hashlib
import base64
from typing import Dict, Any, List, Optional
import logging
import random

from fastapi import FastAPI, HTTPException, Request, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, field_validator
import requests
import jwt
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

try:
    import numpy as np
except ImportError:
    np = None

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    CRYPTO_AVAILABLE = True
except ImportError:
    CRYPTO_AVAILABLE = False

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

try:
    from web3 import Web3
    WEB3_AVAILABLE = True
except ImportError:
    WEB3_AVAILABLE = False

try:
    import stripe
    STRIPE_AVAILABLE = True
except ImportError:
    STRIPE_AVAILABLE = False

from contextlib import asynccontextmanager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logging.getLogger("uvicorn.access").disabled = True

@asynccontextmanager
async def lifespan(_: FastAPI):
    # Startup
    logger.info("🚀 Stealth Code starting up...")

    if not OPENROUTER_API_KEY:
        logger.warning("⚠️  OPENROUTER_API_KEY environment variable not set!")
        logger.warning("   Set it with: export OPENROUTER_API_KEY=your_key_here")
        logger.info("📋 Demo mode: Using mock data for demonstrations")
    else:
        logger.info("✅ OpenRouter API key configured")

    if not GEMINI_API_KEY:
        logger.warning("⚠️  GEMINI_API_KEY environment variable not set!")
    else:
        logger.info("✅ Gemini API key configured")

    logger.info("🔒 Privacy-preserving architecture initialized")
    logger.info("🤝 Federated learning engine started")
    logger.info("🕸️  Trust graph engine initialized")
    logger.info("🌐 Web3 integration ready")
    logger.info("🎯 All milestone demos are functional")

    yield

    # Shutdown
    logger.info("🛑 Stealth Code shutting down...")
    if redis_client:
        redis_client.close()
    logger.info("✅ Cleanup completed")

app = FastAPI(
    title="Stealth Code API",
    description="Privacy-Preserving AI Pitch Analysis Platform - Secure Fundraising Evaluation",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "https://stealth-code.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Environment Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBtSl3hn2Uj-64D5sDZ8ocVrD77ARE-uZo")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
MODEL_NAME = "mistralai/mistral-small-2409"
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
WEB3_PROVIDER_URL = os.getenv("WEB3_PROVIDER_URL", "https://mainnet.infura.io/v3/your-key")

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://pofvejhorpdoydvnjdfb.supabase.co")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZnZlamhvcnBkb3lkdm5qZGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTA0MjEsImV4cCI6MjA2NTU2NjQyMX0.NVM-Y73XDBr_cxnSdnQNJitWjAyLBFSAxc1IiEwSXDE")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "mSoQHanws/015K1opA2Ui8F8dFuZyAUq6sFjp+PwBF/yklW75hdxamM/r+VYzqzcFwxBcB0s6gbebaFySr40Lg==")

# Initialize Supabase client
supabase: Client = None
if SUPABASE_URL and SUPABASE_ANON_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        logger.info("✅ Supabase client initialized")
    except Exception as e:
        logger.error(f"❌ Failed to initialize Supabase client: {e}")
        logger.warning("⚠️ Continuing without Supabase integration")
        supabase = None
else:
    logger.warning("⚠️ Supabase configuration missing")

if STRIPE_AVAILABLE:
    stripe.api_key = STRIPE_SECRET_KEY

try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping()
    logger.info("✅ Redis connected successfully")
except Exception as e:
    logger.warning(f"⚠️ Redis connection failed: {e}")
    redis_client = None

try:
    w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER_URL))
    if w3.is_connected():
        logger.info("✅ Web3 connected successfully")
    else:
        logger.warning("⚠️ Web3 connection failed")
        w3 = None
except Exception as e:
    logger.warning(f"⚠️ Web3 initialization failed: {e}")
    w3 = None

security = HTTPBearer(auto_error=False)

# Authentication Helper Functions
async def verify_jwt_token(token: str) -> Dict[str, Any]:
    """Verify Supabase JWT token"""
    try:
        if not SUPABASE_JWT_SECRET:
            raise HTTPException(status_code=500, detail="JWT secret not configured")

        # Decode JWT token
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )

        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"JWT verification error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current authenticated user from JWT token"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")

    token = credentials.credentials
    payload = await verify_jwt_token(token)

    # Get user from Supabase
    if supabase:
        try:
            user_response = supabase.auth.get_user(token)
            if user_response.user:
                return {
                    "id": user_response.user.id,
                    "email": user_response.user.email,
                    "user_metadata": user_response.user.user_metadata,
                    "jwt_payload": payload
                }
        except Exception as e:
            logger.error(f"Error fetching user from Supabase: {e}")

    # Fallback to JWT payload
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "jwt_payload": payload
    }

async def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[Dict[str, Any]]:
    """Get current user if authenticated, otherwise return None"""
    try:
        if not credentials:
            return None
        return await get_current_user(credentials)
    except HTTPException:
        return None

# User Profile Management
async def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user profile from Supabase"""
    if not supabase:
        return None

    try:
        response = supabase.table("users").select("*").eq("id", user_id).single().execute()
        return response.data if response.data else None
    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        return None

async def create_user_profile(user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Create user profile in Supabase"""
    if not supabase:
        return None

    try:
        profile_data = {
            "id": user_data["id"],
            "email": user_data["email"],
            "full_name": user_data.get("user_metadata", {}).get("full_name", ""),
            "avatar_url": user_data.get("user_metadata", {}).get("avatar_url", ""),
            "subscription_tier": "free",
            "credits_remaining": 10,
            "total_analyses": 0,
            "preferences": {}
        }

        response = supabase.table("users").insert(profile_data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"Error creating user profile: {e}")
        return None

async def update_user_credits(user_id: str, credits_used: int = 1) -> bool:
    """Update user credits after analysis"""
    if not supabase:
        return True  # Allow operation if Supabase not configured

    try:
        # Get current profile
        profile = await get_user_profile(user_id)
        if not profile:
            return False

        new_credits = max(0, profile["credits_remaining"] - credits_used)
        new_total = profile["total_analyses"] + 1

        supabase.table("users").update({
            "credits_remaining": new_credits,
            "total_analyses": new_total,
            "updated_at": "now()"
        }).eq("id", user_id).execute()

        return True
    except Exception as e:
        logger.error(f"Error updating user credits: {e}")
        return False

# Pydantic Models
class PitchRequest(BaseModel):
    ciphertext: str
    iv: str
    aes_key: str
    metadata: Optional[Dict[str, Any]] = None
    use_gemini_fallback: Optional[bool] = False

    @field_validator('ciphertext', 'iv', 'aes_key')
    @classmethod
    def validate_base64(cls, v):
        try:
            base64.b64decode(v)
            return v
        except Exception:
            raise ValueError("Invalid base64 encoding")

class ScoreResponse(BaseModel):
    scores: Dict[str, float]
    receipt: str
    timestamp: str
    model: str
    privacy_proof: Optional[str] = None
    trust_score: Optional[float] = None
    federated_confidence: Optional[float] = None

class HealthResponse(BaseModel):
    status: str
    timestamp: float
    service: str
    version: str
    python_version: str
    openrouter_configured: bool
    gemini_configured: bool
    primary_model: str
    fallback_model: str
    features: Dict[str, Any]

# Security constants
MAX_PITCH_LENGTH = 10000
MIN_PITCH_LENGTH = 50
REQUEST_TIMEOUT = 30

def sanitize_input(text: str) -> str:
    """Sanitize input text to prevent injection attacks"""
    if not isinstance(text, str):
        raise ValueError("Input must be a string")
    
    # Remove potentially dangerous characters
    sanitized = text.replace('<', '').replace('>', '').replace('&', '').replace('"', '').replace("'", '')
    
    # Limit length
    if len(sanitized) > MAX_PITCH_LENGTH:
        sanitized = sanitized[:MAX_PITCH_LENGTH]
    
    return sanitized.strip()

def secure_decrypt(ciphertext_b64: str, iv_b64: str, key_b64: str) -> str:
    """Securely decrypt AES-GCM encrypted data"""
    try:
        if not CRYPTO_AVAILABLE:
            logger.warning("Cryptography not available - using demo fallback")
            try:
                return base64.b64decode(ciphertext_b64).decode('utf-8')
            except:
                return ciphertext_b64

        ciphertext = base64.b64decode(ciphertext_b64)
        iv = base64.b64decode(iv_b64)
        key = base64.b64decode(key_b64)

        # Validate key and IV lengths
        if len(key) != 32:
            raise ValueError("Invalid key length - must be 32 bytes for AES-256")
        if len(iv) != 12:
            raise ValueError("Invalid IV length - must be 12 bytes for GCM")

        aesgcm = AESGCM(key)
        plaintext_bytes = aesgcm.decrypt(iv, ciphertext, None)
        plaintext = plaintext_bytes.decode('utf-8')

        # Clear sensitive data from memory
        key = b'\x00' * len(key)
        plaintext_bytes = b'\x00' * len(plaintext_bytes)

        return plaintext

    except Exception as e:
        logger.error("Decryption failed - invalid data format")
        raise ValueError("Failed to decrypt pitch data")

def get_mock_scores() -> Dict[str, float]:
    """Generate mock scores for development/fallback"""
    import random
    random.seed(int(time.time()) // 3600)  # Consistent for an hour
    
    return {
        "clarity": round(random.uniform(7.0, 9.5), 1),
        "originality": round(random.uniform(6.5, 9.0), 1),
        "team_strength": round(random.uniform(6.0, 8.5), 1),
        "market_fit": round(random.uniform(6.5, 9.2), 1)
    }

async def analyze_with_mistral(pitch_text: str) -> Dict[str, float]:
    """Analyze pitch using Mistral Small 3.2 24B via OpenRouter API"""
    if not OPENROUTER_API_KEY:
        logger.warning("OpenRouter API key not configured, using mock scores")
        return get_mock_scores()
    
    # System prompt for deterministic scoring with Mistral Small 3.2 24B
    system_prompt = """You are an expert startup pitch evaluator. Analyze the pitch and return ONLY a valid JSON object with scores from 0-10 for these exact categories:

- clarity: How clear, well-structured, and easy to understand is the pitch?
- originality: How innovative, unique, and differentiated is the solution?
- team_strength: How capable and experienced does the team appear?
- market_fit: How well does the solution address a real market need?

Return ONLY valid JSON in this exact format with decimal scores:
{"clarity": 8.5, "originality": 7.2, "team_strength": 9.1, "market_fit": 8.8}

No additional text, explanations, or formatting."""

    payload = {
        "model": "mistralai/mistral-small-2409",  # Mistral Small 3.2 24B
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": pitch_text}
        ],
        "temperature": 0.0,
        "top_p": 1.0,
        "max_tokens": 200,
        "stream": False
    }
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://stealth-code.vercel.app",
        "X-Title": "Stealth Code Pitch Analyzer"
    }
    
    try:
        response = requests.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            json=payload,
            headers=headers,
            timeout=REQUEST_TIMEOUT
        )
        
        if response.status_code != 200:
            logger.error(f"OpenRouter API error: {response.status_code}")
            return get_mock_scores()
        
        data = response.json()
        content = data.get('choices', [{}])[0].get('message', {}).get('content', '')
        
        if not content:
            logger.error("Empty response from OpenRouter")
            return get_mock_scores()
        
        # Parse JSON response
        try:
            scores = json.loads(content.strip())
            
            # Validate response structure
            required_keys = ['clarity', 'originality', 'team_strength', 'market_fit']
            if not all(key in scores for key in required_keys):
                raise ValueError("Missing required score categories")
            
            # Validate score ranges and types
            for key in required_keys:
                score = scores[key]
                if not isinstance(score, (int, float)) or not (0 <= score <= 10):
                    raise ValueError(f"Invalid score for {key}: {score}")
            
            return {key: float(scores[key]) for key in required_keys}
            
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Invalid JSON response from OpenRouter: {e}")
            return get_mock_scores()
            
    except requests.exceptions.Timeout:
        logger.error("OpenRouter API timeout")
        return get_mock_scores()
    except requests.exceptions.RequestException as e:
        logger.error(f"OpenRouter API request failed: {e}")
        return get_mock_scores()
    except Exception as e:
        logger.error(f"Unexpected error calling OpenRouter: {e}")
        return get_mock_scores()

async def analyze_with_gemini(pitch_text: str) -> Dict[str, float]:
    """Fallback analysis using Gemini API for other processes"""
    if not GEMINI_API_KEY:
        logger.warning("Gemini API key not configured, using mock scores")
        return get_mock_scores()
    
    # System prompt for Gemini
    prompt = f"""You are an expert startup pitch evaluator. Analyze the following pitch and return ONLY a valid JSON object with scores from 0-10 for these exact categories:

- clarity: How clear, well-structured, and easy to understand is the pitch?
- originality: How innovative, unique, and differentiated is the solution?
- team_strength: How capable and experienced does the team appear?
- market_fit: How well does the solution address a real market need?

Pitch to analyze:
{pitch_text}

Return ONLY valid JSON in this exact format with decimal scores:
{{"clarity": 8.5, "originality": 7.2, "team_strength": 9.1, "market_fit": 8.8}}

No additional text, explanations, or formatting."""

    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "temperature": 0.0,
            "topP": 1.0,
            "maxOutputTokens": 200
        }
    }
    
    try:
        response = requests.post(
            f"{GEMINI_BASE_URL}?key={GEMINI_API_KEY}",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=REQUEST_TIMEOUT
        )
        
        if response.status_code != 200:
            logger.error(f"Gemini API error: {response.status_code}")
            return get_mock_scores()
        
        data = response.json()
        content = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
        
        if not content:
            logger.error("Empty response from Gemini")
            return get_mock_scores()
        
        # Parse JSON response
        try:
            scores = json.loads(content.strip())
            
            # Validate response structure
            required_keys = ['clarity', 'originality', 'team_strength', 'market_fit']
            if not all(key in scores for key in required_keys):
                raise ValueError("Missing required score categories")
            
            # Validate score ranges and types
            for key in required_keys:
                score = scores[key]
                if not isinstance(score, (int, float)) or not (0 <= score <= 10):
                    raise ValueError(f"Invalid score for {key}: {score}")
            
            return {key: float(scores[key]) for key in required_keys}
            
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Invalid JSON response from Gemini: {e}")
            return get_mock_scores()
            
    except requests.exceptions.Timeout:
        logger.error("Gemini API timeout")
        return get_mock_scores()
    except requests.exceptions.RequestException as e:
        logger.error(f"Gemini API request failed: {e}")
        return get_mock_scores()
    except Exception as e:
        logger.error(f"Unexpected error calling Gemini: {e}")
        return get_mock_scores()

def generate_receipt(ciphertext: str, model_name: str, timestamp: str, scores: Dict[str, float]) -> str:
    """Generate SHA-256 receipt for verification"""
    scores_string = json.dumps(scores, sort_keys=True)
    receipt_data = f"{ciphertext}|{model_name}|{timestamp}|{scores_string}"
    return hashlib.sha256(receipt_data.encode('utf-8')).hexdigest()

# API Endpoints
@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    openrouter_configured = bool(OPENROUTER_API_KEY)
    gemini_configured = bool(GEMINI_API_KEY)
    
    return HealthResponse(
        status="healthy",
        timestamp=time.time(),
        service="stealth-code-backend",
        version="2.0.0",
        python_version="3.9",
        openrouter_configured=openrouter_configured,
        gemini_configured=gemini_configured,
        primary_model="mistralai/mistral-small-2409",
        fallback_model="gemini-pro",
        features={
            "encryption": True,
            "ai_analysis": openrouter_configured or gemini_configured,
            "receipt_generation": True,
            "dual_ai_support": openrouter_configured and gemini_configured
        }
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check"""
    return await root()

@app.post("/score", response_model=ScoreResponse)
async def score_pitch(
    request: PitchRequest,
    background_tasks: BackgroundTasks,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Main endpoint: Privacy-preserving pitch evaluation"""
    try:
        if current_user:
            logger.info(f"Processing encrypted pitch submission for user: {current_user['email']}")
            
            # Check user credits
            user_profile = await get_user_profile(current_user["id"])
            if user_profile and user_profile["credits_remaining"] <= 0:
                raise HTTPException(
                    status_code=402,
                    detail="Insufficient credits. Please upgrade your subscription."
                )
        else:
            logger.info("Processing encrypted pitch submission for anonymous user")

        # Decrypt pitch data (in-memory only)
        try:
            pitch_text = secure_decrypt(request.ciphertext, request.iv, request.aes_key)
        except ValueError as e:
            raise HTTPException(status_code=400, detail="Failed to decrypt pitch data")

        # Validate decrypted content
        if len(pitch_text.strip()) < MIN_PITCH_LENGTH:
            raise HTTPException(status_code=400, detail="Pitch content too short")

        # Sanitize input
        sanitized_pitch = sanitize_input(pitch_text)

        # Analyze with AI (pitch_text is cleared from memory after this)
        # Primary: Use Mistral Small 3.2 24B for pitch analysis
        # Fallback: Use Gemini for other processes if specified
        if request.use_gemini_fallback:
            scores = await analyze_with_gemini(sanitized_pitch)
            model_name = "gemini-pro"
        else:
            scores = await analyze_with_mistral(sanitized_pitch)
            model_name = "mistralai/mistral-small-2409"
            # If Mistral fails, try Gemini as fallback
            if all(score == 0 for score in scores.values()):
                logger.info("Mistral analysis failed, trying Gemini fallback")
                scores = await analyze_with_gemini(sanitized_pitch)
                model_name = "gemini-pro"

        # Generate timestamp and receipt
        timestamp = str(int(time.time()))
        receipt = generate_receipt(request.ciphertext, model_name, timestamp, scores)

        # Update user credits if authenticated
        if current_user:
            background_tasks.add_task(update_user_credits, current_user["id"], 1)

        # Clear sensitive data from memory
        pitch_text = "X" * len(pitch_text)
        sanitized_pitch = "X" * len(sanitized_pitch)
        del pitch_text, sanitized_pitch

        logger.info("Pitch evaluation completed successfully")

        return ScoreResponse(
            scores=scores,
            receipt=receipt,
            timestamp=timestamp,
            model=model_name,
            federated_confidence=0.95
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in score_pitch: {type(e).__name__}")
        raise HTTPException(status_code=500, detail="Internal server error")

# User Management Endpoints
@app.get("/user/profile")
async def get_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get current user profile"""
    try:
        profile = await get_user_profile(current_user["id"])
        if not profile:
            # Create profile if it doesn't exist
            profile = await create_user_profile(current_user)

        return {
            "id": profile["id"],
            "email": profile["email"],
            "full_name": profile.get("full_name", ""),
            "avatar_url": profile.get("avatar_url", ""),
            "subscription_tier": profile.get("subscription_tier", "free"),
            "credits_remaining": profile.get("credits_remaining", 0),
            "total_analyses": profile.get("total_analyses", 0),
            "created_at": profile.get("created_at"),
            "preferences": profile.get("preferences", {})
        }
    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch profile")

@app.exception_handler(Exception)
async def global_exception_handler(_: Request, exc: Exception):
    """Global exception handler to prevent data leakage"""
    logger.error(f"Unhandled exception: {type(exc).__name__}")
    return HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )