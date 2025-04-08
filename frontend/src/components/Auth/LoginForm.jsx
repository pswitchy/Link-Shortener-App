import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import { login, clearAuthError } from '../../features/auth/authSlice'; // Import clearAuthError
import Input from '../Common/Input'; // Assuming Input component exists
import Button from '../Common/Button'; // Assuming Button component exists
import Spinner from '../Common/Spinner'; // Assuming Spinner component exists

const LoginForm = () => {
    // State for form inputs
    const [email, setEmail] = useState('intern@dacoid.com'); // Pre-fill for convenience during development
    const [password, setPassword] = useState('Test123'); // Pre-fill for convenience during development

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Select auth state from Redux
    const { userInfo, loading, error: authError } = useSelector((state) => state.auth);

    // Effect to redirect if user is already logged in
    useEffect(() => {
        if (userInfo) {
            navigate('/'); // Redirect to dashboard or home page
        }
    }, [navigate, userInfo]);

    // Effect to clear auth error when component unmounts
     useEffect(() => {
         // Optional: Clear error when component mounts too?
         // dispatch(clearAuthError());
         return () => {
            dispatch(clearAuthError()); // Clear error on unmount
         }
     }, [dispatch]);

    // Handler for form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Don't submit if already loading
        if (!loading) {
             // Dispatch the login async thunk
             dispatch(login({ email, password }));
             // Navigation on success is handled by the useEffect watching userInfo
             // Error display is handled by the component rendering authError
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-md rounded-lg">
                {/* Header */}
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    {/* Link to Register Page */}
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            create a new account
                        </Link>
                    </p>
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Display Authentication Error */}
                    {authError && (
                        <p className="text-center text-sm text-red-600 bg-red-100 p-2 rounded border border-red-200">
                            {authError}
                        </p>
                    )}

                    {/* Input Fields */}
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
                            className="rounded-t-md" // Style adjustments for grouped inputs
                            disabled={loading}
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
                            className="rounded-b-md" // Style adjustments for grouped inputs
                            disabled={loading}
                        />
                    </div>

                    {/* Optional: Display hardcoded test credentials during development */}
                    {/* <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded border border-gray-200">
                        <p className="font-medium">For Testing:</p>
                        <p>Email: <code>intern@dacoid.com</code></p>
                        <p>Password: <code>Test123</code></p>
                        <p className="mt-1">Or <Link to="/register" className="text-indigo-600 hover:underline">register</Link> a new user.</p>
                    </div> */}

                    {/* Submit Button */}
                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full" // Make button full width
                            isLoading={loading} // Show loading state
                            disabled={loading} // Disable when loading
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