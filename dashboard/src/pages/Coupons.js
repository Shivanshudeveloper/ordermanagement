import { Box, Container, TextField, Button,Table,TableRow,TableHead,TableCell,TableBody,Chip} from "@material-ui/core";
import { Helmet } from "react-helmet";
import { useState,useEffect } from "react";
import getUser from "../Firebase/getUser";
import DeleteIcon from "@material-ui/icons/Delete";
const Coupons = () => {
        const [coupons,setCoupons]=useState([]);
        const [coupon,setCoupon]=useState({couponCode:"",discount:""});
        const [User, setUser] = useState({ displayName: "", email: "" });
 const setCouponHandler=async()=>{
     
       try {
        const rawResponse = await fetch(
          "http://localhost:5000/api/v1/main/coupons/addcoupon",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                discount: coupon.discount,
              email: User.email,
              couponCode: coupon.couponCode,
            })
          }
        );
        console.log(coupon);
        const content = await rawResponse.json();
       console.log(content);    
        setCoupons((old) => [...old, content]);
        setCoupon({couponCode:"",discount:""});
      } catch (err) {
        console.log(err);
        setCoupon({couponCode:"",discount:""});
      }

 }
 const deleteCoupon=async(cop)=>{
        try {
                const rawResponse = await fetch(
                  `http://localhost:5000/api/v1/main/coupons/removecoupon/${cop._id}`,
                  {
                    method: "delete",
                  }
                );
                const res = await rawResponse.json();
                console.log(res);
                let filteredCoupons=coupons.filter((c)=>c._id!==cop._id);
                setCoupons(filteredCoupons);
            
          
              } catch (err) {
             
                console.log(err);
             
              }
   

 }

 useEffect(() => {
        const getCoupons = async () => {
          try {
            const rawResponse = await fetch(
              `http://localhost:5000/api/v1/main/coupons/getcoupons/${User.email}`
            );
            const content = await rawResponse.json();
            console.log(content)
            setCoupons(content);
          } catch (err) {}
        };
    
        getCoupons();
      }, [User]);
 useEffect(() => {
        const get = async () => {
          setUser(await getUser());
        };
        get();
      }, []);
  return (
    <>
      <Helmet>
        <title>Coupons | Material Kit</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "white",
          height: "200px",
          py: 3,
          ml: 40,
          mt: 10,
          width: "60%",
        }}
      >
        <Container maxWidth={false}>
          <TextField
            autoFocus
            value={coupon.couponCode}
            margin="dense"
            id="name"
            label="Coupon Code"
            type="text"
            variant="filled"
            sx={{ m: 5 }}
            onChange={(e) => setCoupon((prev)=>({...prev,couponCode:e.target.value}))}
          />
          <TextField
            autoFocus
            value={coupon.discount}
            margin="dense"
            id="name"
            label="Discount"
            type="text"
            sx={{ m: 5 }}
            variant="filled"
            onChange={(e) => setCoupon((prev)=>({...prev,discount:e.target.value}))}
          />

          <Button disabled={(coupon.discount===""|| coupon.couponCode==="")} onClick={setCouponHandler}  sx={{ m: 5 }}  variant="contained" component="label">
            Add
          </Button>
        </Container>
      </Box>
      <Box
        sx={{
          backgroundColor: "white",
          minHeight: "200px",
          maxHeight:"400px",
          py: 3,
          ml: 50,
          mt: 10,
          width: "50%",
          overflow:"scroll",
          overflowX:"hidden"
        }}
      >
     
        <Table sx={{overflow:'scroll'}}>
            <TableHead>
              <TableRow>
                <TableCell>Coupon Code</TableCell>
                <TableCell>Discount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.map((cop,id) => (
                <>
                  <TableRow hover key={IDBCursor}>
                    <TableCell>{cop.couponCode}</TableCell>

               
                    <TableCell>{cop.discount}</TableCell>
                    <TableCell>
                      <Chip
                        label="delete"
                        onClick={() => deleteCoupon(cop)}
                     
                        deleteIcon={<DeleteIcon style={{ color: "red" }} />}

                        style={{ color: "red" }}
                      />
                    </TableCell>
                  </TableRow>
                  
                </>
              ))}
            </TableBody>
          </Table>

      </Box>
    </>
  );
};

export default Coupons;