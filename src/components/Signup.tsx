import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormField } from './FormField';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export default function Signup() {
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const [errors, setErrors] = useState<Partial<SignupData>>({});
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { signup, logout } = useAuth();
  const navigate = useNavigate();

  // Sign out any existing user when the signup page is accessed
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
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof SignupData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setError('');
  };

  const validateForm = () => {
    const newErrors: Partial<SignupData> = {};
    
    if (!signupData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!signupData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      
      // Create the user account
      const userCredential = await signup(signupData.email, signupData.password, signupData.fullName);
      
      if (!userCredential.user) {
        throw new Error('Failed to create user account');
      }

      // Redirect to profile setup
      navigate('/profile-setup');
    } catch (err: any) {
      console.error('Signup error:', err);
      let errorMessage = 'Failed to create an account. Please try again.';
      
      // Handle specific Firebase auth errors
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or login.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check and try again.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1d4e74] flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-white mb-8">REinfluence</h1>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold text-[#1d4e74] mb-6 text-center">Sign up</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Full name" error={errors.fullName} required>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={signupData.fullName}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent`}
              placeholder="Enter your full name"
            />
          </FormField>

          <FormField label="Email address" error={errors.email} required>
            <input
              type="email"
              id="email"
              name="email"
              value={signupData.email}
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
              value={signupData.password}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent`}
              placeholder="Enter your password"
            />
          </FormField>

          <FormField label="Confirm password" error={errors.confirmPassword} required>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent`}
              placeholder="Confirm your password"
            />
          </FormField>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1d4e74] text-white py-2 px-4 rounded-md hover:bg-[#163a57] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4e74] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1d4e74] hover:text-[#163a57] font-medium">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}