# FocusTime - Whop App Setup Guide

A premium focus timer app for Whop communities with Pomodoro technique, Deep Work sessions, and ambient music.

## Features

- 🎯 **Multiple Focus Modes**
  - Pomodoro (25 min focus + 5 min break)
  - Deep Work (90 min uninterrupted sessions)
  - Custom timer durations

- 🎵 **Background Music**
  - Lo-Fi beats
  - Binaural sounds
  - Nature ambience
  - Volume control

- 📊 **Progress Tracking**
  - Session history
  - Focus time statistics
  - Streak tracking
  - Weekly goals

- 🎨 **Premium UI**
  - Modern gradient design
  - Smooth animations
  - Dark theme optimized for focus
  - Responsive layout

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Whop App

1. Create a Whop App on your [Whop Developer Dashboard](https://whop.com/dashboard/developer/)
2. In the "Hosting" section, set:
   - **Base URL**: Your deployment domain (e.g., `https://your-app.vercel.app`)
   - **App path**: `/experiences/[experienceId]`
   - **Dashboard path**: `/dashboard/[companyId]`
   - **Discover path**: `/discover`

3. Copy `.env.development` to `.env.local` and fill in your values:

```env
WHOP_API_KEY="your_whop_api_key_here"
WHOP_WEBHOOK_SECRET="your_webhook_secret_here"
NEXT_PUBLIC_WHOP_APP_ID="your_app_id_here"
```

### 3. Configure Supabase (Optional but Recommended)

1. Create a project at [Supabase](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql`
3. Add to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

### 4. Add Music Files (Optional)

Place your audio files in the `public/music/` directory:
- `lofi.mp3` - Lo-Fi background music
- `binaural.mp3` - Binaural beats
- `nature.mp3` - Nature sounds

Or use streaming URLs in the `MusicPlayer.tsx` component.

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 6. Test in Whop

1. Go to a Whop community in the same org as your app
2. Navigate to Tools section
3. Add your app
4. In the top right, click the settings icon and select "localhost"

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.local`
4. Deploy!

### Update Whop Settings

After deployment, update your Whop app's "Base URL" to your Vercel domain.

## Color Palette

The app uses a premium dark theme with gradient accents:

- **Primary Gradient**: Purple (#8B5CF6) to Pink (#EC4899)
- **Background**: Dark gray (#030712, #111827, #1F2937)
- **Accents**: 
  - Blue-Cyan for Lo-Fi
  - Purple-Pink for Binaural
  - Green-Emerald for Nature
  - Orange-Red for Streaks

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Authentication**: Whop SDK
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

## Support

For issues or questions:
- Whop Docs: https://docs.whop.com/apps
- Supabase Docs: https://supabase.com/docs

---

Built with ❤️ for focused work
