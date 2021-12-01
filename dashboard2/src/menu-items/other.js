// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import MarginIcon from '@mui/icons-material/Margin';
import PersonIcon from '@mui/icons-material/Person';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import RedeemIcon from '@mui/icons-material/Redeem';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ApiIcon from '@mui/icons-material/Api';
// constant
const icons = {
    IconBrandChrome,
    IconHelp
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'sample-docs-roadmap',
    type: 'group',
    children: [
        {
            id: 'Customers',
            title: 'Customers',
            type: 'item',
            url: '/Customers',
            icon: PeopleIcon,
            breadcrumbs: false
        },
        {
            id: 'Menu',
            title: 'Menu',
            type: 'item',
            url: '/menu',
            icon: MenuBookIcon,
            breadcrumbs: false
        },
        {
            id: 'Orders',
            title: 'Orders',
            type: 'item',
            url: '/orders',
            icon: FastfoodIcon,
            breadcrumbs: false
        },
        {
            id: 'Categories',
            title: 'Categories',
            type: 'item',
            url: '/categories',
            icon: BorderAllIcon,
            breadcrumbs: false
        },
        {
            id: 'Templates',
            title: 'Templates',
            type: 'item',
            url: '/templates',
            icon: MarginIcon,
            breadcrumbs: false
        },
        {
            id: 'Account',
            title: 'Account',
            type: 'item',
            url: '/account',
            icon: PersonIcon,
            breadcrumbs: false
        },
        {
            id: 'Banners',
            title: 'Banners',
            type: 'item',
            url: '/banners',
            icon: ViewCarouselIcon,
            breadcrumbs: false
        },
        {
            id: 'Coupons',
            title: 'Coupons',
            type: 'item',
            url: '/coupons',
            icon: RedeemIcon,
            breadcrumbs: false
        },
        {
            id: 'QRcodes',
            title: 'QRcodes',
            type: 'item',
            url: '/qrcodes',
            icon: QrCode2Icon,
            breadcrumbs: false
        },
        {
            id: 'API',
            title: 'API',
            type: 'item',
            url: '/apis',
            icon: ApiIcon,
            breadcrumbs: false
        }
    ]
};

export default other;
