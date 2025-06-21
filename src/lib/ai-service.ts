import { GoogleGenerativeAI } from '@google/generative-ai'

export interface AIAnalysisResult {
  overallScore: number
  sentimentScore: number
  clarityScore: number
  marketFitScore: number
  investorAppealScore: number
  competitiveEdgeScore: number
  insights: AIInsight[]
  recommendations: string[]
}

export interface AIInsight {
  id: string
  type: 'strength' | 'weakness' | 'opportunity' | 'threat'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  emotionalTone: string[]
  persuasivenessScore: number
}

export interface MarketAnalysis {
  marketSize: string
  timing: 'excellent' | 'good' | 'fair' | 'poor'
  competitionLevel: 'low' | 'medium' | 'high'
  growthPotential: number
}

class AIService {
  private openRouterApiKey: string
  private geminiApiKey: string
  private geminiAI?: GoogleGenerativeAI

  constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ''
    this.geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
    
    if (this.geminiApiKey) {
      this.geminiAI = new GoogleGenerativeAI(this.geminiApiKey)
    }
  }

  async callOpenRouter(model: string, prompt: string, systemPrompt?: string): Promise<any> {
    if (!this.openRouterApiKey) {
      throw new Error('OpenRouter API key not configured')
    }

    const messages = []
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }
    messages.push({ role: 'user', content: prompt })

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://stealthscore.ai',
        'X-Title': 'Stealth Score'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  }

  async callGemini(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.geminiAI) {
      throw new Error('Gemini API key not configured')
    }

    try {
      const model = this.geminiAI.getGenerativeModel({ model: 'gemini-pro' })
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
      
      const result = await model.generateContent(fullPrompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error('Failed to generate content with Gemini')
    }
  }

  async analyzePitchSentiment(pitchText: string): Promise<SentimentAnalysis> {
    const systemPrompt = `You are an expert in sentiment analysis and communication psychology. Analyze the emotional tone, confidence level, and persuasiveness of business pitches.`
    
    const prompt = `Analyze the sentiment and persuasiveness of this pitch text:

"${pitchText}"

Return a JSON response with:
- sentiment: "positive", "negative", or "neutral"
- confidence: number between 0-100
- emotionalTone: array of emotional descriptors
- persuasivenessScore: number between 0-100

Focus on confidence, enthusiasm, clarity, and persuasive language.`

    try {
      const response = await this.callGemini(prompt, systemPrompt)
      return JSON.parse(response)
    } catch (error) {
      console.error('Sentiment analysis error:', error)
      return {
        sentiment: 'neutral',
        confidence: 50,
        emotionalTone: ['uncertain'],
        persuasivenessScore: 50
      }
    }
  }

  async analyzeMarketFit(pitchText: string, industry: string): Promise<MarketAnalysis> {
    const systemPrompt = `You are a market research expert and venture capital analyst. Analyze market opportunities, timing, and competitive landscapes for startups.`
    
    const prompt = `Analyze the market fit for this ${industry} pitch:

"${pitchText}"

Return a JSON response with:
- marketSize: descriptive size assessment
- timing: "excellent", "good", "fair", or "poor"
- competitionLevel: "low", "medium", or "high"
- growthPotential: number between 0-100

Consider current market trends, timing, and competitive landscape.`

    try {
      const response = await this.callOpenRouter('deepseek/deepseek-r1', prompt, systemPrompt)
      return JSON.parse(response)
    } catch (error) {
      console.error('Market analysis error:', error)
      return {
        marketSize: 'Medium-sized market',
        timing: 'good',
        competitionLevel: 'medium',
        growthPotential: 70
      }
    }
  }

  async generateCompetitiveAnalysis(pitchText: string, industry: string): Promise<string[]> {
    const systemPrompt = `You are a competitive intelligence expert. Identify key competitors, market positioning, and differentiation opportunities.`
    
    const prompt = `Analyze the competitive landscape for this ${industry} startup:

"${pitchText}"

Return a JSON array of competitive insights and recommendations for differentiation.`

    try {
      const response = await this.callOpenRouter('mistralai/mistral-large', prompt, systemPrompt)
      return JSON.parse(response)
    } catch (error) {
      console.error('Competitive analysis error:', error)
      return ['Competitive analysis unavailable']
    }
  }

  async generateInvestorMatching(pitchText: string, fundingStage: string): Promise<string[]> {
    const systemPrompt = `You are a venture capital expert. Match startups with appropriate investors based on sector, stage, and investment thesis.`
    
    const prompt = `Suggest investor types and characteristics for this ${fundingStage} startup:

"${pitchText}"

Return a JSON array of investor recommendations with reasoning.`

    try {
      const response = await this.callOpenRouter('deepseek/deepseek-r1', prompt, systemPrompt)
      return JSON.parse(response)
    } catch (error) {
      console.error('Investor matching error:', error)
      return ['Investor matching unavailable']
    }
  }

  async generatePresentationOptimization(pitchText: string): Promise<string[]> {
    const systemPrompt = `You are a presentation expert and communication coach. Provide specific recommendations for improving pitch presentations.`
    
    const prompt = `Analyze this pitch and provide optimization recommendations:

"${pitchText}"

Return a JSON array of specific, actionable recommendations for improving the presentation structure, content flow, and delivery.`

    try {
      const response = await this.callGemini(prompt, systemPrompt)
      return JSON.parse(response)
    } catch (error) {
      console.error('Presentation optimization error:', error)
      return ['Presentation optimization unavailable']
    }
  }

  async performComprehensiveAnalysis(pitchText: string, industry: string = 'technology', fundingStage: string = 'seed'): Promise<AIAnalysisResult> {
    try {
      const [
        sentimentAnalysis,
        marketAnalysis,
        competitiveInsights,
        investorRecommendations,
        presentationTips
      ] = await Promise.all([
        this.analyzePitchSentiment(pitchText),
        this.analyzeMarketFit(pitchText, industry),
        this.generateCompetitiveAnalysis(pitchText, industry),
        this.generateInvestorMatching(pitchText, fundingStage),
        this.generatePresentationOptimization(pitchText)
      ])

      const overallScore = Math.round(
        (sentimentAnalysis.persuasivenessScore * 0.3 +
         marketAnalysis.growthPotential * 0.25 +
         (sentimentAnalysis.confidence * 0.2) +
         (100 - (marketAnalysis.competitionLevel === 'high' ? 80 : marketAnalysis.competitionLevel === 'medium' ? 60 : 40)) * 0.15 +
         (marketAnalysis.timing === 'excellent' ? 95 : marketAnalysis.timing === 'good' ? 80 : marketAnalysis.timing === 'fair' ? 60 : 40) * 0.1)
      )

      const insights: AIInsight[] = [
        {
          id: '1',
          type: sentimentAnalysis.sentiment === 'positive' ? 'strength' : 'weakness',
          title: `${sentimentAnalysis.sentiment.charAt(0).toUpperCase() + sentimentAnalysis.sentiment.slice(1)} Sentiment`,
          description: `Your pitch conveys a ${sentimentAnalysis.sentiment} tone with ${sentimentAnalysis.confidence}% confidence.`,
          confidence: sentimentAnalysis.confidence,
          impact: sentimentAnalysis.confidence > 80 ? 'high' : sentimentAnalysis.confidence > 60 ? 'medium' : 'low'
        },
        {
          id: '2',
          type: marketAnalysis.timing === 'excellent' || marketAnalysis.timing === 'good' ? 'opportunity' : 'threat',
          title: 'Market Timing',
          description: `Market timing is ${marketAnalysis.timing} with ${marketAnalysis.competitionLevel} competition level.`,
          confidence: 85,
          impact: marketAnalysis.timing === 'excellent' ? 'high' : 'medium'
        }
      ]

      return {
        overallScore,
        sentimentScore: sentimentAnalysis.persuasivenessScore,
        clarityScore: sentimentAnalysis.confidence,
        marketFitScore: marketAnalysis.growthPotential,
        investorAppealScore: Math.round((sentimentAnalysis.persuasivenessScore + marketAnalysis.growthPotential) / 2),
        competitiveEdgeScore: marketAnalysis.competitionLevel === 'low' ? 85 : marketAnalysis.competitionLevel === 'medium' ? 70 : 55,
        insights,
        recommendations: [
          ...presentationTips.slice(0, 3),
          ...competitiveInsights.slice(0, 2),
          ...investorRecommendations.slice(0, 2)
        ]
      }
    } catch (error) {
      console.error('Comprehensive analysis error:', error)
      
      return {
        overallScore: 75,
        sentimentScore: 80,
        clarityScore: 75,
        marketFitScore: 70,
        investorAppealScore: 75,
        competitiveEdgeScore: 70,
        insights: [
          {
            id: '1',
            type: 'strength',
            title: 'Analysis in Progress',
            description: 'AI analysis is being processed. Please try again in a moment.',
            confidence: 50,
            impact: 'medium'
          }
        ],
        recommendations: ['AI analysis temporarily unavailable. Please try again.']
      }
    }
  }
}

export const aiService = new AIService()
export default aiService
