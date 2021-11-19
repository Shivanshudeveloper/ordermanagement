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
import Coupons from './pages/Coupons';
import Signin from './mobile/pages/Signin';
import Signup from './mobile/pages/Register';
import QRcode from './pages/QRcode';
import Payment from './mobile/pages/Payment';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import APIs from './pages/APIs';

const stripePromise = loadStripe("pk_test_51JHsVhHTwp1a1ssgSKsY0MM2c51lL7qkbGLOghJe4SLwpbvZwSmJxjquqThrzP9LHQKkHdl2XGUoIT4o7u1rUi4I00U744HAUa");

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
      { path: 'Coupons', element: <Coupons /> },
      { path: 'ORcodeGenerate', element: <QRcode /> },
      { path: '/api', element: <APIs /> },
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
      { path: '/register', element:<Signup />},
      { path: '/signin', element:<Signin />},
      { path: '/payment', element:   <Elements stripe={stripePromise}><Payment /></Elements>},
    ]
  }
];

export default routes;
