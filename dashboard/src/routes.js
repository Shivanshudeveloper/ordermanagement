import { Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Account from './pages/Account';
import CustomerList from './pages/CustomerList';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Menu from './pages/Menu';
import Register from './pages/Register';

import Orders from './pages/Orders';
import Reports from './pages/Reports';
import Categories from './pages/Categories'
// Mobile
import HomeMobile from './mobile/Home';
import Templates from './pages/Templates';
import Banners from './pages/Banners';



const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'orders', element: <Orders /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'reports', element: <Reports /> },
      { path: 'templates', element:<Templates /> },
      { path: 'Menu', element: <Menu /> },
      { path: 'categories', element: <Categories /> },
      { path: 'Banners', element: <Banners /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: 'mobile',
    children: [
      { path: '/', element:<HomeMobile />},
    ]
  }
];

export default routes;
