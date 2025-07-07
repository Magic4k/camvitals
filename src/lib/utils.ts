import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const API_BASE_URL = 'https://camvitals.azurewebsites.net';

interface LoginResponse {
  status: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clearAllCookies() {
  // Get all cookies and clear them
  const cookies = document.cookie.split(";")
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf("=")
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
  }
}

export function clearLocalStorage() {
  try {
    localStorage.clear()
  } catch (e) {
    console.error("Error clearing localStorage:", e)
  }
}

export function clearSessionStorage() {
  try {
    sessionStorage.clear()
  } catch (e) {
    console.error("Error clearing sessionStorage:", e)
  }
}

export async function handleSignOut() {
  // Clear all storage mechanisms
  clearAllCookies()
  clearLocalStorage()
  clearSessionStorage()
  
  // You would typically also call your backend to invalidate the session
  try {
    // Example API call to backend (implement this based on your backend)
    // await fetch('/api/auth/signout', { method: 'POST' })
    
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Redirect to login page
    window.location.href = '/login'
  } catch (error) {
    console.error('Error during sign out:', error)
    // Still redirect even if the API call fails
    window.location.href = '/login'
  }
}

// Test function to check API connectivity
export async function testAPIConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('API Connection Test Failed:', error);
    return false;
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    console.log('Attempting login via local API proxy:', { 
      email, 
      url: '/api/auth/login',
      timestamp: new Date().toISOString()
    });
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    // Use local API route to avoid CORS issues
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim()
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('Local API Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    });

    // Parse response body
    let responseData;
    try {
      responseData = await response.json();
      console.log('Local API Response data:', responseData);
      console.log('Response validation checks:', {
        responseOk: response.ok,
        hasResponseData: !!responseData,
        hasStatus: 'status' in responseData,
        statusValue: responseData.status,
        hasSuccess: 'success' in responseData,
        successValue: responseData.success,
        hasData: !!responseData.data,
        hasUser: !!(responseData.data && responseData.data.user),
        hasToken: !!(responseData.data && responseData.data.token)
      });
    } catch (parseError) {
      console.error('Failed to parse response JSON:', parseError);
      const responseText = await response.text().catch(() => 'Could not read response text');
      console.log('Response text:', responseText);
      throw new Error('Invalid credentials');
    }

    // Check if response indicates success
    const isSuccess = responseData.status === 'success' || responseData.success === true;
    console.log('Success check result:', {
      isSuccess,
      responseOk: response.ok,
      statusCheck: responseData.status === 'success',
      successCheck: responseData.success === true
    });

    if (!response.ok || !responseData || !isSuccess) {
      console.log('Login failed - API response validation failed:', { 
        status: response.status, 
        ok: response.ok, 
        data: responseData,
        isSuccess
      });
      throw new Error('Invalid credentials');
    }

    // Validate response structure - handle both possible response formats
    const hasValidStructure = responseData.data && responseData.data.user && responseData.data.token;
    console.log('Structure validation:', {
      hasData: !!responseData.data,
      hasUser: !!(responseData.data && responseData.data.user),
      hasToken: !!(responseData.data && responseData.data.token),
      hasValidStructure
    });

    if (!hasValidStructure) {
      console.error('Invalid response structure - missing required fields:', {
        responseData,
        dataExists: !!responseData.data,
        userExists: !!(responseData.data && responseData.data.user),
        tokenExists: !!(responseData.data && responseData.data.token)
      });
      throw new Error('Invalid credentials');
    }

    // Store token for future API calls (including chatbot)
    if (typeof window !== 'undefined') {
      localStorage.setItem('camvitals_token', responseData.data.token);
      localStorage.setItem('camvitals_user', JSON.stringify(responseData.data.user));
      
      // Also store for easy access by chatbot and other components
      localStorage.setItem('auth_token', responseData.data.token);
      localStorage.setItem('user_data', JSON.stringify(responseData.data.user));
      
      console.log('Token stored successfully for API usage:', {
        tokenStored: true,
        tokenLength: responseData.data.token.length,
        storageKeys: ['camvitals_token', 'auth_token', 'camvitals_user', 'user_data']
      });
    }

    console.log('Login successful:', {
      userId: responseData.data.user.id,
      userName: responseData.data.user.name,
      userRole: responseData.data.user.role,
      tokenLength: responseData.data.token.length,
      tokenStored: true
    });

    return responseData;

  } catch (error) {
    console.error('Login API Error Details:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log('Request timed out after 15 seconds');
        throw new Error('Invalid credentials');
      }
      
      if (error.message.includes('Failed to fetch')) {
        console.log('Network error detected - unable to reach local API proxy');
        console.log('This might indicate:');
        console.log('1. Local development server issues');
        console.log('2. API route not properly configured');
        console.log('3. Backend CamVitals API is not accessible');
        
        throw new Error('Invalid credentials');
      }
    }
    
    // Always show "Invalid credentials" to user for security
    throw new Error('Invalid credentials');
  }
}

// Authentication helper functions
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try multiple possible token storage keys in order of preference
  const tokenKeys = ['camvitals_token', 'auth_token', 'token', 'authToken', 'jwt', 'accessToken'];
  
  for (const key of tokenKeys) {
    const token = localStorage.getItem(key);
    if (token) {
      console.log(`Found token in localStorage key: ${key}`);
      return token;
    }
  }
  
  console.log('No token found in localStorage');
  return null;
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try multiple possible user storage keys in order of preference
    const userKeys = ['camvitals_user', 'user_data', 'user'];
    
    for (const key of userKeys) {
      const userData = localStorage.getItem(key);
      if (userData) {
        console.log(`Found user data in localStorage key: ${key}`);
        return JSON.parse(userData);
      }
    }
    
    console.log('No user data found in localStorage');
    return null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    return null;
  }
}

export function isUserAuthenticated(): boolean {
  const token = getStoredToken();
  const user = getStoredUser();
  
  const isAuthenticated = !!(token && user);
  console.log('Authentication check:', {
    hasToken: !!token,
    hasUser: !!user,
    isAuthenticated
  });
  
  return isAuthenticated;
}

// Helper function to make authenticated API calls
export async function makeAuthenticatedRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
}

// Helper function to refresh token if needed
export async function refreshTokenIfNeeded(): Promise<boolean> {
  try {
    const response = await makeAuthenticatedRequest('/api/v1/auth/verify');
    return response.ok;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

// Specific helper for chatbot API calls
export async function makeChatbotAPIRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getStoredToken();
  const user = getStoredUser();
  
  if (!token) {
    throw new Error('Authentication required for chatbot API');
  }

  console.log('Making chatbot API request:', {
    endpoint,
    method: options.method || 'GET',
    hasToken: !!token,
    hasUser: !!user,
    userId: user?.id,
    timestamp: new Date().toISOString()
  });

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

    console.log('Chatbot API Response:', {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Chatbot API Error ${response.status}:`, errorText);
      throw new Error(`Chatbot API request failed: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Chatbot API response data:', responseData);

    return responseData;
  } catch (error) {
    console.error('Chatbot API request error:', {
      endpoint,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Helper to send chatbot messages with authentication
export async function sendChatbotMessage(message: string, context?: any): Promise<any> {
  console.log('Sending chatbot message:', { message, context });
  
  const requestBody = {
    message: message.trim(),
    ...(context && { context }),
    timestamp: new Date().toISOString()
  };
  
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('Authentication required for chatbot');
  }
  
  try {
    // First try the local API proxy route to avoid CORS issues
    console.log('Trying local chatbot API proxy...');
    
    const response = await fetch('/api/chatbot/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('Local chatbot API proxy response:', {
      status: response.status,
      ok: response.ok
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Local chatbot API proxy success:', data);
      return data;
    } else {
      console.log('Local chatbot API proxy failed, trying direct API...');
      // Fall back to direct API call
      return makeChatbotAPIRequest('/api/v1/chatbot/message', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
    }
    
  } catch (error) {
    console.error('Error with local chatbot API proxy, trying direct API:', error);
    
    // Fall back to direct API call
    try {
      return makeChatbotAPIRequest('/api/v1/chatbot/message', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
    } catch (directError) {
      console.error('Direct chatbot API also failed:', directError);
      throw directError;
    }
  }
}

// Helper to get chatbot conversation history
export async function getChatbotHistory(limit: number = 50): Promise<any> {
  const endpoint = `/api/v1/chatbot/history?limit=${limit}`;
  return makeChatbotAPIRequest(endpoint, {
    method: 'GET',
  });
}

// Helper to clear authentication data
export function clearAuthenticationData(): void {
  if (typeof window === 'undefined') return;
  
  const keysToRemove = [
    'camvitals_token',
    'camvitals_user', 
    'auth_token',
    'user_data',
    'token',
    'user'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('Authentication data cleared');
}
