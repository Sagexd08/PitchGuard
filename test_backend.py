#!/usr/bin/env python3
"""
Test script for Stealth Code backend
Tests encryption, decryption, and API functionality
"""

import json
import base64
import requests
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

def test_encryption_decryption():
    """Test AES-GCM encryption/decryption"""
    print("🔐 Testing encryption/decryption...")
    
    # Test data
    test_pitch = "This is a test pitch for our revolutionary AI startup that will change the world."
    
    # Generate key and IV
    key = AESGCM.generate_key(bit_length=256)
    iv = os.urandom(12)
    
    # Encrypt
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(iv, test_pitch.encode('utf-8'), None)
    
    # Encode to base64
    ciphertext_b64 = base64.b64encode(ciphertext).decode('utf-8')
    key_b64 = base64.b64encode(key).decode('utf-8')
    iv_b64 = base64.b64encode(iv).decode('utf-8')
    
    print(f"✅ Original text length: {len(test_pitch)}")
    print(f"✅ Encrypted data length: {len(ciphertext_b64)}")
    
    # Test decryption
    decrypted = aesgcm.decrypt(iv, ciphertext, None)
    assert decrypted.decode('utf-8') == test_pitch
    print("✅ Encryption/decryption test passed!")
    
    return {
        'ciphertext': ciphertext_b64,
        'aes_key': key_b64,
        'iv': iv_b64,
        'original': test_pitch
    }

def test_local_api(test_data):
    """Test local API endpoint"""
    print("\n🌐 Testing local API...")
    
    url = "http://localhost:3000/api/score"
    
    payload = {
        'ciphertext': test_data['ciphertext'],
        'aes_key': test_data['aes_key'],
        'iv': test_data['iv'],
        'model': 'mistralai/mistral-small-2409'
    }
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API request successful!")
            print(f"✅ Scores received: {result.get('scores', {})}")
            print(f"✅ Receipt: {result.get('receipt', 'N/A')[:16]}...")
            return True
        else:
            print(f"❌ API request failed: {response.status_code}")
            print(f"❌ Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to local server")
        print("💡 Make sure to run 'npm run dev' or 'vercel dev' first")
        return False
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

def test_health_endpoint():
    """Test health check endpoint"""
    print("\n🏥 Testing health endpoint...")
    
    url = "http://localhost:3000/api/health"
    
    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            health = response.json()
            print("✅ Health check passed!")
            print(f"✅ Service: {health.get('service', 'unknown')}")
            print(f"✅ Status: {health.get('status', 'unknown')}")
            print(f"✅ OpenRouter configured: {health.get('openrouter_configured', False)}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Stealth Code Backend Test Suite")
    print("=" * 50)
    
    # Test encryption
    test_data = test_encryption_decryption()
    
    # Test health endpoint
    health_ok = test_health_endpoint()
    
    # Test API
    api_ok = test_local_api(test_data)
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"🔐 Encryption: ✅ PASS")
    print(f"🏥 Health Check: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"🌐 API Test: {'✅ PASS' if api_ok else '❌ FAIL'}")
    
    if health_ok and api_ok:
        print("\n🎉 All tests passed! Your backend is ready for deployment.")
    else:
        print("\n⚠️  Some tests failed. Check the output above for details.")
        print("💡 Make sure your development server is running and OpenRouter API key is set.")

if __name__ == "__main__":
    main()