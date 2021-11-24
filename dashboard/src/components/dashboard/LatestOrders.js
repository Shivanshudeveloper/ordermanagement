import moment from "moment";
import { v4 as uuid } from "uuid";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TableSortLabel,
  Dialog,
  DialogTitle,
  CardContent,
  Avatar,
  DialogContent,
  DialogActions,
  Tooltip,
  Typography,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import DeleteIcon from "@material-ui/icons/Delete";
import { useState } from "react";
const LatestOrders = ({ customers, setStatus, showStatus,handleDelete }) => {
  const [orders, setOrders] = useState(null);
  const [showView, setShowView] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showEdit, setShowEdit] = useState(false);
  const [selectedCustomer, setSlectedCustomer] = useState(null);
 const [openDeleteOrderPrompt,setOpenDeleteOrderPrompt]=useState(false);
  return (
    <>
      <Card>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <CardHeader title="Latest Orders" />
          {showStatus ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                sx={{ mr: 5 }}
                variant={filterStatus !== "All" ? "outlined" : "contained"}
                onClick={() => {
                  setFilterStatus("All");
                }}
              >
                All
              </Button>
              <Button
                sx={{ mr: 5 }}
                variant={
                  filterStatus !== "Order Preparing" ? "outlined" : "contained"
                }
                onClick={() => {
                  setFilterStatus("Order Preparing");
                }}
              >
                Order Preparing
              </Button>
              <Button
                sx={{ mr: 5 }}
                variant={
                  filterStatus !== "Order Delivered" ? "outlined" : "contained"
                }
                onClick={() => {
                  setFilterStatus("Order Delivered");
                }}
              >
                Order Delivered
              </Button>
            </Box>
          ) : null}
        </Box>
        <Divider />
        <PerfectScrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>

                  <TableCell>Email</TableCell>

                  <TableCell>Type</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Total Amount</TableCell>
                  {showStatus ? <TableCell>Status</TableCell> : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {customers?.map((customer) => {
                  if (
                    customer.status === filterStatus ||
                    filterStatus === "All"
                  )
                    return (
                      <TableRow hover key={customer._id}>
                        <TableCell>{customer.title}</TableCell>

                        <TableCell>{customer.email}</TableCell>

                        <TableCell>{customer.type}</TableCell>
                        <TableCell>{customer.payment}</TableCell>
                        <TableCell>{customer.totalamount}</TableCell>
                        {showStatus ? (
                          <TableCell>{customer.status}</TableCell>
                        ) : null}

                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={() => {
                              setOrders(customer);
                              setShowView(true);
                            }}
                          >
                            View Order
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setSlectedCustomer(customer);
                              setShowEdit(true);
                            }}
                          >
                            Edit Order
                          </Button>
                        </TableCell>
                        <TableCell>
                      <Chip
                        label="delete"
                        onClick={() => setOpenDeleteOrderPrompt(true)}
                  
                        deleteIcon={<DeleteIcon style={{ color: "red" }} />}

                        style={{ color: "red" }}
                      />
                         <Dialog
        open={openDeleteOrderPrompt}
        onClose={() => {
          setOpenDeleteOrderPrompt(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete?"}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDeleteOrderPrompt(false);
            }}
          >
            NO
          </Button>
          <Button onClick={() =>{       setOpenDeleteOrderPrompt(false); handleDelete(customer._id);}} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
                    </TableCell>
                      </TableRow>
                    );
                  else return null;
                })}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
          >
            View all
          </Button>
        </Box>
      </Card>

      <Dialog open={showView} onClose={() => setShowView(false)}>
        <DialogTitle>
          {" "}
          <Typography variant="h4" component="h4">
            Orders
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Time and Date</TableCell>

                <TableCell>Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell>{orders?.firstName}</TableCell>
                <TableCell>{orders?.lastName}</TableCell>
                <TableCell>{orders?.email}</TableCell>
                <TableCell>
                  {new Date(orders?.createdAt).toLocaleTimeString() +
                    " " +
                    new Date(orders?.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{orders?.totalamount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box sx={{ mt: 5, backgroundColor: "grey" }}>
            <Typography variant="h5" component="h5">
              Menu Items
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>discount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders?.orders.map((order, id) => {
                  return (
                    <TableRow hover key={id}>
                      <TableCell>{order?.selectedItem?.item}</TableCell>
                      <TableCell>{order?.selectedItem?.category}</TableCell>
                      <TableCell>{order?.selectedItem?.price}</TableCell>
                      <TableCell>{order?.selectedItem?.discount}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowView(null);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showEdit} onClose={() => setShowEdit(false)}>
        <DialogTitle>
          {" "}
          <Typography variant="h4" component="h4">
           Change Status
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
      
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Status"
            value={selectedCustomer?.status}
            onChange={(e) => {
              setStatus(e.target.value, selectedCustomer?._id);
            }}
          >
            {["Order Preparing", "Order Delivered"]?.map((it, id) => {
              return (
                <MenuItem value={it} key={id}>
                  <label>{it}</label>
                </MenuItem>
              );
            })}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSlectedCustomer(null);
              setShowEdit(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
   
    </>
  );
};
export default LatestOrders;
