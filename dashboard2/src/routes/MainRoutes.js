import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const CustomersPage = Loadable(lazy(() => import('views/Customers')));
const MenuPage = Loadable(lazy(() => import('views/Menu')));
const OrdersPage = Loadable(lazy(() => import('views/Orders')));
const CategoriesPage = Loadable(lazy(() => import('views/Categories')));
const TemplatesPage = Loadable(lazy(() => import('views/Templates')));
const AccountPage = Loadable(lazy(() => import('views/Account')));
const BannersPage = Loadable(lazy(() => import('views/Banners')));
const CouponsPage = Loadable(lazy(() => import('views/Coupons')));
const QRcodePage = Loadable(lazy(() => import('views/QRcode')));
const APIsPage = Loadable(lazy(() => import('views/APIs')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: '/dashboard/default',
            element: <DashboardDefault />
        },
        {
            path: '/menu',
            element: <MenuPage />
        },
        {
            path: '/customers',
            element: <CustomersPage />
        },
        {
            path: '/orders',
            element: <OrdersPage />
        },
        {
            path: '/categories',
            element: <CategoriesPage />
        },
        {
            path: '/templates',
            element: <TemplatesPage />
        },
        {
            path: '/account',
            element: <AccountPage />
        },
        {
            path: '/banners',
            element: <BannersPage />
        },
        {
            path: '/coupons',
            element: <CouponsPage />
        },
        {
            path: '/qrcodes',
            element: <QRcodePage />
        },
        {
            path: '/apis',
            element: <APIsPage />
        },
        {
            path: '/utils/util-typography',
            element: <UtilsTypography />
        },
        {
            path: '/utils/util-color',
            element: <UtilsColor />
        },
        {
            path: '/utils/util-shadow',
            element: <UtilsShadow />
        },
        {
            path: '/icons/tabler-icons',
            element: <UtilsTablerIcons />
        },
        {
            path: '/icons/material-icons',
            element: <UtilsMaterialIcons />
        }
    ]
};

export default MainRoutes;
