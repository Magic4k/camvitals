"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/lib/context/user-context';
import { requestPermissions } from "@/lib/utils/permissions";
import { PermissionStatus } from '@/components/ui/permission-status';
import {
  Activity,
  BarChart2,
  Bell,
  Brain,
  ChevronLeft,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Monitor,
  Settings,
  User,
  Menu,
  Loader2,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
}

const navigation: NavItem[] = [
  { name: 'Overview', href: '/employee/dashboard', icon: LayoutDashboard },
  { name: 'Health Metrics', href: '/employee/dashboard/metrics', icon: Activity },
  { name: 'AI Assistant', href: '/employee/dashboard/ai', icon: Brain },
  { name: 'Analytics', href: '/employee/dashboard/analytics', icon: BarChart2 },
  { name: 'Messages', href: '/employee/dashboard/messages', icon: MessageSquare, badge: 3 },
  { name: 'Real Time Monitoring', href: '/vitals', icon: Monitor },
];

const secondaryNavigation: NavItem[] = [
  { name: 'Settings', href: '/employee/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, userEmail, isAuthenticated, isLoading, logout } = useUser();
  const [permissionStatus, setPermissionStatus] = useState({
    loading: false,
    done: false
  });

  useEffect(() => {
    // Prevent scroll restoration and smooth scrolling
    if (typeof window !== 'undefined') {
      // Disable smooth scrolling
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      
      // Restore body overflow in case it was hidden during login
      document.body.style.overflow = 'auto';
      
      // Prevent scroll restoration
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      
      // Scroll to top immediately without animation
      window.scrollTo(0, 0);
    }

    // Wait for authentication check to complete
    if (isLoading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Request permissions on mount if user is authenticated
    if (user) {
      const requestUserPermissions = async () => {
        setPermissionStatus({ loading: true, done: false });
        
        try {
          const result = await requestPermissions(user.name);
          setPermissionStatus({ loading: false, done: true });
        } catch (error) {
          console.error('Permission request failed:', error);
          setPermissionStatus({ loading: false, done: false });
        }
      };

      requestUserPermissions();
    }
  }, [isAuthenticated, isLoading, user, router]);

  const onSignOut = async () => {
    setIsSigningOut(true);
    try {
      // Clear user session
      logout();
      // Navigate to login
      router.push("/login");
    } catch (error) {
      console.error('Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <PermissionStatus 
        isLoading={permissionStatus.loading}
        isDone={permissionStatus.done}
        onDone={() => setPermissionStatus({ loading: false, done: false })}
      />

      {/* Top Navigation Bar */}
      <div className="fixed top-0 z-40 w-full bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75 border-b border-gray-800">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="CamVitals"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-semibold text-white">CamVitals</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-white">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-white">
                3
              </span>
            </button>
            <div className="h-8 w-[1px] bg-gray-800" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">{user?.name || 'User'}</span>
                <span className="text-xs text-gray-400">{user?.role || 'Employee'}</span>
              </div>
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-900 bg-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 z-30 h-full transform bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col pt-20">
          <div className="flex-1 overflow-y-auto px-3 py-4">
            {/* Health Status Card */}
            <div className="mb-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-primary/20 p-2.5">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Health Status</h3>
                  <p className="text-xs text-gray-400">Today&apos;s Overview</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Heart Rate</span>
                  <span className="text-sm font-medium text-white">72 BPM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Stress Level</span>
                  <span className="text-sm font-medium text-green-500">Low</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Focus Score</span>
                  <span className="text-sm font-medium text-white">85%</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="my-4 h-[1px] bg-gray-800" />

            {/* Secondary Navigation */}
            <nav className="space-y-1">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Section */}
          <div className="border-t border-gray-800 p-4">
            <button 
              onClick={onSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`min-h-screen pt-16 transition-all duration-300 ${
          sidebarOpen ? 'pl-64' : 'pl-0'
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
} 