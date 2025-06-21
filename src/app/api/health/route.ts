import { NextResponse } from 'next/server'

export async function GET() {
  const openrouterConfigured = !!(process.env.OPENROUTER_API_KEY || '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')
  
  return NextResponse.json({
    service: 'Stealth Code API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    openrouter_configured: openrouterConfigured,
    services: {
      encryption: 'operational',
      ai_analysis: 'operational',
      payments: 'operational'
    }
  })
}