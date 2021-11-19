import { Helmet } from "react-helmet";
import {
  Box,
  Container,
  Grid,
  Button,
  Typography,
  TextField,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import getUser from "../Firebase/getUser";
import { API_SERVICE } from "../URI";
const APIs = () => {
  const [isOrders, setIsOrders] = useState(true);
  const [value, setValue] = useState("");
  const [User, setUser] = useState(null);
  const [orders, setOrders] = useState(null);
  const [revenue,setRevenue]=useState(null);


  useEffect(() => {
    const get = async () => {
      const us = await getUser();
      setUser(us);
    };
    if (User === null) get();
  }, []);

  const getOrders = async () => {
    try {
      const rawResponse = await fetch(
        `${API_SERVICE}/api/v1/main/order/getorders/${User?.email}`
      );
      const content = await rawResponse.json();

      let ord = [];
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
      const rawResponse = await fetch(
        `${API_SERVICE}/api/v1/main/order/getrevenue/${User?.email}`
      );
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
          backgroundColor: "background.default",

          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          m: 10,
          mt: 5,
          mb: 0,
        }}
      >
        <Typography color="textPrimary" variant="h2" sx={{ mb: 3 }}>
          APIs
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "white",
          ml: 10,
          mr: 10,
          mt: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Button
            onClick={() => {
                setValue(`${API_SERVICE}/api/v1/main/order/getorders/${User?.email}`);
              setIsOrders(true);
            }}
            sx={{ m: 2 }}
            variant={isOrders ? "contained" : "outlined"}
          >
            ORDERS
          </Button>
          <Button
            onClick={() => {
                setValue(`${API_SERVICE}/api/v1/main/order/getrevenue/${User?.email}`);
              setIsOrders(false);
            }}
            variant={!isOrders ? "contained" : "outlined"}
          >
            TOTAL REVENUE
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            sx={{ width: "50vw" }}
            label={"url"}
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
            backgroundColor: "white",
            height: "500px",
            ml: 5,
            mr: 5,
            mt: 5,
            display: "flex",
            flexWrap: "wrap",
            overflowX: "auto",
          }}
        >
         {isOrders && orders!==null? 
          <pre class="brush: javascript">
            {JSON.stringify(orders, null, 2)}
          </pre>:(revenue!==null)? 
          <pre class="brush: javascript">
            {JSON.stringify(revenue, null, 2)}
          </pre>:null}
        </Box>
      </Container>
    </Box>
  );
};

export default APIs;
