import React, { useState } from 'react';
import { Leaf, Eye, EyeOff, AlertCircle, Loader, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await signup({ name, email, password });
    if (success) {
      // redirect based on role logic if needed
      navigate('/farmer-dashboard');
    } else {
      setError('Signup failed. Email may already exist.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-emerald-200">
      
      {/* Navbar / Back */}
      <div className="w-full bg-white/90 backdrop-blur-md shadow-md p-4 flex items-center max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-green-600 font-medium hover:underline">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
        <div className="flex items-center ml-auto space-x-2">
          <Leaf className="w-6 h-6 text-green-600" />
          <span className="font-bold text-xl">HerbTrace</span>
        </div>
      </div>

      {/* Signup Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-lg"
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-lg"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-lg pr-12"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all text-lg font-semibold flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Signing Up...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} className="text-green-600 font-medium cursor-pointer hover:underline">
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
