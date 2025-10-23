# 🚀 Quick Start Guide

Get FocusTime running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

1. Copy the example file:
```bash
# On Windows PowerShell
copy .env.example .env.local

# On Mac/Linux
cp .env.example .env.local
```

2. Get your Whop credentials from [Whop Dashboard](https://whop.com/dashboard/developer/)
3. Open `.env.local` and add your credentials

## Step 3: Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## Step 4: Test with Whop

1. Go to your Whop community
2. Add the app from Tools section
3. Click settings icon (top right) → Select "localhost"
4. Your app should now load in Whop!

## Optional: Add Supabase

For persistent data and statistics:

1. Create account at [Supabase](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run `supabase-schema.sql`
4. Add Supabase URL and key to `.env.local`
5. Restart the dev server

## Need Help?

- Check [SETUP.md](SETUP.md) for detailed instructions
- Read [README.md](README.md) for full documentation
- Visit [Whop Docs](https://docs.whop.com/apps)

---

Happy focusing! 🎯
