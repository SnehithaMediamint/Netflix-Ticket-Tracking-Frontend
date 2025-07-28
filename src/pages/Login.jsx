import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Path must be correct

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation(); // To access URL parameters like error messages
    const { user } = useAuth(); // Get the 'user' state from AuthContext

    const [error, setError] = useState(null);

    // This useEffect handles potential error messages passed via URL from the backend or callback
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const authError = queryParams.get('error'); // Check for potential error parameter

        // Handle potential error messages passed from the GoogleCallback.jsx or backend
        if (authError) {
            setError(decodeURIComponent(authError));
            // Optionally clean up the URL to remove the error parameter after displaying it
            // navigate(location.pathname, { replace: true });
        } else {
            setError(null); // Clear any previous errors if no error param is present
        }

        // If the user is already logged in (checked via AuthContext), redirect them away from the login page
        if (user && user.token) {
            console.log("api is hitted")
            navigate('/tickets', { replace: true }); // Redirect to tickets page
        }
    }, [location.search, navigate, user]); // Re-run effect if these dependencies change

    const handleGoogleLogin = () => {
        setError(null); // Clear previous errors before initiating a new login attempt
        // This is the CRITICAL step: Redirect the user's browser to your backend's
        // Google authentication initiation endpoint.
        window.location.href = 'http://localhost:5000/api/google/login'; // MAKE SURE THIS MATCHES YOUR BACKEND ROUTE
    };
return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 font-sans">
            <div className="hidden md:flex col-span-4 flex-col justify-center items-start px-10 bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
                <h2 className="text-4xl font-light mb-2">Welcome to</h2>
                <h1 className="text-5xl font-extrabold text-[#51cbce] mb-4 leading-tight">Netflix<br />Ticket Tracker</h1>
                <p className="text-lg text-white/80 max-w-sm">Efficiently track and manage your Netflix tickets in one place.</p>
            </div>
            <div className="col-span-12 md:col-span-8 flex items-center justify-center bg-[#0b0f1a]">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-8 md:p-12 w-full max-w-md mx-6 text-center">
                    <h2 className="text-3xl font-semibold text-white mb-2">Login</h2>
                    <p className="text-sm text-gray-400 mb-6">Sign in to your account to continue</p>
                    {error && (
                        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
                            <strong className="font-bold">Authentication Failed! </strong>
                            <span className="block sm:inline">
                                {error === 'unauthorized' ? 'You are not authorized to access this application.' : 'Please try again.'}
                            </span>
                        </div>
                    )}
                    <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-3 w-full bg-white text-gray-800 font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 hover:scale-105">
                        <svg className="w-6 h-6" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6.02C43.97 37.63 46.98 31.45 46.98 24.55z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6.02c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
