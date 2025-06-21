import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

interface AnalysisRequest {
  encrypted_pitch: string
  encryption_key: string
  encryption_iv: string
  model?: string
}

interface AnalysisResponse {
  clarity: number
  originality: number
  team_strength: number
  market_fit: number
  receipt: string
}

// Mock analysis for development - replace with actual OpenRouter integration
const mockAnalysis = (): Omit<AnalysisResponse, 'receipt'> => {
  return {
    clarity: Math.floor(Math.random() * 30) + 70, // 70-100
    originality: Math.floor(Math.random() * 30) + 65, // 65-95
    team_strength: Math.floor(Math.random() * 25) + 60, // 60-85
    market_fit: Math.floor(Math.random() * 35) + 65, // 65-100
  }
}

// Decrypt function using Web Crypto API (server-side equivalent)
async function decryptPitchData(
  ciphertextBase64: string,
  keyBase64: string,
  ivBase64: string
): Promise<string> {
  try {
    // Convert base64 back to ArrayBuffer
    const ciphertext = Uint8Array.from(atob(ciphertextBase64), c => c.charCodeAt(0))
    const keyData = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0))
    const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0))

    // Import the key
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertext
    )

    // Convert back to string
    return new TextDecoder().decode(decryptedData)
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error('Failed to decrypt pitch data')
  }
}

// Generate SHA-256 receipt
function generateReceipt(
  ciphertext: string,
  modelName: string,
  timestamp: string,
  scores: string
): string {
  const data = `${ciphertext}|${modelName}|${timestamp}|${scores}`
  return createHash('sha256').update(data).digest('hex')
}

// OpenRouter API integration (placeholder)
async function analyzeWithOpenRouter(pitchText: string, model: string = 'mistral-7b-instruct') {
  // This would be the actual OpenRouter API call
  // For now, return mock data
  
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not found, using mock analysis')
    return mockAnalysis()
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'StealthScore Pitch Analyzer'
      },
      body: JSON.stringify({
        model: `openrouter/${model}`,
        messages: [
          {
            role: 'system',
            content: `You are an expert startup pitch evaluator. Analyze the provided pitch and return ONLY a JSON object with scores from 0-100 for these categories:
            - clarity: How clear and well-structured is the pitch?
            - originality: How innovative and unique is the idea?
            - team_strength: How strong does the team appear?
            - market_fit: How well does the solution fit the market need?
            
            Return only valid JSON in this exact format:
            {"clarity": 85, "originality": 78, "team_strength": 92, "market_fit": 88}`
          },
          {
            role: 'user',
            content: pitchText
          }
        ],
        temperature: 0.0,
        top_p: 1.0,
        max_tokens: 200
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No content received from OpenRouter')
    }

    // Parse the JSON response
    const scores = JSON.parse(content.trim())
    
    // Validate the response structure
    if (typeof scores.clarity !== 'number' || 
        typeof scores.originality !== 'number' || 
        typeof scores.team_strength !== 'number' || 
        typeof scores.market_fit !== 'number') {
      throw new Error('Invalid response format from OpenRouter')
    }

    return scores
  } catch (error) {
    console.error('OpenRouter analysis failed:', error)
    console.warn('Falling back to mock analysis')
    return mockAnalysis()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json()
    
    // Validate request
    if (!body.encrypted_pitch || !body.encryption_key || !body.encryption_iv) {
      return NextResponse.json(
        { error: 'Missing required encryption parameters' },
        { status: 400 }
      )
    }

    // Decrypt the pitch data (in production, this should be done in a secure environment)
    let pitchText: string
    try {
      pitchText = await decryptPitchData(
        body.encrypted_pitch,
        body.encryption_key,
        body.encryption_iv
      )
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to decrypt pitch data' },
        { status: 400 }
      )
    }

    // Validate decrypted content
    if (!pitchText || pitchText.length < 50) {
      return NextResponse.json(
        { error: 'Pitch content too short or invalid' },
        { status: 400 }
      )
    }

    // Sanitize input (basic sanitization)
    const sanitizedPitch = pitchText.replace(/[<>]/g, '').substring(0, 10000)

    // Analyze with AI model
    const modelName = body.model || 'mistral-7b-instruct'
    const scores = await analyzeWithOpenRouter(sanitizedPitch, modelName)

    // Generate timestamp and receipt
    const timestamp = new Date().toISOString()
    const scoresString = JSON.stringify(scores)
    const receipt = generateReceipt(body.encrypted_pitch, modelName, timestamp, scoresString)

    const response: AnalysisResponse = {
      ...scores,
      receipt
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error during analysis' },
      { status: 500 }
    )
  }
}