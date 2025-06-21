import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef';
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

interface PricingTier {
  id: string;
  name: string;
  price: {
    usd: number;
    eth: string;
    matic: string;
  };
  period: string;
  description: string;
}

interface StripePaymentFormProps {
  tier: PricingTier;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  tier,
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe not initialized. Please refresh the page.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setPaymentError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: 'Stealth Score User',
          email: 'user@stealthscore.com',
        },
      });

      if (error) {
        const errorMessage = getEnhancedErrorMessage(error);
        setPaymentError(errorMessage);
        toast.error(errorMessage);
        setIsProcessing(false);
        return;
      }

      const result = await processPaymentWithBackend(paymentMethod.id, tier);

      setPaymentSuccess(true);
      toast.success(`🎉 Payment successful! Welcome to ${tier.name}!`, {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
        },
      });

      const subscriptionData = {
        tier: tier.id,
        expiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
        paymentMethod: paymentMethod.id,
        paymentIntentId: result.paymentIntentId,
        timestamp: Date.now()
      };

      localStorage.setItem('subscriptionData', JSON.stringify(subscriptionData));
      localStorage.setItem('subscriptionTier', tier.id);
      localStorage.setItem('subscriptionExpiry', subscriptionData.expiry.toString());

      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (error: any) {
      const errorMessage = error.message || 'Payment processing failed';
      setPaymentError(errorMessage);
      toast.error(errorMessage, {
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getEnhancedErrorMessage = (error: any): string => {
    switch (error.code) {
      case 'card_declined':
        return 'Your card was declined. Please try a different payment method.';
      case 'expired_card':
        return 'Your card has expired. Please use a different card.';
      case 'incorrect_cvc':
        return 'Your card\'s security code is incorrect.';
      case 'processing_error':
        return 'An error occurred while processing your card. Please try again.';
      case 'incomplete_number':
        return 'Your card number is incomplete.';
      case 'incomplete_cvc':
        return 'Your card\'s security code is incomplete.';
      case 'incomplete_expiry':
        return 'Your card\'s expiration date is incomplete.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const processPaymentWithBackend = async (paymentMethodId: string, tier: PricingTier) => {
    try {
      // Create payment intent using Next.js API route
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: tier.price.usd,
          currency: 'usd',
          tier: tier.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { client_secret } = await response.json();

      if (!client_secret) {
        throw new Error('No client secret received');
      }

      // Confirm payment with Stripe using the payment method
      const { error: confirmError, paymentIntent } = await stripe!.confirmCardPayment(client_secret, {
        payment_method: paymentMethodId
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        return { success: true, paymentMethodId, tier, paymentIntentId: paymentIntent.id };
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  };

  const simulatePaymentProcessing = async (paymentMethodId: string, tier: PricingTier) => {
    // Enhanced simulation with realistic processing time
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For demo purposes, always succeed with test payment methods
        // In production, this would be replaced with actual Stripe processing
        console.log('Demo mode: Simulating successful payment for', tier.name);
        resolve({ success: true, paymentMethodId, tier });
      }, 2000); // 2 second delay to simulate processing
    });
  };

  if (paymentSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
        <p className="text-white/70 mb-4">
          Welcome to {tier.name}! Your subscription is now active.
        </p>
        <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
          <p className="text-green-300 text-sm">
            You now have access to all premium features for 30 days.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-semibold text-white">{tier.name}</h4>
            <p className="text-white/70 text-sm">{tier.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">${tier.price.usd}</div>
            <div className="text-white/60 text-sm">per {tier.period}</div>
          </div>
        </div>
      </div>

      {}
      <div className="space-y-4">
        <label className="block text-white font-medium">
          Card Information
        </label>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
                  fontWeight: '500',
                  '::placeholder': {
                    color: 'rgba(156, 163, 175, 0.8)',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
                complete: {
                  color: '#10b981',
                },
              },
            }}
          />
        </div>
      </div>

      {}
      <div className="flex items-start space-x-3 bg-blue-400/10 border border-blue-400/30 rounded-lg p-4">
        <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
        <div>
          <p className="text-blue-300 text-sm font-medium">Secure Payment</p>
          <p className="text-blue-200/70 text-xs">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </div>

      {}
      {paymentError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start space-x-3 bg-red-400/10 border border-red-400/30 rounded-lg p-4"
        >
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm font-medium">Payment Error</p>
            <p className="text-red-200/70 text-xs">{paymentError}</p>
          </div>
        </motion.div>
      )}

      {}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl font-montserrat"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Pay ${tier.price.usd}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

interface StripePaymentProps {
  tier: PricingTier;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({ tier, onSuccess, onCancel }) => {
  if (!stripePromise) {
    return (
      <div className="max-w-md mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-red-400/20 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Payment Unavailable</h3>
            <p className="text-white/70 text-sm">Stripe configuration is missing</p>
          </div>
        </div>
        <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-4">
          <p className="text-red-300 text-sm">
            Please configure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable to enable payments.
          </p>
        </div>
        <div className="flex space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-400/20 rounded-lg">
            <CreditCard className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Card Payment</h3>
            <p className="text-white/70 text-sm">Secure payment powered by Stripe</p>
          </div>
        </div>

        <StripePaymentForm tier={tier} onSuccess={onSuccess} onCancel={onCancel} />
      </div>
    </Elements>
  );
};

export default StripePayment;
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_API_URL: string
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}
