'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useIframeSdk } from '@whop/react/iframe';
import {
  Menu,
  X,
  Home,
  Users,
  Trophy,
  TrendingUp,
  Settings,
  BarChart3,
  Crown,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  displayName: string;
  isAdmin?: boolean;
  companyId?: string;
  experienceId?: string;
}

export function Navbar({ displayName, isAdmin = false, companyId, experienceId }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Navigation items for regular users
  const userNavItems = [
    { name: 'Focus', href: `/experiences/${experienceId}`, icon: Home },
    { name: 'Community', href: `/experiences/${experienceId}#community`, icon: Users },
    { name: 'Leaderboard', href: `/experiences/${experienceId}#leaderboard`, icon: Trophy },
    { name: 'My Stats', href: `/experiences/${experienceId}#stats`, icon: TrendingUp },
  ];

  // Navigation items for admins
  const adminNavItems = [
    { name: 'Dashboard', href: `/dashboard/${companyId}`, icon: BarChart3 },
    { name: 'Community', href: `/experiences/${experienceId}#community`, icon: Users },
    { name: 'Analytics', href: `/dashboard/${companyId}/analytics`, icon: TrendingUp },
    { name: 'Settings', href: `/dashboard/${companyId}/settings`, icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const whop = useIframeSdk();

  // Helper to open Whop navigation
  const handleWhopNav = (url: string, newTab = false) => {
    if (whop && whop.openExternalUrl) {
      whop.openExternalUrl({ url, newTab });
    } else {
      window.location.href = url;
    }
  };

  // Helper to close app (if needed)
  const handleCloseApp = () => {
    if (whop && whop.closeApp) {
      whop.closeApp(null);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-a5 backdrop-blur-xl bg-gray-a3">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/experiences/${experienceId}`} className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/focustime.jpg"
                alt="FocusTime Logo"
                width={36}
                height={36}
                className="rounded-lg transition-transform group-hover:scale-105"
              />
              {isAdmin && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-12 tracking-tight">
                FocusTime
              </h1>
              {isAdmin && (
                <p className="text-[10px] text-yellow-9 font-medium">CREATOR</p>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleWhopNav(item.href)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-12 hover:text-gray-12 hover:bg-gray-a4 transition-all flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <div className="px-3 py-1.5 rounded-full bg-yellow-a3 border border-yellow-a5">
                <span className="text-xs font-semibold text-yellow-9">Creator</span>
              </div>
            )}
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-a3 border border-gray-a5 hover:bg-gray-a4 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-12">{displayName}</span>
                <ChevronDown className={`w-4 h-4 text-gray-11 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 backdrop-blur-2xl bg-gray-a3 border border-gray-a5 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <button
                      className="block w-full px-4 py-3 text-sm text-gray-12 hover:bg-gray-a4 transition-colors text-left"
                      onClick={() => {
                        setShowUserMenu(false);
                        handleWhopNav(`/experiences/${experienceId}#stats`);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-4 h-4" />
                        My Progress
                      </div>
                    </button>
                    
                    <button
                      className="block w-full px-4 py-3 text-sm text-gray-12 hover:bg-gray-a4 transition-colors text-left"
                      onClick={() => {
                        setShowUserMenu(false);
                        handleWhopNav(`/experiences/${experienceId}#achievements`);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Trophy className="w-4 h-4" />
                        Achievements
                      </div>
                    </button>

                    {isAdmin && (
                      <>
                        <div className="h-px bg-gray-a5 my-1" />
                        <button
                          className="block w-full px-4 py-3 text-sm text-yellow-9 hover:bg-gray-a4 transition-colors text-left"
                          onClick={() => {
                            setShowUserMenu(false);
                            handleWhopNav(`/dashboard/${companyId}`);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <Crown className="w-4 h-4" />
                            Creator Dashboard
                          </div>
                        </button>
                      </>
                    )}

                    <div className="h-px bg-gray-a5 my-1" />
                    
                    {/* Sign Out button removed for Whop integration */}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-a4 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-12" />
            ) : (
              <Menu className="w-6 h-6 text-gray-12" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setIsOpen(false);
                        handleWhopNav(item.href);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-12 hover:text-gray-12 hover:bg-gray-a4 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </button>
                  );
                })}

                <div className="h-px bg-gray-a5 my-2" />

                {/* Mobile User Section */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-12">{displayName}</div>
                      {isAdmin && (
                        <div className="text-xs text-yellow-9 font-medium">Creator</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleWhopNav(`/experiences/${experienceId}#stats`);
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-12 hover:bg-gray-a4 transition-colors"
                    >
                      <TrendingUp className="w-4 h-4" />
                      My Progress
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleWhopNav(`/experiences/${experienceId}#achievements`);
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-12 hover:bg-gray-a4 transition-colors"
                    >
                      <Trophy className="w-4 h-4" />
                      Achievements
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          handleWhopNav(`/dashboard/${companyId}`);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-yellow-9 hover:bg-gray-a4 transition-colors"
                      >
                        <Crown className="w-4 h-4" />
                        Creator Dashboard
                      </button>
                    )}

                    {/* Sign Out button removed for Whop integration */}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Status Bar for Active Session */}
      <div className="border-t border-gray-a5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-2">
          <div className="flex items-center justify-center gap-2 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-grass-9 animate-pulse" />
            <span className="text-gray-11">Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}