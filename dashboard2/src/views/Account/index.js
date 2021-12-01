import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@mui/material';
import AccountProfile from '../../Components/Account/AccountProfile';
import AccountProfileDetails from '../../Components/Account/AccountProfileDetails';
import { useEffect, useState } from 'react';
import getUser from 'Firebase/getUser';

const Account = () => {
    const [User, setUser] = useState({ displayName: '' });
    useEffect(() => {
        const get = async () => {
            setUser(await getUser());
        };
        get();
    }, []);

    return (
        <>
            <Helmet>
                <title>Account | Material Kit</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100%',
                    py: 3
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        <Grid item lg={4} md={6} xs={12}>
                            <AccountProfile user={User} />
                        </Grid>
                        <Grid item lg={8} md={6} xs={12}>
                            <AccountProfileDetails user={User} />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};
export default Account;
