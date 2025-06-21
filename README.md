# Stealth Code - AI-Powered Pitch Analyzer

A secure, privacy-first platform for analyzing startup pitches using advanced AI models with end-to-end encryption.

## 🚀 Features

- **🔒 End-to-End Encryption**: AES-256-GCM encryption with client-side key generation
- **🤖 AI-Powered Analysis**: Multiple AI models (GPT-4, Claude, Mistral) for comprehensive evaluation
- **🛡️ Zero-Knowledge Architecture**: Your pitch content is never stored or logged in plaintext
- **💳 Flexible Payments**: Support for both traditional payments (Stripe) and cryptocurrency
- **📱 Mobile-Responsive**: Optimized for all devices with PWA support
- **⚡ Real-Time Analysis**: Get instant feedback on your pitch quality

## 🛠️ Tech Stack

### Frontend
- **Next.js 14.0.4** - React framework with App Router
- **TypeScript 5.2.2** - Type-safe development
- **Tailwind CSS 3.3.5** - Utility-first styling
- **Framer Motion 10.16.4** - Smooth animations
- **Web Crypto API** - Client-side encryption

### Backend
- **Next.js API Routes** - Serverless functions
- **OpenRouter API** - Multi-model AI access
- **Stripe** - Payment processing
- **Web3** - Cryptocurrency payments

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stealth-code.git
   cd stealth-code
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your API keys:
   - `OPENROUTER_API_KEY`: Get from [OpenRouter](https://openrouter.ai)
   - `STRIPE_SECRET_KEY`: Get from [Stripe Dashboard](https://dashboard.stripe.com)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Security Features

### Client-Side Encryption
- AES-256-GCM encryption using Web Crypto API
- Secure random key and IV generation
- Base64 encoding for safe transmission

### Server-Side Security
- In-memory decryption only
- No plaintext logging or storage
- Immediate memory cleanup after analysis
- SHA-256 cryptographic receipts

### Privacy Guarantees
- Zero-knowledge architecture
- No database persistence of pitch content
- Cryptographic verification without data exposure

## 📊 API Endpoints

### `POST /api/analyze-pitch`
Analyzes encrypted pitch data and returns scores.

**Request:**
```json
{
  "encrypted_pitch": "base64_encrypted_content",
  "encryption_key": "base64_key",
  "encryption_iv": "base64_iv",
  "model": "mistral-7b-instruct"
}
```

**Response:**
```json
{
  "clarity": 85,
  "originality": 78,
  "team_strength": 92,
  "market_fit": 88,
  "receipt": "sha256_hash"
}
```

### `POST /api/create-payment-intent`
Creates a Stripe payment intent for subscriptions.

### `GET /api/health`
Health check endpoint for monitoring.

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.js` for theme customization
- Edit color gradients in CSS custom properties

### AI Models
- Configure available models in the analyzer component
- Adjust scoring criteria in the API route
- Modify prompt templates for different analysis types

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Docker
```bash
# Build the image
docker build -t stealthscore .

# Run the container
docker run -p 3000:3000 stealthscore
```

### Manual Deployment
```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🔧 Configuration

### Environment Variables
- `OPENROUTER_API_KEY`: Required for AI analysis
- `STRIPE_SECRET_KEY`: Required for payments
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Required for client-side Stripe
- `NEXT_PUBLIC_APP_URL`: Your app's URL for CORS

### AI Model Configuration
Edit the model options in `src/components/PitchAnalyzer.tsx`:
```typescript
const models = [
  'mistral-7b-instruct',
  'gpt-4',
  'claude-3-sonnet',
  'mixtral-8x7b-instruct'
]
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

- 📧 Email: support@stealthscore.com
- 💬 Discord: [Join our community](https://discord.gg/stealthscore)
- 📖 Documentation: [docs.stealthscore.com](https://docs.stealthscore.com)

## 🙏 Acknowledgments

- OpenRouter for AI model access
- Stripe for payment processing
- Vercel for hosting platform
- The open-source community for amazing tools

---

**Built with ❤️ for entrepreneurs who value privacy**