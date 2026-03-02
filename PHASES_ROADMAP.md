# Underground Debate Club - Complete Phases Roadmap

## Phase 1: MVP with Mock Data (COMPLETE ✓)

**Status**: Ready for deployment

### Features Implemented
- ✓ Complete debate game with 3 rounds
- ✓ 5 voter decision system with preference matching
- ✓ 6 power card abilities (FLIP, FACT, MIRROR, AMPLIFY, RECESS, SILENCE)
- ✓ Real-time scoring with class bonuses
- ✓ 11-badge achievement system
- ✓ Live Debates ticker with mock data
- ✓ Rhetoric class selection (Analyst, Firebrand, Trickster, Diplomat)
- ✓ Shadow Cabinet prep with AI argument generation
- ✓ Oracle mode (unlocks after 5 debates)
- ✓ Underground mode (exclusive to 18+ users)
- ✓ Player profiles with stats and badges
- ✓ Tiered access system framework (FREE/SCHOOL/UNDERGROUND)

### Technology Stack
- Next.js 15 with App Router
- TailwindCSS with custom theme system
- React hooks for client state
- localStorage for persistence
- Anthropic Claude API for debate arguments

### Files
- `/app` - All game pages (9 pages)
- `/components` - UI and game components
- `/lib` - Utilities, types, constants, API client
- Mock data in LiveDebatesTicker and Battle page

### How to Run
```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Phase 2: Database Integration (PARTIALLY READY)

**Status**: Infrastructure ready, awaiting Supabase configuration

### Features to Enable
- ✓ Real debate persistence to Supabase
- ✓ Live recent debates ticker from database
- ✓ School license code validation
- ✓ Player profile sync with database
- ✓ Oracle conversation storage
- ✓ Row-level security for data protection

### Database Schema (Ready)
- `/scripts/001_setup_database.sql` - Complete schema with RLS policies
- 4 core tables: users, debates, school_licenses, oracle_conversations
- Triggers for auto-profile creation on signup

### API Routes (Ready)
- `POST /api/debates/create` - Save debate result
- `GET /api/debates/recent` - Fetch recent debates
- `GET /api/debates/user` - Get player's debate history
- `POST /api/school-license/validate` - Validate license code
- `POST /api/oracle/save-conversation` - Store oracle conversations

### Supabase Client Setup (Ready)
- `/lib/supabase/client.ts` - Browser client
- `/lib/supabase/server.ts` - Server client
- `/middleware.ts` - Session management

### To Complete Phase 2
1. Connect Supabase in v0 project settings
2. Set environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. Run migration: `/scripts/001_setup_database.sql` in Supabase SQL Editor
4. Test school license validation (enter code "SCHOOL2024" on profile page)
5. Play debates and verify they save to database
6. See real debates in Live Debates ticker

**See**: `/PHASE_2_SETUP.md` for detailed setup instructions

---

## Phase 3: Authentication & User Accounts

**Status**: Framework in place, awaiting activation

### Features to Add
- [ ] Email/password signup with Supabase Auth
- [ ] Login flow with session management
- [ ] Email verification workflow
- [ ] Underground tier with age gate (18+ verification)
- [ ] Real leaderboards across all players
- [ ] Player comparison and rivalry tracking
- [ ] Subscription waitlist for Underground tier
- [ ] User-to-user challenge system

### API Routes to Add
- `POST /api/auth/signup` - Create new account (framework exists)
- `POST /api/auth/login` - Login with email/password (framework exists)
- `POST /api/auth/logout` - Logout
- `POST /api/auth/verify-email` - Email confirmation
- `POST /api/underground/age-verify` - Age verification for 18+ tier
- `GET /api/leaderboard` - Global rankings by class
- `GET /api/player/[id]` - Public player profiles

### Pages to Add/Update
- `/auth/signup` - New account creation
- `/auth/login` - Login page
- `/auth/verify-email` - Email confirmation
- `/underground/age-gate` - Age verification
- `/leaderboard` - Global rankings
- `/player/[id]` - Public profiles

### Database Updates
- Add email_verified, age_verified, subscription_email fields
- Add leaderboard_stats table
- Add player_relationships table (friends, rivals, blocks)
- Add challenge_requests table

### Authentication Files Available
- `/lib/supabase/client.ts` - Already configured
- `/lib/supabase/server.ts` - Already configured
- `/middleware.ts` - Already handling sessions

---

## Phase 4: Social Features & Monetization

**Status**: Conceptual

### Features
- [ ] Real-time debate notifications
- [ ] Player messaging and friend system
- [ ] Team debates (2v2)
- [ ] Debate tournaments
- [ ] Custom debate topic creation
- [ ] Community debate voting/ratings
- [ ] Stripe integration for subscriptions
- [ ] Underground tier subscription ($9.99/month)
- [ ] Battle passes with exclusive content
- [ ] Content creator verification

---

## Phase 5: Advanced Analytics & ML

**Status**: Conceptual

### Features
- [ ] Argument strength analysis
- [ ] Rhetoric style recommendations
- [ ] Winning pattern detection
- [ ] AI-generated debate coaching
- [ ] Belief system mapping (from Oracle conversations)
- [ ] Community trends and debate analytics
- [ ] Personalized difficulty adjustment

---

## File Structure

```
underground-debate-club/
├── app/
│   ├── page.tsx                 # Home with Live Debates ticker
│   ├── lobby/page.tsx          # Topic & opponent selection
│   ├── cabinet/page.tsx        # Shadow Cabinet prep
│   ├── battle/page.tsx         # 3-round debate arena
│   ├── results/page.tsx        # Results & debrief
│   ├── profile/page.tsx        # Player stats & school license
│   ├── oracle/page.tsx         # Oracle conversation mode
│   ├── underground/page.tsx    # 18+ exclusive debate mode
│   ├── api/                    # API routes for all features
│   │   ├── debates/
│   │   ├── school-license/
│   │   ├── oracle/
│   │   └── auth/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                     # Base UI components
│   ├── game/                   # Game-specific components
│   │   ├── TensionRope.tsx
│   │   ├── VoterSwarm.tsx
│   │   ├── PowerCards.tsx
│   │   ├── ArgumentFeed.tsx
│   │   └── LiveDebatesTicker.tsx
├── lib/
│   ├── supabase/               # Supabase client (Phase 2)
│   ├── types.ts
│   ├── constants.ts
│   ├── storage.ts              # localStorage helpers
│   ├── scoring.ts              # Game scoring logic
│   ├── api.ts                  # API client
│   ├── hooks.ts                # Custom React hooks
│   └── user-context.tsx        # User state provider
├── scripts/
│   └── 001_setup_database.sql  # Database schema (Phase 2)
├── middleware.ts               # Supabase session handling
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## Deployment Checklist

### Phase 1 (Current)
- [x] Deploy to Vercel with mock data
- [x] Test all game flows locally
- [x] Verify responsive design on mobile/tablet/desktop
- [x] Test all 11 badges unlock logic
- [x] Test all power card abilities

### Phase 2 (Next)
- [ ] Set up Supabase project
- [ ] Set environment variables in Vercel
- [ ] Execute database migration
- [ ] Test school license code input
- [ ] Verify debate saving to database
- [ ] Test recent debates API fallback

### Phase 3 (After Phase 2)
- [ ] Implement email verification
- [ ] Add age verification flow
- [ ] Test Supabase Auth integration
- [ ] Implement leaderboards
- [ ] Add Underground tier subscription flow

---

## Environment Variables

### Phase 1 (None required)
App runs with mock data only

### Phase 2 (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Phase 3 (Additional)
```
NEXT_PUBLIC_STRIPE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

---

## Testing Credentials (Phase 2)

### School License Codes
- `SCHOOL2024` - Test school access
- `SCHOOL2025` - Another test code

### Test Account (Phase 3)
- Email: `test@debateclub.com`
- Password: `TempPassword123!`

---

## Performance Metrics Target

- Page load: < 2s
- Debate round generation: < 3s (Claude API)
- Database queries: < 200ms
- Live ticker updates: Real-time
- Mobile score: 90+

---

## Support & Questions

For setup help, see:
- Phase 2: `/PHASE_2_SETUP.md`
- Project Overview: `/PROJECT_SUMMARY.md`
