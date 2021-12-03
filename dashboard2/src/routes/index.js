import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRouters';
import AuthenticationRoutes from './AuthenticationRoutes';
import MobileRouters from './MobileRouters';
import config from 'config';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([MainRoutes, AuthenticationRoutes, MobileRouters], config.basename);
}
