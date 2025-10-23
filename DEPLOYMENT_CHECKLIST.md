# ✅ Deployment Checklist

Complete this checklist before deploying FocusTime to production.

## Pre-Deployment

### 1. Environment Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add Whop API key from dashboard
- [ ] Add Whop webhook secret
- [ ] Add Whop app ID
- [ ] (Optional) Add Supabase URL
- [ ] (Optional) Add Supabase anon key
- [ ] Verify all environment variables are correct

### 2. Whop Configuration
- [ ] Create Whop app in [Developer Dashboard](https://whop.com/dashboard/developer/)
- [ ] Set Base URL (will update after deployment)
- [ ] Set App path: `/experiences/[experienceId]`
- [ ] Set Dashboard path: `/dashboard/[companyId]`
- [ ] Set Discover path: `/discover`
- [ ] Note down App ID and API key

### 3. Supabase Setup (Optional)
- [ ] Create Supabase project
- [ ] Run `supabase-schema.sql` in SQL Editor
- [ ] Verify tables created: `focus_sessions`, `user_stats`
- [ ] Test database connection
- [ ] Enable Row Level Security policies
- [ ] Note down project URL and anon key

### 4. Local Testing
- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` without errors
- [ ] Test timer functionality
- [ ] Test all three modes (Pomodoro, Deep Work, Custom)
- [ ] Test music player controls
- [ ] Verify stats display (if Supabase connected)
- [ ] Test on different screen sizes
- [ ] Check browser console for errors

### 5. Code Quality
- [ ] Run `npm run lint` (if configured)
- [ ] Fix any TypeScript errors
- [ ] Remove console.log statements (except error logging)
- [ ] Verify all imports are correct
- [ ] Check for unused dependencies

## Deployment to Vercel

### 1. Repository Setup
- [ ] Push code to GitHub/GitLab/Bitbucket
- [ ] Ensure `.env.local` is in `.gitignore`
- [ ] Verify `.env.example` is committed
- [ ] Add proper README.md

### 2. Vercel Deployment
- [ ] Go to [Vercel](https://vercel.com/new)
- [ ] Import your repository
- [ ] Configure project settings:
  - Framework Preset: Next.js
  - Build Command: `npm run build`
  - Output Directory: `.next`
- [ ] Add environment variables:
  - `WHOP_API_KEY`
  - `WHOP_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_WHOP_APP_ID`
  - `NEXT_PUBLIC_SUPABASE_URL` (if using)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if using)
- [ ] Deploy!

### 3. Post-Deployment
- [ ] Note your Vercel deployment URL
- [ ] Visit the URL and verify app loads
- [ ] Test basic functionality
- [ ] Check for any build errors in Vercel logs

## Whop Integration

### 1. Update Whop Settings
- [ ] Go to Whop Developer Dashboard
- [ ] Update Base URL to your Vercel domain
- [ ] Verify all paths are still correct
- [ ] Save changes

### 2. Test in Whop
- [ ] Go to a Whop community
- [ ] Add your app from Tools section
- [ ] Open the app in Whop
- [ ] Verify authentication works
- [ ] Test all features in Whop environment
- [ ] Check that user data persists

### 3. Community Setup
- [ ] Add app to your Whop community
- [ ] Configure app settings
- [ ] Test with different user roles
- [ ] Verify access control works

## Optional Enhancements

### Music Files
- [ ] Create `public/music/` directory
- [ ] Add `lofi.mp3`
- [ ] Add `binaural.mp3`
- [ ] Add `nature.mp3`
- [ ] Update `MusicPlayer.tsx` to load files
- [ ] Test audio playback
- [ ] Verify file sizes are optimized

### Analytics (Optional)
- [ ] Add Vercel Analytics
- [ ] Add Google Analytics
- [ ] Set up error tracking (Sentry)
- [ ] Configure monitoring

### Performance
- [ ] Run Lighthouse audit
- [ ] Optimize images (if any added)
- [ ] Check bundle size
- [ ] Enable caching headers
- [ ] Test loading speed

## Launch

### 1. Soft Launch
- [ ] Test with small group of users
- [ ] Gather initial feedback
- [ ] Fix any critical bugs
- [ ] Monitor error logs

### 2. Public Launch
- [ ] Announce in community
- [ ] Share documentation links
- [ ] Provide support channel
- [ ] Monitor usage and performance

### 3. Post-Launch
- [ ] Monitor Vercel analytics
- [ ] Check Supabase usage
- [ ] Respond to user feedback
- [ ] Plan next features (see ROADMAP.md)

## Troubleshooting

### Common Issues
- **App not loading in Whop**: Check Base URL and paths
- **Authentication errors**: Verify Whop API key and App ID
- **Stats not saving**: Check Supabase connection and schema
- **Music not playing**: Verify audio file paths
- **Build errors**: Check TypeScript errors and dependencies

### Support Resources
- [Whop Documentation](https://docs.whop.com/apps)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

## Final Checks Before Going Live

- [ ] All features tested and working
- [ ] No console errors in production
- [ ] Environment variables secured
- [ ] Documentation up to date
- [ ] Support channels ready
- [ ] Monitoring in place
- [ ] Backup plan ready

**Ready to launch? Let's go! 🚀**

---

Last updated: October 2025
