import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import { register, clearAuthError } from '../../features/auth/authSlice';
import Input from '../Common/Input';
import Button from '../Common/Button';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Optional: Add confirm password
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState(''); // Form-specific errors

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error: authError } = useSelector((state) => state.auth);

   useEffect(() => {
     // Redirect if already logged in
     if (userInfo) {
       navigate('/');
     }
     // Clear errors when component mounts or unmounts
     return () => {
        dispatch(clearAuthError());
     }
   }, [navigate, userInfo, dispatch]);

   // Update form error when authError changes
   useEffect(() => {
        setFormError(authError || '');
   }, [authError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(''); // Clear previous form error
    dispatch(clearAuthError()); // Clear redux error

    // Optional: Add confirm password check
    // if (password !== confirmPassword) {
    //     setFormError('Passwords do not match');
    //     return;
    // }
     if (!email || !password) {
         setFormError('Please fill in all fields.');
         return;
     }
    // Optional: Add password strength check here if desired

    if (!loading) {
      dispatch(register({ email, password }));
      // Navigation is handled by the useEffect watching userInfo
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-md rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {formError && <p className="text-center text-sm text-red-600 bg-red-100 p-2 rounded">{formError}</p>}
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
              className="rounded-t-md"
              disabled={loading}
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              label="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-b-md" // Adjust if adding confirm password
              disabled={loading}
            />
             {/* Optional: Confirm Password Input */}
             {/* <Input
               id="confirm-password"
               name="confirmPassword"
               type="password"
               autoComplete="new-password"
               required
               label="Confirm Password"
               placeholder="Confirm Password"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               className="rounded-b-md"
               disabled={loading}
             /> */}
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;