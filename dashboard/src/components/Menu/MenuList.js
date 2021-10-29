import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import PropTypes from "prop-types";
const MenuList = (props) => {
  const { menuList } = props;
  return (
    <Card {...props}>
      <CardHeader title="Menu" />

      <PerfectScrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Menu Item</TableCell>
                <TableCell>Price of Item</TableCell>
                <TableCell>Discount if any</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menuList.map((menu) => (
                <TableRow hover key={menu.id}>
                  <TableCell>{menu.item}</TableCell>
                  <TableCell>{menu.price}</TableCell>
                  <TableCell>{menu.discount}</TableCell>
                  <TableCell>{menu.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>

      <Divider />
    </Card>
  );
};

MenuList.propTypes = {
  menuList: PropTypes.array,
};
export default MenuList;
