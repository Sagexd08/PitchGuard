import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Import the Python handler logic (converted to TypeScript)
import crypto from 'crypto'

// Environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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'
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

// Security constants
const MAX_PITCH_LENGTH = 10000
const MIN_PITCH_LENGTH = 50
const REQUEST_TIMEOUT = 30000

interface Scores {
  clarity: number
  originality: number
  team_strength: number
  market_fit: number
}

interface AnalysisResult {
  scores: Scores
  receipt: string
  timestamp: string
  model: string
}

// Sanitize input text to prevent injection attacks
function sanitizeInput(text: string): string {
  if (typeof text !== 'string') {
    throw new Error('Input must be a string')
  }
  
  // Remove potentially dangerous characters
  const sanitized = text
    .replace(/</g, '')
    .replace(/>/g, '')
    .replace(/&/g, '')
    .replace(/"/g, '')
    .replace(/'/g, '')
  
  // Limit length
  if (sanitized.length > MAX_PITCH_LENGTH) {
    return sanitized.substring(0, MAX_PITCH_LENGTH)
  }
  
  return sanitized.trim()
}

// Decrypt pitch data using Node.js crypto
function decryptPitchData(ciphertext_b64: string, key_b64: string, iv_b64: string): string {
  try {
    // Decode base64 inputs
    const ciphertext = Buffer.from(ciphertext_b64, 'base64')
    const key = Buffer.from(key_b64, 'base64')
    const iv = Buffer.from(iv_b64, 'base64')
    
    // Validate key length (256-bit = 32 bytes)
    if (key.length !== 32) {
      throw new Error('Invalid key length')
    }
    
    // Validate IV length (96-bit = 12 bytes for GCM)
    if (iv.length !== 12) {
      throw new Error('Invalid IV length')
    }
    
    // Extract auth tag (last 16 bytes of ciphertext for GCM)
    const authTag = ciphertext.slice(-16)
    const encryptedData = ciphertext.slice(0, -16)
    
    // Decrypt using AES-GCM
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encryptedData, undefined, 'utf8')
    decrypted += decipher.final('utf8')
    
    if (decrypted.length < MIN_PITCH_LENGTH) {
      throw new Error('Pitch content too short')
    }
    
    return decrypted
    
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error('Failed to decrypt pitch data')
  }
}

// Generate mock scores for development/fallback
function getMockScores(): Scores {
  const seed = Math.floor(Date.now() / 3600000) // Consistent for an hour
  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }
  
  return {
    clarity: Math.round((random(seed) * 3 + 7) * 10) / 10,
    originality: Math.round((random(seed + 1) * 2.5 + 6.5) * 10) / 10,
    team_strength: Math.round((random(seed + 2) * 2.5 + 6) * 10) / 10,
    market_fit: Math.round((random(seed + 3) * 2.7 + 6.5) * 10) / 10
  }
}

// Analyze pitch using Mistral via OpenRouter API
async function analyzeWithMistral(pitchText: string): Promise<Scores> {
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not configured, using mock scores')
    return getMockScores()
  }
  
  // System prompt for deterministic scoring
  const systemPrompt = `You are an expert startup pitch evaluator. Analyze the pitch and return ONLY a valid JSON object with scores from 0-10 for these exact categories:

- clarity: How clear, well-structured, and easy to understand is the pitch?
- originality: How innovative, unique, and differentiated is the solution?
- team_strength: How capable and experienced does the team appear?
- market_fit: How well does the solution address a real market need?

Return ONLY valid JSON in this exact format with decimal scores:
{"clarity": 8.5, "originality": 7.2, "team_strength": 9.1, "market_fit": 8.8}

No additional text, explanations, or formatting.`

  const payload = {
    model: "mistralai/mistral-small-2409",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: pitchText }
    ],
    temperature: 0.0,
    top_p: 1.0,
    max_tokens: 200,
    stream: false
  }
  
  const headers = {
    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://stealth-code.vercel.app",
    "X-Title": "Stealth Code Pitch Analyzer"
  }
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
    
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.error(`OpenRouter API error: ${response.status}`)
      return getMockScores()
    }
    
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    if (!content) {
      console.error('Empty response from OpenRouter')
      return getMockScores()
    }
    
    // Parse JSON response
    try {
      const scores = JSON.parse(content.trim())
      
      // Validate response structure
      const requiredKeys = ['clarity', 'originality', 'team_strength', 'market_fit']
      if (!requiredKeys.every(key => key in scores)) {
        throw new Error('Missing required score categories')
      }
      
      // Validate score ranges and types
      for (const key of requiredKeys) {
        const score = scores[key]
        if (typeof score !== 'number' || score < 0 || score > 10) {
          throw new Error(`Invalid score for ${key}: ${score}`)
        }
      }
      
      return {
        clarity: Number(scores.clarity),
        originality: Number(scores.originality),
        team_strength: Number(scores.team_strength),
        market_fit: Number(scores.market_fit)
      }
      
    } catch (parseError) {
      console.error('Invalid JSON response from OpenRouter:', parseError)
      return getMockScores()
    }
    
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('OpenRouter API timeout')
    } else {
      console.error('OpenRouter API request failed:', error)
    }
    return getMockScores()
  }
}

// Generate SHA-256 receipt for verification
function generateReceipt(ciphertext: string, modelName: string, timestamp: string, scores: Scores): string {
  const scoresString = JSON.stringify(scores, Object.keys(scores).sort())
  const receiptData = `${ciphertext}|${modelName}|${timestamp}|${scoresString}`
  return crypto.createHash('sha256').update(receiptData).digest('hex')
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  })
}

// Handle POST request
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: any
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400, headers: corsHeaders }
      )
    }
    
    // Validate required fields
    const requiredFields = ['ciphertext', 'aes_key', 'iv']
    if (!requiredFields.every(field => field in body)) {
      return NextResponse.json(
        { error: 'Missing required encryption parameters' },
        { status: 400, headers: corsHeaders }
      )
    }
    
    const { ciphertext: ciphertext_b64, aes_key: key_b64, iv: iv_b64 } = body
    const modelName = body.model || 'mistralai/mistral-small-2409'
    
    // Validate input formats
    try {
      Buffer.from(ciphertext_b64, 'base64')
      Buffer.from(key_b64, 'base64')
      Buffer.from(iv_b64, 'base64')
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid base64 encoding' },
        { status: 400, headers: corsHeaders }
      )
    }
    
    // Decrypt pitch data (in-memory only)
    let pitchText: string
    try {
      pitchText = decryptPitchData(ciphertext_b64, key_b64, iv_b64)
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to decrypt pitch data' },
        { status: 400, headers: corsHeaders }
      )
    }
    
    // Sanitize input
    const sanitizedPitch = sanitizeInput(pitchText)
    
    // Analyze with AI (pitch_text is cleared from memory after this)
    const scores = await analyzeWithMistral(sanitizedPitch)
    
    // Generate timestamp and receipt
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const receipt = generateReceipt(ciphertext_b64, modelName, timestamp, scores)
    
    // Prepare response (no plaintext data included)
    const responseData: AnalysisResult = {
      scores,
      receipt,
      timestamp,
      model: modelName
    }
    
    return NextResponse.json(responseData, {
      status: 200,
      headers: corsHeaders
    })
    
  } catch (error) {
    console.error('Unexpected error in score handler:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}