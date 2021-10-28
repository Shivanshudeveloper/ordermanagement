import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@material-ui/core';
import Budget from '../components/dashboard/Budget';
import LatestOrders from '../components/dashboard/LatestOrders';
import LatestProducts from '../components/dashboard/LatestProducts';
import Sales from '../components/dashboard/Sales';
import TasksProgress from '../components/dashboard/TasksProgress';
import TotalCustomers from '../components/dashboard/TotalCustomers';
import TotalProfit from '../components/dashboard/TotalProfit';
import TrafficByDevice from '../components/dashboard/TrafficByDevice';

const Orders = () => (
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
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

export default Orders;
