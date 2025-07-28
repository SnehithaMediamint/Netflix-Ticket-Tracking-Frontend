import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind CSS
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Router
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

// Redux
import { Provider } from 'react-redux';
import { store } from './store';

// Auth
import { AuthProvider } from './context/AuthContext';

// Google OAuth
import { GoogleOAuthProvider } from '@react-oauth/google';

// 🚀 Set demo user in localStorage if not already set
// const existingUser = localStorage.getItem("user");
// if (!existingUser) {
//   const demoUser = { name: "Demo User", role: "cm" }; // default user role
//   localStorage.setItem("user", JSON.stringify(demoUser));
// }

// ✅ Replace with your actual Google client ID from Google Developer Console
const GOOGLE_CLIENT_ID = '940013775027-c19f9mtvsjtnn74199qu2n6fflju7v36.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Suspense>
        <Provider store={store}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </Provider>
      </Suspense>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
