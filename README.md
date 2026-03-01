# Underground-Debate-Club

AI-powered debate club platform with Claude API integration.

## Architecture

- **Frontend**: TypeScript-based UI (builds to `/dist`)
- **API Routes**: Vercel serverless functions in `/api/` directory
- **Backend**: Anthropic Claude API for debate and debrief generation

## Setup

### Prerequisites
- Node.js 18+ and npm/pnpm
- Anthropic API Key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your API key:
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### Local Development

Build the UI:
```bash
npm run build:ui
```

### Vercel Deployment

1. Push code to the `claude/fix-vercel-deployment-VgxnA` branch:
```bash
git push -u origin claude/fix-vercel-deployment-VgxnA
```

2. Set environment variable in Vercel dashboard:
```bash
vercel env add ANTHROPIC_API_KEY production
```

3. Vercel will automatically detect and deploy using the `vercel.json` configuration.

## API Endpoints

- `POST /api/debate` - Generate debate arguments
- `POST /api/debrief` - Provide debate analysis and feedback
- `GET /api/health` - Health check endpoint

## Environment Variables

- `ANTHROPIC_API_KEY` - Required. Your Anthropic API key from https://console.anthropic.com/api-keys
