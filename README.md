# 🎯 FocusTime - Premium Focus Timer for Whop Communities

A beautiful, modern focus timer app built for Whop communities. Help your members stay productive with Pomodoro technique, Deep Work sessions, and ambient background music.

![FocusTime App](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Multiple Focus Modes
- **Pomodoro Technique**: 25-minute focus sessions with 5-minute breaks (15-minute break every 4 rounds)
- **Deep Work**: 90-minute uninterrupted focus sessions for maximum productivity
- **Custom Timer**: Set your own duration from 1 minute to 12 hours

### 🎵 Background Music
- **Lo-Fi Beats**: Chill background music for concentration
- **Binaural Sounds**: Brain-enhancing frequencies
- **Nature Ambience**: Calming natural sounds
- **Volume Control**: Adjust music to your preference

### 📊 Progress Tracking
- Total focus sessions completed
- Total hours of focused work
- Daily streak tracking
- Weekly goal progress
- Session history (with Supabase)

### 🎨 Premium Design
- Modern gradient UI with purple-pink accent colors
- Smooth animations with Framer Motion
- Dark theme optimized for focus
- Fully responsive layout
- Beautiful circular progress indicator

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Whop account and app created
- (Optional) Supabase account for data persistence

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure Whop App**

Create a Whop App on your [Whop Developer Dashboard](https://whop.com/dashboard/developer/), then configure:
- **Base URL**: Your deployment domain (e.g., `https://your-app.vercel.app`)
- **App path**: `/experiences/[experienceId]`
- **Dashboard path**: `/dashboard/[companyId]`
- **Discover path**: `/discover`

3. **Set up environment variables**

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Whop Configuration
WHOP_API_KEY="your_whop_api_key_here"
WHOP_WEBHOOK_SECRET="your_webhook_secret_here"
NEXT_PUBLIC_WHOP_APP_ID="your_app_id_here"

# Supabase Configuration (Optional)
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

4. **Set up Supabase (Optional but Recommended)**

If you want to persist user data and track statistics:
- Create a project at [Supabase](https://supabase.com)
- Run the SQL schema from `supabase-schema.sql` in your Supabase SQL Editor
- Add your Supabase credentials to `.env.local`

5. **Run the development server**

```bash
npm run dev
```

6. **Test in Whop**
- Go to a Whop community in the same org as your app
- Navigate to the Tools section and add your app
- Click the settings icon (top right) and select "localhost"

## 📁 Project Structure

```
focustime/
├── app/
│   ├── api/
│   │   ├── sessions/       # Session tracking API
│   │   └── stats/          # User statistics API
│   ├── experiences/        # Main app page
│   └── globals.css         # Global styles
├── components/
│   ├── FocusTimer.tsx      # Main timer component
│   ├── ModeSelector.tsx    # Mode selection UI
│   ├── MusicPlayer.tsx     # Background music player
│   ├── StatsPanel.tsx      # Statistics display
│   └── CustomTimerModal.tsx # Custom timer settings
├── lib/
│   ├── store.ts            # Zustand state management
│   ├── supabase.ts         # Supabase client
│   └── whop-sdk.ts         # Whop SDK configuration
├── supabase-schema.sql     # Database schema
└── SETUP.md                # Detailed setup guide
```

## 🎨 Color Palette

The app uses a premium dark theme with vibrant gradient accents:

- **Primary Gradient**: `#8B5CF6` (Purple) → `#EC4899` (Pink)
- **Background**: `#030712`, `#111827`, `#1F2937` (Dark grays)
- **Accent Colors**:
  - Blue-Cyan: Lo-Fi music
  - Purple-Pink: Binaural sounds
  - Green-Emerald: Nature sounds
  - Orange-Red: Streak indicators

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Whop SDK
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.local`
4. Deploy!

### Post-Deployment

After deployment, update your Whop app settings:
- Set "Base URL" to your Vercel domain
- Update webhook URLs if configured

## 📖 Documentation

- [Detailed Setup Guide](SETUP.md)
- [Whop Apps Documentation](https://docs.whop.com/apps)
- [Supabase Documentation](https://supabase.com/docs)

## 🎵 Adding Music Files

To add actual music files:

1. Create a `public/music/` directory
2. Add your audio files:
   - `lofi.mp3` - Lo-Fi background music
   - `binaural.mp3` - Binaural beats
   - `nature.mp3` - Nature sounds
3. Update `MusicPlayer.tsx` to load these files

Or use streaming URLs from services like:
- YouTube Audio Library
- Free Music Archive
- Incompetech

## 🤝 Contributing

This is a Whop app template. Feel free to:
- Customize the design
- Add new features
- Improve the code
- Share with the community

## 📝 License

This project is built using the Whop Next.js App Template.

## 🆘 Support

For issues or questions:
- **Whop Docs**: https://docs.whop.com/apps
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

Built with ❤️ for focused, productive work. Stay in the zone! 🎯
