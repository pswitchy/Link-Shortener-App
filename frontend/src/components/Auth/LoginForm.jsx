import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import Input from '../Common/Input';
import Button from '../Common/Button';
import Spinner from '../Common/Spinner';

const LoginForm = () => {
  const [email, setEmail] = useState('intern@dacoid.com'); // Pre-fill for convenience
  const [password, setPassword] = useState('Test123');   // Pre-fill for convenience
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if already logged in
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      dispatch(login({ email, password }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-md rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-center text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              label="Email address"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-t-md" // Adjust styling for grouped inputs
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              label="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-b-md" // Adjust styling for grouped inputs
            />
          </div>

           {/* Display hardcoded credentials for testing
           <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded border border-gray-200">
                <p><b>Test Credentials:</b></p>
                <p>Email: <code>intern@dacoid.com</code></p>
                <p>Password: <code>Test123</code></p>
           </div> */}

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;