# Underground Debate Club

A sophisticated multi-surface debate platform powered by Claude AI. Users engage in rapid-fire Surface Game debates, structured School Portal competitions, or unrestricted Underground debates with AI opponents that adapt to different arguing styles.

## Project Architecture

### Three Debate Surfaces

1. **Surface Game** - Fast-paced word-based tournaments
   - Quick Round (1 min)
   - Speed Duel (3 min) 
   - Rapid Fire (5 min)
   - Rapid scoring and instant results
   - Perfect for training reflexes

2. **School Portal** - Formal academic debate
   - Class-based competitions
   - Teacher assignments and deadlines
   - Class-wide leaderboards
   - Academic rigor and structured formats
   - Suitable for classroom evaluation

3. **Underground** - Unrestricted intellectual combat
   - Unlimited topics from community
   - Trending debate discovery
   - Deep, nuanced argumentation
   - Multiple debate personas
   - Full argument history and analysis

### System Components

```
/public/
  ├── index.html          # Single-page app entry
  ├── app.js              # Router, screens, state management
  └── styles.css          # Design system and animations

/netlify/functions/
  ├── debate.js           # Claude AI debate generation
  ├── score.js            # Argument evaluation and scoring
  ├── rankings.js         # Leaderboard management
  └── stats.js            # User statistics and achievements
```

## Core Features

### Debate Engine
- **Claude AI Integration**: Uses Claude 3.5 Sonnet for sophisticated argumentation
- **Three Debate Personas**:
  - Analytical: Logical reasoning, data-driven
  - Rhetorical: Persuasive language, narrative structure
  - Socratic: Probing questions, assumption challenges
- **Multi-turn Conversation**: Full debate context passed to maintain coherence
- **Adaptive Difficulty**: AI adjusts persona and intensity based on user skill

### Scoring System
- **Five-Dimension Evaluation**:
  - Logic & Reasoning (0-100)
  - Evidence Quality (0-100)
  - Clarity (0-100)
  - Rebuttal Strength (0-100)
  - Engagement (0-100)
- **Total Score Scale**: 0-500 per argument
- **Automated Judging**: Claude evaluates both arguments fairly
- **Detailed Feedback**: Strengths, weaknesses, and improvement suggestions

### Leaderboard System
- **Global Rankings**: Top debaters worldwide
- **Class Leaderboards**: Per-classroom rankings for school mode
- **Ranking Filters**: All-time, monthly, weekly perspectives
- **Achievement Tracking**: Milestones and badges unlocked by performance
- **Streak Display**: Current and all-time win streaks

### User Statistics
- **Performance Metrics**:
  - Total wins, debates, win rate
  - Average score per debate
  - Current and longest streaks
  - Level and total points
- **Achievement System**: 
  - First Victory
  - On Fire (5+ streak)
  - Flawless (Perfect round)
  - Unstoppable (10+ streak)
  - Debate Master
- **Recent History**: Track last 3-5 debates with results
- **Time Tracking**: Last active time, join date

## Setup & Deployment

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Anthropic API key (Claude access)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Underground-Debate-Club
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   ```bash
   cp .env.example .env
   # Add your ANTHROPIC_API_KEY to .env
   ```

4. **Start development server**
   ```bash
   netlify dev
   ```

   The app will be available at `http://localhost:8888`

### Deployment to Netlify

1. **Connect GitHub repository** to Netlify
2. **Set environment variables** in Netlify dashboard
3. **Deploy** - automatic on push to main branch

```bash
netlify deploy --prod
```

## API Endpoints

### /api/functions/debate
**POST** - Generate AI debate response

**Request:**
```json
{
  "userArgument": "Your argument here",
  "topic": "Topic name",
  "debateContext": [],
  "round": 1,
  "difficulty": "medium",
  "debateMode": "underground"
}
```

**Response:**
```json
{
  "success": true,
  "debateResponse": {
    "counterArgument": "AI's counter-argument",
    "keyPoints": ["point1", "point2"],
    "scoreBreakdown": {
      "logic": 75,
      "evidence": 70,
      "clarity": 85
    }
  },
  "persona": "Analytical Debater"
}
```

### /api/functions/score
**POST** - Evaluate and score debate arguments

**Request:**
```json
{
  "userArgument": "User's argument",
  "opponentArgument": "Opponent's argument",
  "topic": "Topic name",
  "debateMode": "underground"
}
```

**Response:**
```json
{
  "success": true,
  "scoringResult": {
    "userScore": {
      "total": 385,
      "breakdown": {
        "logic": 80,
        "evidence": 75,
        "clarity": 85,
        "rebuttal": 70,
        "engagement": 85
      },
      "strengths": ["Clear structure", "Strong evidence"],
      "weaknesses": ["Limited counterpoints"],
      "feedback": "Excellent argument with room for rebuttal"
    },
    "opponentScore": { ... },
    "winner": "user",
    "summary": "User's superior logic and evidence secured victory"
  }
}
```

### /api/functions/rankings
**GET** - Retrieve leaderboards

Query params:
- `type`: 'global' or 'class'
- `limit`: Number of results (default: 50)
- `classId`: Class identifier (for class rankings)

### /api/functions/stats
**GET** - Retrieve user statistics

Query params:
- `userId`: User identifier

**POST** - Update user statistics and check for achievements

## Design System

### Color Palette
- **Primary**: #1a1a2e (Dark background)
- **Secondary**: #16213e (Secondary background)
- **Accent**: #00d4ff (Cyan - primary highlights)
- **Accent Warm**: #ff6b35 (Orange - secondary highlights)
- **Success**: #22c55e (Green - wins/success)
- **Warning**: #f59e0b (Amber - caution)
- **Error**: #ef4444 (Red - losses/errors)

### Typography
- **Headings**: System font stack, weights 600-900
- **Body**: System font stack, weight 400-500
- **Code**: Monospace for arguments and debate text

### Components
- **Cards**: Glassmorphic design with backdrop blur
- **Buttons**: Primary (gradient), Secondary (outline), Warm (secondary gradient)
- **Badges**: Colored indicators for status
- **Progress Bars**: Visual representation of scores and stats
- **Animations**: Fade-in, pulse, spin, slide transitions

## State Management

The app uses a simple global state object:

```javascript
appState = {
  user: null,           // Current user data
  surface: null,        // Selected surface (surface/school/underground)
  selectedClass: null,  // For school portal
  selectedTopic: null,  // Current debate topic
  currentBattle: null   // Active debate state
};
```

Screen transitions use `navigateTo()` to update state and re-render:

```javascript
navigateTo(SCREENS.BATTLE, {
  selectedClass: 'underground',
  selectedTopic: 'ai-consciousness'
});
```

## Performance Optimizations

- Single-page app eliminates page reloads
- Client-side rendering with efficient DOM manipulation
- API calls handled through Netlify Functions for edge computing
- CSS animations use GPU acceleration
- Responsive design adapts to all screen sizes

## Security Considerations

- **API Keys**: Netlify Functions environment variables (never exposed to client)
- **User Input**: Arguments validated before API submission
- **CORS**: Configured for Netlify deployment
- **Rate Limiting**: Implement per-user debate limits in production

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Real-time multiplayer debates (P2P)
- [ ] Database integration (Supabase, Firebase)
- [ ] Advanced analytics and performance tracking
- [ ] Custom debate topics creation and moderation
- [ ] In-app notifications and messaging
- [ ] Mobile-optimized native apps
- [ ] Live streaming of tournament finals
- [ ] Debate history export and analysis
- [ ] AI model fine-tuning on debate corpus

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Contact the development team

---

Built with Claude AI • Powered by Netlify • Designed for intellectual growth
