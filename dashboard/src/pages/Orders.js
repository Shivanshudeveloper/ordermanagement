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
import { useState ,useEffect} from 'react';
import getUser from '../Firebase/getUser';
import { API_SERVICE } from '../URI';

const Orders = () =>
{
  const [User, setUser] = useState(null);
  const [customers,setCustomers]=useState(null);

  useEffect(() => {
    const get = async () => {
      const us = await getUser();
      setUser(us);
    };
    if (User === null) get();
  }, []);
  useEffect(()=>{
    const get = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/order/getorders/${User.email}`
        );
        const content = await rawResponse.json();

        setCustomers(content);
      } catch (err) {
        console.log(err);
      }
    };
   get();
  },[User]);
  const setStatus=async(status,id)=>{
    let cust=[...customers];

    cust=cust.map((customer)=>{
      if(customer._id===id){
        customer.status=status;
      }
      return customer;
    });
    const updateCustomer = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/order/updateorder?id=${id}&status=${status}`,
          {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        const content = await rawResponse.json();
       console.log(content);
       
      } catch (err) {
      console.log(err);
   
      }
    };

    updateCustomer();
    setCustomers(cust);
  }
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
            <LatestOrders setStatus={setStatus} customers={customers} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);
    };
export default Orders;
