# Underground Debate Club - Quick Start

## 📱 Phase 1: Run Immediately

```bash
npm install
npm run dev
# Open http://localhost:3000
```

**You're done!** Full game ready to play with mock data.

---

## 🎮 How to Play

1. **Create Player**: Enter your name on home page
2. **Choose Topic**: Select debate topic from 20+ options
3. **Select Class**: Pick rhetoric style (Analyst, Firebrand, Trickster, Diplomat)
4. **Pick Opponent**: AI opponent difficulty
5. **Prep (30s)**: Shadow Cabinet generates talking points
6. **Battle (3 rounds)**: 
   - Write your arguments
   - Use 6 power cards strategically
   - Impress 5 AI voters
7. **Results**: See scoring, voter votes, and debrief
8. **Earn Badges**: Unlock 11 achievements
9. **Level Up**: Reach Oracle mode after 5 debates

---

## 📊 Game Mechanics

**5 Voters**: Each has unique preferences
- Logic-focused: Rewards structured arguments
- Emotion-focused: Responds to passion
- Fact-focused: Wants evidence
- Common-sense: Practical angle
- Wildcard: Unpredictable

**6 Power Cards** (1 per round + 2 bonus):
- FLIP: Reverse voter preference
- FACT: Boost logic score
- MIRROR: Reflect opponent argument
- AMPLIFY: Increase rhetoric impact
- RECESS: Skip opponent's turn
- SILENCE: Block power card

**Scoring**: Base score + class bonus + keyword matching + voter alignment

**11 Badges**:
- Skill-based (Logic Master, Wordsmith, etc.)
- Win-based (5 Wins, 10 Wins, Perfect Victory)
- Class-based (True Analyst, Diplomatic Master, etc.)

---

## 🔐 Phase 2: Add Database (When Ready)

### Step 1: Setup Supabase
- Create project at supabase.com
- Get 3 env vars: URL, ANON_KEY, SERVICE_ROLE_KEY

### Step 2: Add to v0 Project
In project settings → Variables, add:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Step 3: Initialize Database
1. Go to Supabase SQL Editor
2. Copy paste: `/scripts/001_setup_database.sql`
3. Execute
4. Done! Real database active

### Step 4: Test School License
1. Go to Profile page
2. Enter: `SCHOOL2024`
3. Your tier upgrades to SCHOOL
4. All debate data now saves

---

## 🔓 Phase 3: Authentication (Future)

When you're ready, authentication framework is ready:
- Email/password signup
- Email verification
- Underground tier (18+ age gate)
- Leaderboards
- Player profiles

Just activate the auth pages and Supabase Auth configuration already exists.

---

## 📁 Project Structure

```
├── app/
│   ├── page.tsx              # Home + Live Debates
│   ├── lobby/                # Topic selection
│   ├── cabinet/              # AI prep
│   ├── battle/               # 3-round game
│   ├── results/              # Scoring & debrief
│   ├── profile/              # Stats + school license
│   ├── oracle/               # Deep conversations
│   ├── underground/          # 18+ mode
│   └── api/                  # All API routes
├── components/
│   ├── ui/                   # 11 base components
│   └── game/                 # Game-specific UI
├── lib/
│   ├── types.ts              # Type definitions
│   ├── constants.ts          # Game data
│   ├── scoring.ts            # Scoring logic
│   ├── storage.ts            # localStorage
│   └── supabase/             # Database clients
└── scripts/
    └── 001_setup_database.sql # Database schema
```

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `/app/battle/page.tsx` | Main game engine |
| `/lib/scoring.ts` | Voting & scoring algorithm |
| `/lib/constants.ts` | All game data (badges, topics, etc.) |
| `/components/game/TensionRope.tsx` | Judge position visualization |
| `/components/game/VoterSwarm.tsx` | Voter decision display |
| `/components/game/LiveDebatesTicker.tsx` | Recent debates feed |
| `/app/api/debates/recent/route.ts` | Fetch live debates |
| `/scripts/001_setup_database.sql` | Database schema |

---

## 🚀 Deployment

### Deploy Phase 1 Now
```bash
# In v0:
npm run build  # Should succeed
# Then click "Publish" button
```

**No env vars needed** - all mock data included

### Add Database When Ready
1. Connect Supabase
2. Set env vars in Vercel
3. Run SQL migration
4. Redeploy

---

## 🐛 Troubleshooting

**Q: Page won't load**
A: Run `npm install` and `npm run dev`

**Q: Debates not saving**
A: Phase 1 uses localStorage - just for this session. Phase 2 will use database.

**Q: School license code says invalid**
A: During Phase 2, you need to add license codes to Supabase first.

**Q: Claude API error**
A: Debate API already configured. It uses Vercel AI Gateway (no key needed).

**Q: Something crashed**
A: Check browser console (F12) for errors. All game state persists via localStorage.

---

## 📖 Documentation

- `IMPLEMENTATION_COMPLETE.md` - Full technical summary
- `PHASES_ROADMAP.md` - 5-phase complete roadmap
- `PHASE_2_SETUP.md` - Database setup guide
- `PROJECT_SUMMARY.md` - Feature overview

---

## 🎓 Learning Paths

### Play a Debate
1. Home → "Enter Arena"
2. Select topic and class
3. Shadow Cabinet prep (30s)
4. Battle: 3 rounds of debate
5. See results and unlock badges

### Test Power Cards
1. During battle, notice "Power Card" prompts
2. Each card has unique effect
3. Strategic cooldowns prevent spam
4. Try different combinations

### Check Profiles
1. After debates, click your name
2. See all stats and unlocked badges
3. Try changing rhetoric class
4. During Phase 2, unlock with school code

### Try Oracle Mode
1. Play 5 debates to unlock
2. Click "Visit Oracle" on profile
3. Have deep conversation mode
4. Receive personalized oracle line

---

## 🎯 Next Steps

### Right Now
- [ ] Run `npm install && npm run dev`
- [ ] Create a player
- [ ] Play 1 debate start to finish
- [ ] Check profile and badges

### This Week
- [ ] Play multiple debates
- [ ] Try all 4 rhetoric classes
- [ ] Unlock Oracle mode (5 debates)
- [ ] Get 5 different badges

### When Ready
- [ ] Set up Supabase (Phase 2)
- [ ] Run database migration
- [ ] Test real data storage
- [ ] Use school license code

### Future
- [ ] Add authentication (Phase 3)
- [ ] Create leaderboards
- [ ] Invite friends
- [ ] Launch Underground tier

---

## 💡 Pro Tips

- **Power Cards**: Save FLIP for close votes
- **Rhetoric Class**: Analyst = logic bonus, Firebrand = emotion bonus
- **Oracle Line**: Unlocks after Oracle mode (Phase 3)
- **Badges**: Check which ones you need, plan strategies
- **Streaks**: Win consecutively to unlock streak badges

---

## 📞 Support

- See error? Check console (F12)
- Need database help? See `PHASE_2_SETUP.md`
- Want to understand code? Check `PROJECT_SUMMARY.md`
- Full roadmap? See `PHASES_ROADMAP.md`

---

**Status**: ✅ Ready to play NOW
**Next**: Phase 2 when you connect Supabase
