import moment from 'moment';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
  TableSortLabel,Dialog,DialogTitle,CardContent,Avatar,DialogContent,DialogActions,
  Tooltip
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';


import { useState } from 'react';
const LatestOrders = ({customers}) => {

const [orders,setOrders]=useState(null);
const [showView,setShowView]=useState(false);
return (
  <>
  <Card >
    <CardHeader title="Latest Orders" />
    <Divider />
    <PerfectScrollbar>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Table Name
              </TableCell>
              <TableCell>
                First Name
              </TableCell>
              <TableCell>
                Last Name
              </TableCell>
              <TableCell>
                Email
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers?.map((customer,id) => (
             
                  <TableRow
                  hover
                  key={id}
                >
                   <TableCell>
                    {customer.tablename}
                  </TableCell>
                  <TableCell>
                    {customer.firstName}
                  </TableCell>
                  <TableCell>
                    {customer.lastName}
                  </TableCell>
                  <TableCell>
                    {customer.email}
                  </TableCell>
                  
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
              
            ))}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
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
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                Price
              </TableCell>
              <TableCell>
                category
              </TableCell>
              <TableCell>
                Quantity
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order,id) => (
             
                  <TableRow
                  hover
                  key={id}
                >
                   <TableCell>
                    {order.selectedItem.item}
                  </TableCell>
                  <TableCell>
                    {order.selectedItem.price}
                  </TableCell>
                  <TableCell>
                    {order.selectedItem.category}
                  </TableCell>
                  <TableCell>
                    {order.count}
                  </TableCell>
                  
                  
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
