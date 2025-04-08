import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import { register, clearAuthError } from '../../features/auth/authSlice'; // Import register action and error clearer
import Input from '../Common/Input'; // Assuming Input component exists
import Button from '../Common/Button'; // Assuming Button component exists

const RegisterForm = () => {
    // State for form inputs
    const [username, setUsername] = useState(''); // <-- Added username state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Optional: Add confirm password state if needed
    // const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState(''); // Form-specific validation errors

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Select auth state from Redux
    const { userInfo, loading, error: authError } = useSelector((state) => state.auth);

    // Effect to redirect if user logs in/registers successfully
    useEffect(() => {
        if (userInfo) {
            navigate('/'); // Redirect to dashboard on successful registration/login
        }
    }, [navigate, userInfo]);

    // Effect to clear Redux auth error state on mount/unmount
     useEffect(() => {
         // Clear previous errors when component mounts
         dispatch(clearAuthError());
         return () => {
            // Clear error when component unmounts
            dispatch(clearAuthError());
         }
     }, [dispatch]);

    // Effect to update the local form error display when the Redux authError changes
    useEffect(() => {
         setFormError(authError || '');
    }, [authError]);

    // Handler for form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(''); // Clear previous form error
        dispatch(clearAuthError()); // Clear previous Redux auth error

        // Form validation
        if (!username || !email || !password) { // <-- Added username check
            setFormError('Please fill in all fields.');
            return;
        }

        // Optional: Add confirm password check
        // if (password !== confirmPassword) {
        //     setFormError('Passwords do not match');
        //     return;
        // }
        // Optional: Add password strength check here if desired

        // Dispatch the register action if not already loading
        if (!loading) {
            dispatch(register({ username, email, password })); // <-- Pass username to register action
            // Navigation on success is handled by the useEffect watching userInfo
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-md rounded-lg">
                {/* Header */}
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    {/* Link to Login Page */}
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Registration Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Display Form or Authentication Error */}
                    {formError && (
                        <p className="text-center text-sm text-red-600 bg-red-100 p-2 rounded border border-red-200">
                            {formError}
                        </p>
                    )}

                    {/* Input Fields Group */}
                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* Username Input */}
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            label="Username"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="rounded-t-md" // First input gets rounded top
                            disabled={loading}
                        />
                        {/* Email Input */}
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
                            // No rounding needed for middle inputs if grouped
                            disabled={loading}
                        />
                        {/* Password Input */}
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password" // Use "new-password" for registration
                            required
                            label="Password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-b-md" // Last input gets rounded bottom
                            disabled={loading}
                        />
                        {/* Optional: Confirm Password Input Here */}

                    </div>

                    {/* Submit Button */}
                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full" // Make button full width
                            isLoading={loading} // Show loading state
                            disabled={loading} // Disable when loading
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