import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";

import LatestOrders from "../components/dashboard/LatestOrders";
import LatestProducts from "../components/dashboard/LatestProducts";
import Sales from "../components/dashboard/Sales";
import TotalOrders from "../components/dashboard/TotalOrders";
import TotalPending from "../components/dashboard/TotalPending";
import TotalRevenue from "../components/dashboard/TotalRevenue";
import TrafficByDevice from "../components/dashboard/TrafficByDevice";
import { useEffect, useState } from "react";
import getUser from "../Firebase/getUser";
import { API_SERVICE } from "../URI";
const Dashboard = () => {
  const [User, setUser] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [totalPending, setTotalPending] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  useEffect(() => {
    const get = async () => {
      const us = await getUser();
      setUser(us);
    };
    if (User === null) get();
  }, []);
  useEffect(() => {
    const get = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/order/getorders/${User.email}`
        );
        const content = await rawResponse.json();
        let pending = 0,
          revenue = 0;
        content.forEach((ele) => {
          console.log(ele);
          if (ele.status === "Order Preparing") pending++;
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

  return (
    <>
      <Helmet>
        <title>Dashboard | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalOrders
                totalOrder={customers !== null ? customers.length : 0}
              />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalPending totalPending={totalPending} />
            </Grid>

            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalRevenue totalRevenue={totalRevenue} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <Sales />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <TrafficByDevice sx={{ height: "100%" }} />
            </Grid>

            <Grid item lg={12} md={12} xl={12} xs={12}>
              <LatestOrders
                setStatus={null}
                showStatus={false}
                customers={customers}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
export default Dashboard;
