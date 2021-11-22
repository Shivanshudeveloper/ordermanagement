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
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import { useState } from "react";
const LatestOrders = ({ customers, setStatus, showStatus }) => {
  const [orders, setOrders] = useState(null);
  const [showView, setShowView] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  return (
    <>
      <Card>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <CardHeader title="Latest Orders" />
         {showStatus? <Box
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
          </Box>:null}
        </Box>
        <Divider />
        <PerfectScrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Type</TableCell>
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
                        <TableCell>{customer.firstName}</TableCell>
                        <TableCell>{customer.lastName}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>Dine In / Delivery</TableCell>
                        {showStatus ? (
                          <TableCell>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Category"
                              value={customer.status}
                              sx={
                                customer.status === "Order Delivered"
                                  ? {
                                      color: "white",
                                      fontWeight: "900",
                                      backgroundColor: "green",
                                    }
                                  : {
                                      color: "white",
                                      backgroundColor: "orange",
                                      fontWeight: "900",
                                    }
                              }
                              onChange={(e) => {
                                setStatus(e.target.value, customer._id);
                              }}
                            >
                              {["Order Preparing", "Order Delivered"]?.map(
                                (it, id) => {
                                  return (
                                    <MenuItem value={it} key={id}>
                                      <label>{it}</label>
                                    </MenuItem>
                                  );
                                }
                              )}
                            </Select>
                          </TableCell>
                        ) : null}
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={() => {
                              setOrders(customer.orders);
                              setShowView(true);
                            }}
                          >
                            View Order
                          </Button>
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
      <Dialog open={showView} fullWidth onClose={() => setShowView(false)}>
        <DialogTitle>Orders</DialogTitle>

        <DialogContent
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>category</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((order, id) => (
                <TableRow hover key={id}>
                  <TableCell>{order.selectedItem.item}</TableCell>
                  <TableCell>{order.selectedItem.price}</TableCell>
                  <TableCell>{order.selectedItem.category}</TableCell>
                  <TableCell>{order.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
    </>
  );
};
export default LatestOrders;
