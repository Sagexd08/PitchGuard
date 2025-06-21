i """
Stealth Code - Health Check Endpoint
Simple health check for monitoring deployment status
"""

import json
import time
import os

def handler(request):
    """Health check endpoint"""
    
    # CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }
    
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    if request.method != 'GET':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Check if API keys are configured
    openrouter_configured = bool(os.getenv('OPENROUTER_API_KEY', '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'))
    gemini_configured = bool(os.getenv('GEMINI_API_KEY', 'AIzaSyBtSl3hn2Uj-64D5sDZ8ocVrD77ARE-uZo'))
    
    # Health check response
    health_data = {
        'status': 'healthy',
        'timestamp': int(time.time()),
        'service': 'stealth-code-backend',
        'version': '1.0.0',
        'python_version': '3.9',
        'openrouter_configured': openrouter_configured,
        'gemini_configured': gemini_configured,
        'primary_model': 'mistralai/mistral-small-2409',
        'fallback_model': 'gemini-pro',
        'features': {
            'encryption': True,
            'ai_analysis': openrouter_configured or gemini_configured,
            'receipt_generation': True,
            'dual_ai_support': openrouter_configured and gemini_configured
        }
    }
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(health_data)
    }

# Vercel entry point
def main(request):
    return handler(request)