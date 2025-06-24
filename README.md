# FreeChat - AI Chat with Contextual Ads

A modern, secure AI chat application built with Next.js that provides intelligent conversations powered by OpenAI while displaying contextual advertisements.

## Features

- 🤖 **AI-Powered Chat**: Conversations using OpenAI's GPT models
- 🔐 **Google Authentication**: Secure login with NextAuth.js
- 📱 **Responsive Design**: Beautiful UI built with Tailwind CSS
- 🎯 **Contextual Ads**: Revenue generation through targeted advertisements
- ⚡ **Real-time Streaming**: Live response streaming for better UX
- 🛡️ **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **AI Integration**: OpenAI API
- **Deployment**: Optimized for Vercel
- **Styling**: Tailwind CSS with modern design patterns

## Prerequisites

- Node.js 18+ and npm
- Google OAuth credentials
- OpenAI API key

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd free-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Fill in the following required variables:

   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=sk-...

   # Google OAuth Configuration (Get from Google Cloud Console)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # NextAuth Configuration
   NEXTAUTH_SECRET=your-random-secret-string
   NEXTAUTH_URL=http://localhost:3000

   # Optional: AdSense Configuration
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxx
   NEXT_PUBLIC_ADSENSE_SLOT=xxxxxxxxxx
   ```

## Getting API Keys

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and navigate to API Keys
3. Generate a new secret key
4. Add billing information to avoid rate limits

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth client ID
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### NextAuth Secret
Generate a random string for session encryption:
```bash
openssl rand -base64 32
```

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes
│   │   ├── auth/        # NextAuth configuration
│   │   └── chat/        # Chat API endpoint
│   ├── chat/            # Chat page
│   ├── login/           # Login page
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── ChatWindow.tsx   # Main chat interface
│   ├── MessageBubble.tsx # Individual message display
│   ├── SidebarAds.tsx   # Advertisement sidebar
│   ├── SignInButton.tsx # Google sign-in button
│   ├── SignOutButton.tsx # Sign-out button
│   └── TopBar.tsx       # Navigation header
├── lib/                 # Utility libraries
│   ├── authOptions.ts   # NextAuth configuration
│   └── sessionProvider.tsx # Session provider wrapper
└── types/               # TypeScript definitions
    ├── message.ts       # Message and conversation types
    └── next-auth.d.ts   # NextAuth type extensions
```

## Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Import your GitHub repository to Vercel
   - Vercel will auto-detect Next.js and configure build settings

2. **Set Environment Variables**
   In your Vercel dashboard, add all environment variables from `.env.local`:
   - `OPENAI_API_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your production URL)
   - `NEXT_PUBLIC_ADSENSE_CLIENT` (optional)
   - `NEXT_PUBLIC_ADSENSE_SLOT` (optional)

3. **Update OAuth Settings**
   Add your production domain to Google OAuth authorized redirect URIs

4. **Deploy**
   Push to your main branch and Vercel will automatically deploy

### Other Platforms

The application can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Configuration

### Chat Settings

The chat API is configured in `src/app/api/chat/route.ts`:
- Model: `gpt-3.5-turbo` (changeable to `gpt-4` if needed)
- Max tokens: 1000
- Temperature: 0.7
- Streaming: Enabled

### Advertisement Integration

The app includes two advertisement strategies:

1. **Google AdSense** (MVP)
   - Automatic contextual ad matching
   - Easy setup with AdSense approval
   - Revenue sharing with Google

2. **Custom Semantic Ads** (Future Enhancement)
   - Vector similarity matching
   - Custom ad database
   - Full control over ad content and revenue

## Security Features

- **Authentication**: Secure OAuth 2.0 with Google
- **Session Management**: JWT tokens with NextAuth.js
- **API Protection**: All chat endpoints require authentication
- **Environment Variables**: Sensitive data stored securely
- **CORS Protection**: API routes protected from unauthorized origins

## Performance Optimizations

- **Streaming Responses**: Real-time chat experience
- **Code Splitting**: Automatic route-based splitting
- **Static Generation**: Static pages where possible
- **Edge Runtime**: Fast global response times
- **Optimized Images**: Next.js automatic image optimization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Cost Management

Monitor your usage to control costs:

- **OpenAI API**: Set billing limits in OpenAI dashboard
- **Vercel**: Monitor function execution and bandwidth
- **AdSense**: Track revenue vs infrastructure costs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages and environment details

---

Built with ❤️ using Next.js, OpenAI, and modern web technologies.
