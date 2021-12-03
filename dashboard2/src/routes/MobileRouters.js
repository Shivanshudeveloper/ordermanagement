import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';

// Mobile
const HomeMobile = Loadable(lazy(() => import('../mobile/Home')));
const Signin = Loadable(lazy(() => import('../mobile/pages/Signin')));
const Signup = Loadable(lazy(() => import('../mobile/pages/Register')));

const MobileRouters = {
    path: 'mobile',
    children: [
        { path: '/', element: <HomeMobile /> },
        { path: '/register', element: <Signup /> },
        { path: '/signin', element: <Signin /> }
    ]
};

export default MobileRouters;
