import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@material-ui/core";
import PropTypes from "prop-types";
const CustomerListToolbar = (props) => {
  const { handleClickOpen, handleClose, setCategoryHandler,open } = props;
  return (
    <Box {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button color="primary" variant="contained" onClick={handleClickOpen}>
          Add Category
        </Button>
        <Dialog open={open} fullWidth onClose={handleClose}>
          <DialogTitle>Enter Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Category"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setCategoryHandler(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
CustomerListToolbar.propTypes = {
  handleClickOpen: PropTypes.func,
  handleClose: PropTypes.func,
  setCategoryHandler: PropTypes.func,
  open:PropTypes.bool
};
export default CustomerListToolbar;
