interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

class AuthService {
  private tokenKey = 'floranodus_auth_token';
  private userKey = 'floranodus_user';

  // Google OAuth login
  async loginWithGoogle(): Promise<User> {
    // Option 1: Server-side OAuth flow
    window.location.href = '/api/auth/google';
    
    // Option 2: Client-side Google Sign-In (if using @react-oauth/google)
    // This would be handled by the Google button component
    return Promise.reject('Use Google Sign-In button');
  }

  // Handle OAuth callback from your backend
  async handleGoogleCallback(token: string): Promise<User> {
    // Store the token from your backend
    this.setToken(token);
    
    // Validate and get user info
    const user = await this.validateToken();
    if (!user) {
      throw new Error('Failed to validate Google authentication');
    }
    
    return user;
  }

  async logout(): Promise<void> {
    const token = this.getToken();
    
    // Optional: Notify backend (don't block on failure)
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      }).catch(() => {});
    }
    
    this.clearAuth();
    
    // If using client-side Google Sign-In
    if ((window as any).google?.accounts) {
      (window as any).google.accounts.id.disableAutoSelect();
    }
  }

  async validateToken(): Promise<User | null> {
    const token = this.getToken();
    const cachedUser = this.getUser();
    
    if (!token) return null;
    
    // Return cached user for fast loading
    if (cachedUser) return cachedUser;

    try {
      const response = await fetch('/api/auth/validate', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        this.clearAuth();
        return null;
      }

      const user = await response.json();
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Token validation failed:', error);
      return null;
    }
  }

  // Simplified permissions for open source
  async checkCanvasPermission(canvasId: string, permission: string): Promise<boolean> {
    // For open source: all authenticated users have full access
    // You could implement read-only public canvases later
    return this.isAuthenticated();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Simplified authenticated fetch
  createAuthenticatedFetch() {
    return async (url: string, options: RequestInit = {}) => {
      const token = this.getToken();
      
      if (token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        };
      }

      const response = await fetch(url, options);

      // Simple 401 handling - just redirect to login
      if (response.status === 401) {
        this.clearAuth();
        // Don't redirect if it's a login-related endpoint
        if (!url.includes('/auth/')) {
          window.location.href = '/login';
        }
      }

      return response;
    };
  }
}

export const authService = new AuthService();

// For completely client-side auth (no backend required)
export class LocalAuthService {
  private userKey = 'floranodus_local_user';

  async loginWithGoogle(googleUser: any): Promise<User> {
    // This would come from @react-oauth/google
    const user: User = {
      id: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture
    };
    
    this.setUser(user);
    return user;
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
}

// Export the service you want to use
export default authService; 