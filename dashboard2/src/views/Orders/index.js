import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@mui/material';

import LatestOrders from 'Components/Orders/LatestOrders';
import { useState, useEffect } from 'react';

import { API_SERVICE } from 'URI';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
/* eslint no-underscore-dangle: 0 */

function getSessionStorageOrDefault(key, defaultValue) {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
        return defaultValue;
    }

    return stored;
}
const Orders = () => {
    const [User, setUser] = useState(null);
    const [customers, setCustomers] = useState(null);
    const userEmail = getSessionStorageOrDefault('userEmail', '');
    const navigate = useNavigate();
    useEffect(() => {
        setUser({ email: userEmail });
        if (userEmail === '') {
            navigate('/pages/login/login3', { replace: true });
        }
    }, []);
    useEffect(() => {
        const get = async () => {
            try {
                const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/order/getorders/${User.email}`);
                const content = await rawResponse.json();

                setCustomers(content);
            } catch (err) {
                console.log(err);
            }
        };
        get();
    }, [User]);
    const setStatus = async (status, id) => {
        let cust = [...customers];

        cust = cust.map((customer) => {
            if (customer._id === id) {
                customer.status = status;
            }
            return customer;
        });
        const updateCustomer = async () => {
            try {
                const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/order/updateorder?id=${id}&status=${status}`, {
                    method: 'PATCH',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                const content = await rawResponse.json();
                console.log(content);
            } catch (err) {
                console.log(err);
            }
        };

        updateCustomer();
        setCustomers(cust);
    };
    const handleDelete = async (id) => {
        let cust = customers;
        cust = cust.filter((ele) => ele._id !== id);
        try {
            const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/order/deleteorder?id=${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const content = await rawResponse.json();

            setCustomers(cust);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <Helmet>
                <title>Orders | Material Kit</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100%',
                    py: 3
                }}
            >
                <Container maxWidth={false}>
                    <Grid container spacing={3}>
                        <Grid item lg={12} md={12} xl={12} xs={12}>
                            <LatestOrders
                                setStatus={setStatus}
                                handleDelete={handleDelete}
                                showEditButton
                                showDelete
                                showStatus
                                customers={customers}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};
export default Orders;
