# Phase 2 Setup Guide: Database Integration

This guide walks through enabling Phase 2 - Real Database Integration with Supabase.

## Prerequisites

- Supabase project created and connected to v0
- Environment variables set: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Step 1: Initialize Database Schema

Run the migration script in Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create a new query and paste the contents of `/scripts/001_setup_database.sql`
4. Execute the query

This creates:
- `users` table (synced with Supabase auth)
- `debates` table (stores all debate records)
- `school_licenses` table (manages school tier access codes)
- `oracle_conversations` table (stores Oracle mode conversations)
- Row Level Security (RLS) policies for data protection

## Step 2: Verify Environment Variables

Check that these are set in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## Step 3: Add Test School License Codes

In Supabase SQL Editor, insert test license codes:

```sql
INSERT INTO public.school_licenses (code, school_name, issued_to_email, max_activations)
VALUES 
  ('SCHOOL2024', 'Test High School', 'admin@testschool.edu', 100),
  ('SCHOOL2025', 'Another School', 'admin@anotherschool.edu', 50);
```

## Step 4: Test the Flow

1. **Home Page**: Live Debates ticker now fetches real data from database
2. **Profile Page**: School license input works and updates tier to SCHOOL
3. **Debates**: Playing a debate automatically saves to database
4. **Oracle**: Conversations save to oracle_conversations table

## What's Now Working

✅ Real-time recent debates on home page ticker
✅ School license validation via code entry
✅ Player tier system (FREE → SCHOOL → UNDERGROUND)
✅ All debate history persists to database
✅ Oracle conversations are saved and can be retrieved
✅ Row-level security protects user data

## Phase 2 Features Enabled

### Live Debates Ticker
- Fetches real recent debates from database
- Falls back to mock data if database unavailable
- Shows player names, topics, results, voter scores

### School License System
- Enter code on profile page
- Validates against school_licenses table
- Upgrades tier from FREE to SCHOOL
- Unlocks light theme (future enhancement)

### Debate Persistence
- All debate results saved to database
- Includes all scoring details and arguments
- Linked to player account via RLS

### Oracle Mode Integration
- Conversations stored in oracle_conversations table
- Depth tracking for belief system analysis
- Support for both oracle and underground modes

## Phase 3 Roadmap

When ready for Phase 3 (Authentication + User Accounts):

1. Implement Supabase Auth signup/login pages
2. Replace localStorage with authenticated Supabase queries
3. Add email verification workflow
4. Implement Underground tier with age verification
5. Add leaderboards and real-time debate feeds

## Troubleshooting

**Q: Live Debates ticker shows mock data**
A: Database connection failed. Check:
- Environment variables are set correctly
- Supabase project is accessible
- Migration script executed successfully
- RLS policies allow public read on debates

**Q: School license code not validating**
A: Verify:
- License code exists in school_licenses table
- License is active (active = true)
- Code hasn't exceeded max_activations
- API route is accessible at /api/school-license/validate

**Q: Debates not saving to database**
A: Check:
- User is authenticated with Supabase
- Debates table RLS policies are correct
- user_id matches authenticated user

## Next Steps

After Phase 2 is fully working, implement Phase 3:
- User authentication with email/password
- Underground tier with age gate
- Real leaderboards across all players
- Notification system for new debates
