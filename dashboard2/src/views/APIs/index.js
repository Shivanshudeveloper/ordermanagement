import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Button, Typography, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { API_SERVICE } from 'URI';

function getSessionStorageOrDefault(key, defaultValue) {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
        return defaultValue;
    }

    return stored;
}
/* eslint no-underscore-dangle: 0 */
/* eslint-disable */
const APIs = () => {
    const [isOrders, setIsOrders] = useState(true);
    const [value, setValue] = useState('');
    const [User, setUser] = useState(null);
    const [orders, setOrders] = useState(null);
    const [revenue, setRevenue] = useState(null);

    const userEmail = getSessionStorageOrDefault('userEmail', '');
    const navigate = useNavigate();
    useEffect(() => {
        setUser({ email: userEmail });
        if (userEmail === '') {
            navigate('/free/pages/login/login3', { replace: true });
        }
    }, []);
    const getOrders = async () => {
        try {
            const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/order/getorders/${User?.email}`);
            const content = await rawResponse.json();

            const ord = [];
            content.forEach((od) => {
                ord.push(od.orders);
            });

            setOrders(ord);
        } catch (err) {
            console.log(err);
        }
    };
    const getRevenue = async () => {
        try {
            const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/order/getrevenue/${User?.email}`);
            const content = await rawResponse.json();

            setRevenue(content);
        } catch (err) {
            console.log(err);
        }
    };
    const get = () => {
        if (isOrders) getOrders();
        else getRevenue();
    };
    useEffect(() => {
        setValue(`${API_SERVICE}/api/v1/main/order/getorders/${User?.email}`);
    }, [User]);
    return (
        <Box>
            <Helmet>
                <title>Dashboard | Material Kit</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100%',
                    py: 3
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'background.default',

                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        m: 10,
                        mt: 5,
                        mb: 0
                    }}
                >
                    <Typography color="textPrimary" variant="h2" sx={{ mb: 3 }}>
                        APIs
                    </Typography>
                </Box>
                <Box
                    sx={{
                        backgroundColor: 'white',
                        ml: 10,
                        mr: 10,
                        mt: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Box>
                        <Button
                            onClick={() => {
                                setValue(`${API_SERVICE}/api/v1/main/order/getorders/${User?.email}`);
                                setIsOrders(true);
                            }}
                            sx={{ m: 2 }}
                            variant={isOrders ? 'contained' : 'outlined'}
                        >
                            ORDERS
                        </Button>
                        <Button
                            onClick={() => {
                                setValue(`${API_SERVICE}/api/v1/main/order/getrevenue/${User?.email}`);
                                setIsOrders(false);
                            }}
                            variant={!isOrders ? 'contained' : 'outlined'}
                        >
                            TOTAL REVENUE
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            sx={{ width: '50vw' }}
                            label="url"
                            margin="normal"
                            name="URL"
                            onChange={(e) => {
                                setValue(e.target.value);
                            }}
                            type="text"
                            value={value}
                            variant="outlined"
                        />
                        <Button sx={{ mr: 10, ml: 10 }} variant="contained" onClick={get}>
                            GET
                        </Button>
                    </Box>
                </Box>

                <Container maxWidth={false}>
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            height: '500px',
                            ml: 5,
                            mr: 5,
                            mt: 5,
                            display: 'flex',
                            flexWrap: 'wrap',
                            overflowX: 'auto'
                        }}
                    >
                        {isOrders && orders !== null ? (
                            <pre class="brush: javascript">{JSON.stringify(orders, null, 2)}</pre>
                        ) : revenue !== null ? (
                            <pre class="brush: javascript">{JSON.stringify(revenue, null, 2)}</pre>
                        ) : null}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default APIs;
