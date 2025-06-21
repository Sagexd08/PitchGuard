#!/usr/bin/env python3
"""
Stealth Code Backend Startup Script
Handles environment setup and server initialization
"""

import os
import sys
import subprocess
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_dependencies():
    """Check if all required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import supabase
        import cryptography
        logger.info("✅ All core dependencies are installed")
        return True
    except ImportError as e:
        logger.error(f"❌ Missing dependency: {e}")
        logger.info("💡 Run: pip install -r requirements.txt")
        return False

def check_environment():
    """Check if environment variables are properly configured"""
    required_vars = [
        'OPENROUTER_API_KEY',
        'GEMINI_API_KEY',
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'SUPABASE_JWT_SECRET'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        logger.warning(f"⚠️ Missing environment variables: {', '.join(missing_vars)}")
        logger.info("💡 Check your .env file or set environment variables")
        return False
    
    logger.info("✅ All required environment variables are set")
    return True

def start_server(host="0.0.0.0", port=8000, reload=True):
    """Start the FastAPI server"""
    try:
        logger.info(f"🚀 Starting Stealth Code backend on {host}:{port}")
        
        # Import here to ensure environment is loaded
        import uvicorn
        
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=reload,
            log_level="info",
            access_log=True
        )
        
    except KeyboardInterrupt:
        logger.info("🛑 Server stopped by user")
    except Exception as e:
        logger.error(f"❌ Server startup failed: {e}")
        sys.exit(1)

def main():
    """Main startup function"""
    logger.info("🔧 Stealth Code Backend Startup")
    logger.info("=" * 50)
    
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    # Load environment variables
    try:
        from dotenv import load_dotenv
        load_dotenv()
        logger.info("✅ Environment variables loaded")
    except ImportError:
        logger.warning("⚠️ python-dotenv not installed, using system environment")
    
    # Check dependencies
    if not check_dependencies():
        logger.error("❌ Dependency check failed")
        sys.exit(1)
    
    # Check environment
    if not check_environment():
        logger.warning("⚠️ Environment check failed - continuing with available config")
    
    # Parse command line arguments
    import argparse
    parser = argparse.ArgumentParser(description="Stealth Code Backend Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    parser.add_argument("--no-reload", action="store_true", help="Disable auto-reload")
    parser.add_argument("--production", action="store_true", help="Run in production mode")
    
    args = parser.parse_args()
    
    # Configure for production if specified
    if args.production:
        reload = False
        log_level = "warning"
        logger.info("🏭 Running in production mode")
    else:
        reload = not args.no_reload
        log_level = "info"
        logger.info("🔧 Running in development mode")
    
    # Start the server
    start_server(
        host=args.host,
        port=args.port,
        reload=reload
    )

if __name__ == "__main__":
    main()