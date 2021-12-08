import { Navigate } from 'react-router-dom';
import Users from './pages/Users';
import AppUsers from './pages/AppUsers';
import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';

import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [

      { path: 'appusers', element: <AppUsers /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
