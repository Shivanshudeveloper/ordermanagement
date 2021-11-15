import { Helmet } from "react-helmet";
import {
  Button,
  DialogContent,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Slide,
  IconButton,
  Toolbar,
  List,
} from "@material-ui/core";
import { useState, useEffect, forwardRef } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import DeleteIcon from "@material-ui/icons/Delete";
import getUser from "../Firebase/getUser";
import CloseIcon from "@material-ui/icons/Close";
import { API_SERVICE,APP_URL } from '../URI';
import QRCode from "qrcode.react";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const QRcode = () => {
  const [open, setOpen] = useState(false);
  const [tableName, setTableName] = useState("");
  const [User, setUser] = useState({ displayName: "", email: "" });
  const [size, setSize] = useState(400);
  const [userID, setUserID] = useState("");
  const [qrCode, setQRCode] = useState("");
  const [qrCodes, setQRCodes] = useState([]);
  const [showView, setShowView] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    const get = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/user/getuser/${User.email}`
        );
        const content = await rawResponse.json();

        setUserID(content[0]._id);
      } catch (err) {
        console.log(err);
      }
    };

    get();
  }, [User]);
  useEffect(() => {
    const get = async () => {
      setUser(await getUser());
    };
    get();
  }, []);
  const setQRCodeHandler = async () => {
    const Url=`${APP_URL}/mobile?email=${User.email}&id=${userID}&tablename=${tableName}`;
  
    try {
      const rawResponse = await fetch(
        `${API_SERVICE}/api/v1/main/qr/addQRcode`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: User.email,
            tableName,
            qrCode:Url
          }),
        }
      );

      const content = await rawResponse.json();

      setQRCodes((old) => [...old, content]);
      setTableName("");
      setQRCode("");
    } catch (err) {
      console.log(err);
      setTableName("");
      setQRCode("");
    }
  };
  useEffect(() => {
    const getQRCodes = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/qr/getQRCodes/${User.email}`
        );
        const content = await rawResponse.json();

        setQRCodes(content);
      } catch (err) {}
    };

    getQRCodes();
  }, [User]);
  const generateQRCode = () => {
    if (tableName !== "")
    {
      const Url=`${APP_URL}/mobile?email=${User.email}&id=${userID}&tablename=${tableName}`;
   
      setQRCode(Url);
      setOpen(false);
      }
    setQRCodeHandler();
  };
 
  const deleteQRcode = async (c) => {
    try {
      const rawResponse = await fetch(
        `${API_SERVICE}/api/v1/main/qr/removeQRCode/${c._id}`,
        {
          method: "delete",
        }
      );
      const res = await rawResponse.json();
      console.log(res);
      let filteredqrCodes = qrCodes.filter((q) => q.qrCode !== c.qrCode);
      setQRCodes(filteredqrCodes);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Helmet>
        <title>QR Code Generate </title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",

          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          m: 10,
          mb: 0,
        }}
      >
        <Typography color="textPrimary" variant="h2" sx={{ mb: 3 }}>
          QR Code Generate
        </Typography>

        <Button
          variant="contained"
          component="label"
          onClick={() => setOpen(true)}
        >
          Generate QR
        </Button>
      </Box>
      <PerfectScrollbar>
        <Box sx={{ maxWidth: 600, ml: 40, backgroundColor: "white" }}>
          <Table sx={{ overflow: "scroll" }}>
            <TableHead>
              <TableRow>
                <TableCell>Table Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qrCodes.map((c) => (
                <>
                  <TableRow hover key={IDBCursor}>
                    <TableCell>{c.tableName}</TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSelectedQR(c);
                          setShowView(true);
                        }}
                      >
                        QR code
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="delete"
                        onClick={() => deleteQRcode(c)}
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
      </PerfectScrollbar>

      <Dialog
        fullWidth
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Enter Table Name"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Table Name"
            type="text"
            fullWidth
            value={tableName}
            variant="standard"
            onChange={(e) => setTableName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              generateQRCode();
              
              
            }}
            autoFocus
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>
      {qrCode !== "" ? (
        <Box
          sx={{
            ml: 60,
            backgroundColor: "white",
            width: "600px",
            boxShadow: "1px 1px 40px 1px grey",
          }}
        >
      <QRCode value={qrCode} />
        </Box>
      ) : null}
      <Dialog
      fullWidth
        open={showView}
        onClose={() => setShowView(false)}
        TransitionComponent={Transition}
      >
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            QR code
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setShowView(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
       
        </Toolbar>
   <QRCode value={selectedQR?.qrCode} />
    
      </Dialog>
    </>
  );
};

export default QRcode;
