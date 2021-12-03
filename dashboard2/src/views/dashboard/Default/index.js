import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports

import PopularCard from './PopularCard';

import TotalIncomeDarkCard from './TotalIncomeDarkCard';

import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import TotalOrders from './TotalOrders';
import TotalPending from './TotalPending';
import TotalRevenue from './TotalRevenue';
import { API_SERVICE } from 'URI';
import LatestOrders from 'Components/Orders/LatestOrders';
// ==============================|| DEFAULT DASHBOARD ||============================== //
function getSessionStorageOrDefault(key, defaultValue) {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
        return defaultValue;
    }

    return stored;
}
const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [User, setUser] = useState(null);
    const [customers, setCustomers] = useState(null);
    const [totalPending, setTotalPending] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const userEmail = getSessionStorageOrDefault('userEmail', '');
    const navigate = useNavigate();
    useEffect(() => {
        const get = async () => {
            try {
                const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/order/getorders/${User.email}`);
                const content = await rawResponse.json();
                let pending = 0;
                let revenue = 0;
                content.forEach((ele) => {
                    console.log(ele);
                    if (ele.status === 'Order Preparing') pending += 1;
                    revenue += ele.totalamount;
                });
                setTotalRevenue(revenue);
                setTotalPending(pending);
                setCustomers(content);
            } catch (err) {
                console.log(err);
            }
        };
        get();
    }, [User]);
    useEffect(() => {
        setLoading(false);
        setUser({ email: userEmail });
        if (userEmail === '') {
            navigate('/pages/login/login3', { replace: true });
        }
    }, []);
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <TotalOrders isLoading={isLoading} totalOrder={customers !== null ? customers.length : 0} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalPending isLoading={isLoading} totalPending={totalPending} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <TotalRevenue isLoading={isLoading} totalRevenue={totalRevenue} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <TotalGrowthBarChart isLoading={isLoading} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item lg={12} md={12} xl={12} xs={12}>
                <LatestOrders setStatus={null} showEditButton={false} showStatus={false} customers={customers} showdelete={false} />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
