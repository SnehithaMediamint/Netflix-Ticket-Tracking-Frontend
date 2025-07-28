import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Verify this path is correct

function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to easily get URL query parameters
  const { login } = useAuth(); // Get the login function from your AuthContext

  useEffect(() => {
    // Extract parameters from the URL's query string
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const name = searchParams.get('name');
    const authError = searchParams.get('error'); // Check for potential error parameter

    if (authError) {
      // If an 'error' parameter is present, something went wrong on the backend
      console.error('Google callback error:', decodeURIComponent(authError));
      navigate(`/login?error=${encodeURIComponent('Authentication failed: ' + decodeURIComponent(authError))}`, { replace: true });
      return; // Stop further execution
    }

    if (token && role && name) {
      // All required data (token, role, name) is present in the URL
      try {
        // Log the user in using your AuthContext's login function
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('name', name);
       
// You can verify this in your browser's Developer Tools (Application tab -> Local Storage)
// To access in the console, you can type:
console.log(localStorage.getItem('name'));
console.log(localStorage.getItem('role'));
console.log(localStorage.getItem('token'));

        login({ token, role: parseInt(role), name }); // Ensure role is parsed as an integer
        console.log("Login successful! Redirecting to tickets page.");
        // Redirect to the tickets page, replacing the current history entry
        navigate('/tickets', { replace: true }); 
      } catch (err) {
        console.error("Error setting user in context after callback:", err);
        navigate(`/login?error=${encodeURIComponent('Failed to process login data.')}`, { replace: true });
      }
    } else {
      // If essential parameters (token, role, name) are missing, something went wrong
      console.error('Google callback: Missing token or user data in URL parameters.', err);
      navigate(`/login?error=${encodeURIComponent('Missing login information after Google authentication.')}`, { replace: true });
    }
  }, [searchParams, navigate, login]); // Re-run effect if these dependencies change

  return (
    <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        backgroundColor: '#0b0f1a', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        color: 'white' 
    }}>
      <h1 style={{ marginBottom: '10px' }}>Processing Google Login...</h1>
      <p>Please wait while we verify your details.</p>
      {/* You can add a loading spinner or more elaborate loading indicator here */}
    </div>
  );
}

export default GoogleCallback;