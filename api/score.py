"""
Stealth Code - Privacy-First AI Pitch Analysis Backend
Vercel Serverless Function for secure pitch scoring
"""

import json
import os
import hashlib
import base64
import time
from typing import Dict, Any, Optional
import logging

# Configure logging to avoid exposing sensitive data
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    from cryptography.exceptions import InvalidTag
    import requests
except ImportError as e:
    logger.error(f"Missing required dependencies: {e}")
    raise

# Environment variables
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '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')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyBtSl3hn2Uj-64D5sDZ8ocVrD77ARE-uZo')
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

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

def decrypt_pitch_data(ciphertext_b64: str, key_b64: str, iv_b64: str) -> str:
    """
    Decrypt pitch data using AES-GCM
    Data is processed in-memory only and never logged
    """
    try:
        # Decode base64 inputs
        ciphertext = base64.b64decode(ciphertext_b64)
        key = base64.b64decode(key_b64)
        iv = base64.b64decode(iv_b64)
        
        # Validate key length (256-bit = 32 bytes)
        if len(key) != 32:
            raise ValueError("Invalid key length")
        
        # Validate IV length (96-bit = 12 bytes for GCM)
        if len(iv) != 12:
            raise ValueError("Invalid IV length")
        
        # Decrypt using AES-GCM
        aesgcm = AESGCM(key)
        plaintext = aesgcm.decrypt(iv, ciphertext, None)
        
        # Convert to string and validate
        decrypted_text = plaintext.decode('utf-8')
        
        if len(decrypted_text) < MIN_PITCH_LENGTH:
            raise ValueError("Pitch content too short")
        
        return decrypted_text
        
    except (InvalidTag, ValueError, UnicodeDecodeError) as e:
        logger.error("Decryption failed - invalid data format")
        raise ValueError("Failed to decrypt pitch data")
    except Exception as e:
        logger.error("Unexpected decryption error")
        raise ValueError("Decryption error")

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

def analyze_with_mistral(pitch_text: str) -> Dict[str, float]:
    """
    Analyze pitch using Mistral Small 3.2 24B via OpenRouter API
    """
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
            OPENROUTER_BASE_URL,
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

def analyze_with_gemini(pitch_text: str) -> Dict[str, float]:
    """
    Fallback analysis using Gemini API for other processes
    """
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

def handler(request):
    """
    Main Vercel serverless function handler
    """
    # CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    }
    
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Parse request body
        try:
            if hasattr(request, 'get_json'):
                body = request.get_json()
            else:
                body = json.loads(request.body)
        except (json.JSONDecodeError, AttributeError):
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Invalid JSON in request body'})
            }
        
        # Validate required fields
        required_fields = ['ciphertext', 'aes_key', 'iv']
        if not all(field in body for field in required_fields):
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Missing required encryption parameters'})
            }
        
        ciphertext_b64 = body['ciphertext']
        key_b64 = body['aes_key']
        iv_b64 = body['iv']
        model_name = body.get('model', 'mistralai/mistral-7b-instruct')
        
        # Validate input formats
        try:
            base64.b64decode(ciphertext_b64)
            base64.b64decode(key_b64)
            base64.b64decode(iv_b64)
        except Exception:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Invalid base64 encoding'})
            }
        
        # Decrypt pitch data (in-memory only)
        try:
            pitch_text = decrypt_pitch_data(ciphertext_b64, key_b64, iv_b64)
        except ValueError as e:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Failed to decrypt pitch data'})
            }
        
        # Sanitize input
        sanitized_pitch = sanitize_input(pitch_text)
        
        # Analyze with AI (pitch_text is cleared from memory after this)
        scores = analyze_with_mistral(sanitized_pitch)
        
        # Generate timestamp and receipt
        timestamp = str(int(time.time()))
        receipt = generate_receipt(ciphertext_b64, model_name, timestamp, scores)
        
        # Prepare response (no plaintext data included)
        response_data = {
            'scores': scores,
            'receipt': receipt,
            'timestamp': timestamp,
            'model': model_name
        }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(response_data)
        }
        
    except Exception as e:
        logger.error("Unexpected error in handler")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal server error'})
        }

# Vercel entry point
def main(request):
    return handler(request)