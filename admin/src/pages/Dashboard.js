import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@material-ui/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import TotalCustomers from '../components/dashboard/TotalCustomers';
import TotalUsers from '../components/dashboard/TotalUsers';

function getSessionStorageOrDefault(key, defaultValue) {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }

  return stored;
}
const Dashboard = () => {
  const userEmail = getSessionStorageOrDefault('userEmail', '');
  const navigate = useNavigate();

  useEffect(() => {
    if (userEmail === '') {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <>
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
        <Container
          maxWidth={false}
        >
          <Grid
            container
            spacing={3}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              mt: 5
            }}
          >
            {/* <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget />
            </Grid> */}

            {/* <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TasksProgress />
            </Grid> */}
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TotalUsers sx={{ height: '100%' }} />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TotalCustomers />
            </Grid>
            {/* <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              <Sales />
            </Grid> */}
            {/* <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <TrafficByDevice sx={{ height: '100%' }} />
            </Grid> */}
            {/* <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <LatestProducts sx={{ height: '100%' }} />
            </Grid> */}
            {/* <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              <LatestOrders />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};
export default Dashboard;
