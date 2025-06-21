const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PitchAnalysisRequest {
  pitch: string;
  industry?: string;
  stage?: string;
  funding_goal?: number;
}

interface PitchAnalysisResponse {
  overall_score: number;
  criteria_breakdown: {
    problem_clarity: number;
    solution_viability: number;
    market_opportunity: number;
    team_strength: number;
    financial_projections: number;
    competitive_advantage: number;
    scalability: number;
    risk_assessment: number;
  };
  detailed_feedback: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  confidence_score: number;
  processing_time: number;
}

interface PaymentIntentRequest {
  amount: number;
  currency: string;
  tier_id: string;
  customer_email?: string;
}

interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest('/health');
  }

  async analyzePitch(request: PitchAnalysisRequest): Promise<ApiResponse<PitchAnalysisResponse>> {
    return this.makeRequest<PitchAnalysisResponse>('/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async createPaymentIntent(request: PaymentIntentRequest): Promise<ApiResponse<PaymentIntentResponse>> {
    return this.makeRequest<PaymentIntentResponse>('/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async confirmPayment(paymentIntentId: string): Promise<ApiResponse> {
    return this.makeRequest('/api/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({ payment_intent_id: paymentIntentId }),
    });
  }

  async getSubscriptionStatus(userId: string): Promise<ApiResponse> {
    return this.makeRequest(`/api/subscription/${userId}`);
  }

  async cancelSubscription(subscriptionId: string): Promise<ApiResponse> {
    return this.makeRequest(`/api/subscription/${subscriptionId}/cancel`, {
      method: 'POST',
    });
  }

  async getTeeStatus(): Promise<ApiResponse> {
    return this.makeRequest('/tee/status');
  }

  async submitToTee(data: any): Promise<ApiResponse> {
    return this.makeRequest('/tee/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateZkProof(data: any): Promise<ApiResponse> {
    return this.makeRequest('/zk/generate-proof', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyZkProof(proof: any): Promise<ApiResponse> {
    return this.makeRequest('/zk/verify-proof', {
      method: 'POST',
      body: JSON.stringify(proof),
    });
  }

  async submitModelUpdate(update: any): Promise<ApiResponse> {
    return this.makeRequest('/federated/submit-update', {
      method: 'POST',
      body: JSON.stringify(update),
    });
  }

  async getGlobalModel(): Promise<ApiResponse> {
    return this.makeRequest('/federated/global-model');
  }

  async verifyWalletSignature(signature: string, message: string, address: string): Promise<ApiResponse> {
    return this.makeRequest('/web3/verify-signature', {
      method: 'POST',
      body: JSON.stringify({ signature, message, address }),
    });
  }

  async getContractData(contractAddress: string): Promise<ApiResponse> {
    return this.makeRequest(`/web3/contract/${contractAddress}`);
  }

  async trackEvent(event: string, properties: any): Promise<ApiResponse> {
    return this.makeRequest('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ event, properties }),
    });
  }

  async getUserProfile(userId: string): Promise<ApiResponse> {
    return this.makeRequest(`/user/${userId}`);
  }

  async updateUserProfile(userId: string, profile: any): Promise<ApiResponse> {
    return this.makeRequest(`/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  async getDemoData(): Promise<ApiResponse> {
    return this.makeRequest('/demo/data');
  }

  async submitDemoFeedback(feedback: any): Promise<ApiResponse> {
    return this.makeRequest('/demo/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }
}

const apiService = new ApiService();

export default apiService;
export type {
  ApiResponse,
  PitchAnalysisRequest,
  PitchAnalysisResponse,
  PaymentIntentRequest,
  PaymentIntentResponse,
};
