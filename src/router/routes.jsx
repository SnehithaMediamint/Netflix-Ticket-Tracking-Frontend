import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import GoogleCallback from '../components/GoogleCallback';

const Tickets = lazy(() => import('../pages/dashboard/Tickets'));
const Login = lazy(() => import('../pages/Login'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));

const routes = [
  { path: '/login', element: <Login />, layout: 'blank' },
  {
    path: '/google/callback', // This is the route your backend redirects to
    element: <GoogleCallback />, // Render the GoogleCallback component here
  },
  { path: '/unauthorized', element: <Unauthorized />, layout: 'blank' },
  {
    path: '/',
    element: <ProtectedRoute allowedRoles={[0, 1]} />, // 0 = QM, 1 = CM
    layout: 'default',
    children: [
      { path: 'tickets', element: <Tickets /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace />, layout: 'blank' },
];

export { routes };
