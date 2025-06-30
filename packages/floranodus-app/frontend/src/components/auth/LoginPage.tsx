import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError(null);

    try {
      if (credentialResponse.credential) {
        // Send token to your backend or handle locally
        await authService.handleGoogleCallback(credentialResponse.credential);
        
        // Redirect to canvas
        navigate('/canvas');
      } else {
        throw new Error('No credential received from Google');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-floranodus-bg-primary flex items-center justify-center">
      <div className="bg-floranodus-bg-secondary border border-floranodus-border rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-floranodus-text-primary mb-2">
            Welcome to Floranodus
          </h1>
          <p className="text-floranodus-text-secondary">
            AI-Native Creative Canvas
          </p>
        </div>

        {error && (
          <div className="bg-floranodus-error/10 border border-floranodus-error rounded p-3 mb-4">
            <p className="text-floranodus-error text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            size="large"
            width="100%"
          />

          {isLoading && (
            <div className="text-center">
              <p className="text-floranodus-text-secondary text-sm">
                Signing you in...
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-floranodus-text-secondary text-xs">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 