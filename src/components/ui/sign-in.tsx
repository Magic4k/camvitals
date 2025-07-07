"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatedLines } from "./animated-lines";
import { useUser } from "@/lib/context/user-context";
import { requestPermissions } from "@/lib/utils/permissions";
import { loginUser } from "@/lib/utils";
import { Toast } from "./toast";

// Simple Navbar Component
function Navbar() {
  return (
    <nav className="fixed w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 absolute top-8 left-8">
              <Image
                src="/logo.png"
                alt="CamVitals Logo"
                width={48}
                height={48}
                className="w-auto h-10"
              />
              <span className="text-2xl font-bold text-white hover:text-primary">
                CamVitals
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export const LightLogin = () => {
  const router = useRouter();
  const { user, setUser, setUserEmail, setToken, isAuthenticated, isLoading: contextLoading } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error"
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  // Redirect if already authenticated - role-based
  useEffect(() => {
    if (!contextLoading && isAuthenticated && user) {
      const userRole = user.role.toLowerCase();
      let redirectPath = '/employee/dashboard'; // default
      
      if (userRole === 'hr') {
        redirectPath = '/hr/overview';
      } else if (userRole === 'admin') {
        redirectPath = '/admin/panel';
      }
      
      console.log('Auto-redirecting authenticated user to:', redirectPath, 'for role:', userRole);
      router.push(redirectPath);
    }
  }, [isAuthenticated, contextLoading, router, user]);

  // Show loading while context is loading
  if (contextLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-highlight to-accent bg-[length:200%_200%] animate-gradient-shift relative flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const validateFields = () => {
    const newErrors = {
      email: !email.trim(),
      password: !password.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear invalid credentials state when user starts typing
    if (invalidCredentials) {
      setInvalidCredentials(false);
    }

    if (field === 'email') {
      setEmail(value);
      if (errors.email && value.trim()) {
        setErrors(prev => ({ ...prev, email: false }));
      }
    } else if (field === 'password') {
      setPassword(value);
      if (errors.password && value.trim()) {
        setErrors(prev => ({ ...prev, password: false }));
      }
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFields()) {
      return;
    }
    
    console.log('Starting CamVitals authentication...');
    
    setIsLoading(true);
    setInvalidCredentials(false);

    try {
      const response = await loginUser(email.trim(), password.trim());
      
      console.log('Authentication successful:', {
        userId: response.data.user.id,
        userName: response.data.user.name,
        userRole: response.data.user.role
      });
      
      // Store user data in context
      setUser(response.data.user);
      setUserEmail(response.data.user.email);
      setToken(response.data.token);
      
      // Show success toast
      setToast({
        show: true,
        message: `Welcome back, ${response.data.user.name}! 👋`,
        type: "success"
      });

      // Store additional data in localStorage for role-based routing
      localStorage.setItem('userRole', response.data.user.role);
      
      // Request permissions and show welcome notification
      try {
        await requestPermissions(response.data.user.name);
      } catch (permissionError) {
        console.warn('Permission request failed:', permissionError);
        // Continue with login even if permissions fail
      }
      
      // Determine redirect path based on user role - immediate redirect
      const userRole = response.data.user.role.toLowerCase();
      let redirectPath = '/employee/dashboard'; // default
      
      if (userRole === 'hr') {
        redirectPath = '/hr/overview';
      } else if (userRole === 'admin') {
        redirectPath = '/admin/panel';
      }

      console.log('Redirecting immediately to:', redirectPath, 'for role:', userRole);

      // Prevent scrolling during redirect
      document.body.style.overflow = 'hidden';
      
      // Immediate redirect for HR users, short delay for others to show success message
      if (userRole === 'hr') {
        router.push(redirectPath);
      } else {
        // Wait for toast to be visible before redirecting for non-HR users
        setTimeout(() => {
          router.push(redirectPath);
        }, 1500);
      }

    } catch (error) {
      console.error("CamVitals authentication failed:", error);
      
      // Set invalid credentials state
      setInvalidCredentials(true);
      
      // Show error toast - always show "Invalid credentials" for security
      setToast({
        show: true,
        message: "Invalid credentials. Please check your email and password.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-highlight to-accent bg-[length:200%_200%] animate-gradient-shift relative">
      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
      
      {/* Simple Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen relative">
        <AnimatedLines />
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative mx-4">
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-blue-100 via-blue-50 to-transparent opacity-40 blur-3xl -mt-20"></div>
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
                <Image
                  src="/logo.png"
                  alt="CamVitals Logo"
                  width={48}
                  height={48}
                  className="w-12 h-auto object-contain"
                />
              </div>
              <div className="p-0">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  Welcome Back
                </h2>
                <p className="text-center text-gray-500 mt-2">
                  Sign in to continue to your account
                </p>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6 p-0">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Email or Phone
                </label>
                <input
                  className={`bg-gray-50 text-gray-900 placeholder:text-gray-400 h-12 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/50 w-full px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-2 transition-colors ${
                    errors.email || invalidCredentials
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Enter your email or phone"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">Email or phone is required</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-xs text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`bg-gray-50 text-gray-900 pr-12 h-12 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/50 w-full px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-2 transition-colors ${
                      errors.password || invalidCredentials
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">Password is required</p>
                )}
                {invalidCredentials && (
                  <p className="text-red-500 text-sm mt-1">Invalid credentials</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 hover:from-blue-700 hover:via-blue-600 hover:to-blue-500 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-100 active:scale-[0.98] inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}; 