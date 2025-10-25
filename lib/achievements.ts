export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'sessions' | 'hours' | 'streak' | 'special';
  unlocked: boolean;
  unlockedAt?: string;
}

export const achievements: Achievement[] = [
  {
    id: 'first_session',
    title: 'First Steps',
    description: 'Complete your first focus session',
    icon: '🎯',
    requirement: 1,
    type: 'sessions',
    unlocked: false,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a session before 8 AM',
    icon: '🌅',
    requirement: 1,
    type: 'special',
    unlocked: false,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a session after 10 PM',
    icon: '🦉',
    requirement: 1,
    type: 'special',
    unlocked: false,
  },
  {
    id: 'ten_sessions',
    title: 'Getting Started',
    description: 'Complete 10 focus sessions',
    icon: '⭐',
    requirement: 10,
    type: 'sessions',
    unlocked: false,
  },
  {
    id: 'fifty_sessions',
    title: 'Focused Mind',
    description: 'Complete 50 focus sessions',
    icon: '🌟',
    requirement: 50,
    type: 'sessions',
    unlocked: false,
  },
  {
    id: 'hundred_sessions',
    title: 'Focus Master',
    description: 'Complete 100 focus sessions',
    icon: '💫',
    requirement: 100,
    type: 'sessions',
    unlocked: false,
  },
  {
    id: 'ten_hours',
    title: 'Time Invested',
    description: 'Accumulate 10 hours of focus time',
    icon: '⏰',
    requirement: 10,
    type: 'hours',
    unlocked: false,
  },
  {
    id: 'fifty_hours',
    title: 'Dedicated',
    description: 'Accumulate 50 hours of focus time',
    icon: '🎓',
    requirement: 50,
    type: 'hours',
    unlocked: false,
  },
  {
    id: 'hundred_hours',
    title: 'Expert',
    description: 'Accumulate 100 hours of focus time',
    icon: '🏆',
    requirement: 100,
    type: 'hours',
    unlocked: false,
  },
  {
    id: 'three_day_streak',
    title: 'Building Habits',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    requirement: 3,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '💪',
    requirement: 7,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'two_week_streak',
    title: 'Consistency King',
    description: 'Maintain a 14-day streak',
    icon: '👑',
    requirement: 14,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'month_streak',
    title: 'Unstoppable',
    description: 'Maintain a 30-day streak',
    icon: '🚀',
    requirement: 30,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'deep_work_master',
    title: 'Deep Work Master',
    description: 'Complete 10 Deep Work sessions',
    icon: '⚡',
    requirement: 10,
    type: 'special',
    unlocked: false,
  },
  {
    id: 'pomodoro_pro',
    title: 'Pomodoro Pro',
    description: 'Complete 25 Pomodoro sessions',
    icon: '🍅',
    requirement: 25,
    type: 'special',
    unlocked: false,
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Complete sessions on both Saturday and Sunday',
    icon: '🎖️',
    requirement: 1,
    type: 'special',
    unlocked: false,
  },
];

export function checkAchievements(
  stats: {
    totalSessions: number;
    totalFocusTime: number;
    streakDays: number;
  },
  sessionData?: {
    mode?: string;
    completedAt?: Date;
    pomodoroCount?: number;
    deepWorkCount?: number;
    weekendSessions?: { saturday: boolean; sunday: boolean };
  }
): Achievement[] {
  const unlocked: Achievement[] = [];

  achievements.forEach(achievement => {
    if (achievement.unlocked) return;

    let shouldUnlock = false;

    switch (achievement.type) {
      case 'sessions':
        shouldUnlock = stats.totalSessions >= achievement.requirement;
        break;
      case 'hours':
        const hours = stats.totalFocusTime / 3600;
        shouldUnlock = hours >= achievement.requirement;
        break;
      case 'streak':
        shouldUnlock = stats.streakDays >= achievement.requirement;
        break;
      case 'special':
        // Handle special achievements
        if (sessionData) {
          switch (achievement.id) {
            case 'early_bird':
              if (sessionData.completedAt) {
                const hour = sessionData.completedAt.getHours();
                shouldUnlock = hour < 8;
              }
              break;
            case 'night_owl':
              if (sessionData.completedAt) {
                const hour = sessionData.completedAt.getHours();
                shouldUnlock = hour >= 22;
              }
              break;
            case 'deep_work_master':
              shouldUnlock = (sessionData.deepWorkCount || 0) >= achievement.requirement;
              break;
            case 'pomodoro_pro':
              shouldUnlock = (sessionData.pomodoroCount || 0) >= achievement.requirement;
              break;
            case 'weekend_warrior':
              shouldUnlock = sessionData.weekendSessions?.saturday && sessionData.weekendSessions?.sunday || false;
              break;
          }
        }
        break;
    }

    if (shouldUnlock) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      unlocked.push(achievement);
    }
  });

  return unlocked;
}

export const motivationalQuotes = [
  // Focus & Productivity
  "Focus is the gateway to thinking clearly.",
  "The secret of change is to focus all your energy on building the new.",
  "Concentrate all your thoughts upon the work in hand.",
  "Where focus goes, energy flows.",
  "The successful warrior is the average person with laser-like focus.",
  "Stay focused, go after your dreams and keep moving toward your goals.",
  "Focus on being productive instead of busy.",
  "Your focus determines your reality.",
  "The key to success is to focus on goals, not obstacles.",
  "Lack of direction, not lack of time, is the problem.",
  "Deep work is the superpower of the 21st century.",
  "The ability to concentrate is a gift.",
  "Focus is a matter of deciding what not to do.",
  "Starve your distractions, feed your focus.",
  "You can't depend on your eyes when your imagination is out of focus.",
  
  // Steve Jobs
  "Focus is about saying no to the hundred other good ideas.",
  "I'm convinced that about half of what separates successful entrepreneurs from non-successful ones is pure perseverance.",
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
  "Innovation distinguishes between a leader and a follower.",
  "The people who are crazy enough to think they can change the world are the ones who do.",
  "Quality is more important than quantity. One home run is much better than two doubles.",
  "Simple can be harder than complex. You have to work hard to get your thinking clean to make it simple.",
  "Don't let the noise of others' opinions drown out your own inner voice.",
  
  // Elon Musk
  "When something is important enough, you do it even if the odds are not in your favor.",
  "I think it's possible for ordinary people to choose to be extraordinary.",
  "Persistence is very important. You should not give up unless you are forced to give up.",
  "If you get up in the morning and think the future is going to be better, it is a bright day.",
  "Work like hell. I mean you just have to put in 80 to 100 hour weeks every week.",
  
  // Bill Gates
  "Success is a lousy teacher. It seduces smart people into thinking they can't lose.",
  "It's fine to celebrate success, but it is more important to heed the lessons of failure.",
  "Your most unhappy customers are your greatest source of learning.",
  "We always overestimate the change that will occur in the next two years and underestimate the change that will occur in the next ten.",
  
  // Warren Buffett
  "The difference between successful people and really successful people is that really successful people say no to almost everything.",
  "Someone's sitting in the shade today because someone planted a tree a long time ago.",
  "The most important investment you can make is in yourself.",
  "Risk comes from not knowing what you're doing.",
  "Price is what you pay. Value is what you get.",
  
  // Jeff Bezos
  "If you double the number of experiments you do per year, you're going to double your inventiveness.",
  "We see our customers as invited guests to a party, and we are the hosts.",
  "I knew that if I failed I wouldn't regret that, but I knew the one thing I might regret is not trying.",
  "Life's too short to hang out with people who aren't resourceful.",
  
  // Mark Zuckerberg
  "The biggest risk is not taking any risk. In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks.",
  "Ideas don't come out fully formed. They only become clear as you work on them.",
  "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
  "The question isn't 'What do we want to know about people?', it's 'What do people want to tell about themselves?'",
  
  // Oprah Winfrey
  "The biggest adventure you can take is to live the life of your dreams.",
  "You become what you believe, not what you think or what you want.",
  "Turn your wounds into wisdom.",
  "The more you praise and celebrate your life, the more there is in life to celebrate.",
  
  // Richard Branson
  "If somebody offers you an amazing opportunity but you are not sure you can do it, say yes – then learn how to do it later!",
  "Business opportunities are like buses, there's always another one coming.",
  "The brave may not live forever, but the cautious do not live at all.",
  
  // Tony Robbins
  "Setting goals is the first step in turning the invisible into the visible.",
  "The only impossible journey is the one you never begin.",
  "It's not what we do once in a while that shapes our lives. It's what we do consistently.",
  "Where focus goes, energy flows.",
  
  // Gary Vaynerchuk
  "Skills are cheap. Passion is priceless.",
  "There's no reason in 2024 to do shit you hate. None.",
  "You have to understand your own personal DNA. Don't do things because I do them or Steve Jobs or Mark Cuban tried it.",
  "Document, don't create.",
  
  // Naval Ravikant
  "Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now.",
  "Play long-term games with long-term people.",
  "Reading is faster than listening. Doing is faster than watching.",
  "Clear thinker, better outcome.",
  
  // Cal Newport
  "To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction.",
  "Clarity about what matters provides clarity about what does not.",
  "The ability to perform deep work is becoming increasingly rare and therefore increasingly valuable.",
  
  // Ancient Wisdom
  "The mind is everything. What you think you become. - Buddha",
  "Well begun is half done. - Aristotle",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Quality is not an act, it is a habit. - Aristotle",
];

export function getRandomQuote(): string {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}
