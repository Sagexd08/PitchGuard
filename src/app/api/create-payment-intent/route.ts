import { NextRequest, NextResponse } from 'next/server'

interface PaymentRequest {
  amount: number
  currency: string
  plan: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json()
    
    // Validate request
    if (!body.amount || !body.currency || !body.plan) {
      return NextResponse.json(
        { error: 'Missing required payment parameters' },
        { status: 400 }
      )
    }

    if (body.amount < 50) { // Minimum $0.50
      return NextResponse.json(
        { error: 'Amount too small' },
        { status: 400 }
      )
    }

    // In a real implementation, you would use Stripe here:
    /*
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.amount,
      currency: body.currency,
      metadata: {
        plan: body.plan
      }
    })
    
    return NextResponse.json({
      client_secret: paymentIntent.client_secret
    })
    */

    // Mock response for development
    const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
    
    return NextResponse.json({
      client_secret: mockClientSecret,
      amount: body.amount,
      currency: body.currency,
      plan: body.plan
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}