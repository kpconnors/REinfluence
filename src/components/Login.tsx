import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FormField } from './FormField';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

interface LoginData {
  email: string;
  password: string;
}

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function Login() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<LoginData>>({});
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  // Sign out any existing user when the login page is accessed
  useEffect(() => {
    const signOutExistingUser = async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };
    signOutExistingUser();
  }, [logout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof LoginData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setError(''); // Clear general error when user types
  };

  const validateForm = () => {
    const newErrors: Partial<LoginData> = {};
    
    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setError('');
      setLoading(true);
      await login(loginData.email, loginData.password);
      // Redirect to the page they tried to visit or dashboard
      navigate(locationState?.from?.pathname || '/');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1d4e74] flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-white mb-8">REinfluence</h1>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold text-[#1d4e74] mb-6 text-center">Log in</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Email address" error={errors.email} required>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent`}
              placeholder="Enter your email"
            />
          </FormField>

          <FormField label="Password" error={errors.password} required>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent`}
              placeholder="Enter your password"
            />
          </FormField>

          <div className="flex items-center justify-between mt-4">
            <Link to="/forgot-password" className="text-sm text-[#1d4e74] hover:text-[#163a57]">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1d4e74] text-white py-2 px-4 rounded-md hover:bg-[#163a57] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4e74] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#1d4e74] hover:text-[#163a57] font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}