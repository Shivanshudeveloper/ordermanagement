import moment from "moment";
import { v4 as uuid } from "uuid";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useState } from "react";

const CategoryList = (props) => {
  const { categories, handleDeleteCategory } = props;
  const [open, setOpen] = useState(false);
  const [id,setId]=useState(null);
  const handleClickOpen = (_id) => {
    setId(_id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
      
    handleDeleteCategory(id);
    setId(null);
    setOpen(false);
  };
  return (
    <Card {...props}>
      <CardHeader title="Categories" />
      <Divider />
      <PerfectScrollbar>
        <Box sx={{overflowY:'scroll',maxHeight:"65vh"}} >
          <Table >
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Icon</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {categories.map((category) => (
                <>
                  <TableRow hover key={category._id}>
                    <TableCell>{category.category}</TableCell>

               
                    <TableCell>
                    <img alt="" width="50px" height="50px" src={category.icon}  />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="delete"
                        onClick={() => handleClickOpen(category._id)}
                        onDelete={() => {}}
                        deleteIcon={<DeleteIcon style={{ color: "red" }} />}

                        style={{ color: "red" }}
                      />
                    </TableCell>
                  </TableRow>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Do you want to delete?"}
                    </DialogTitle>
                    <DialogActions>
                      <Button onClick={handleClose}>NO</Button>
                      <Button
                        onClick={() => handleDelete()}
                        autoFocus
                      >
                        Yes
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              ))}
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
      ></Box>
    </Card>
  );
};
CategoryList.propTypes = {
  categories: PropTypes.array,
  handleDeleteCategory: PropTypes.func,
};
export default CategoryList;
