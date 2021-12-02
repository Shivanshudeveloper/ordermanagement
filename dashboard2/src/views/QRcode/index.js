import { Helmet } from 'react-helmet';
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
    Select,
    MenuItem,
    Tooltip
} from '@mui/material';
import { useState, useEffect, forwardRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { API_SERVICE, APP_URL } from 'URI';
import QRCode from 'qrcode.react';
/* eslint no-underscore-dangle: 0 */
function getSessionStorageOrDefault(key, defaultValue) {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
        return defaultValue;
    }

    return stored;
}
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const QRcode = () => {
    const [open, setOpen] = useState(false);
    const [title, settitle] = useState('');
    const [User, setUser] = useState({ displayName: '', email: '' });
    const [size, setSize] = useState(400);
    const [userID, setUserID] = useState('');
    const [qrCode, setQRCode] = useState('');
    const [qrCodes, setQRCodes] = useState([]);
    const [showView, setShowView] = useState(false);
    const [selectedQR, setSelectedQR] = useState(null);
    const [selected, setSelected] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [qrType, setQRType] = useState('');
    useEffect(() => {
        const get = async () => {
            try {
                const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/user/getuser/${User.email}`);
                const content = await rawResponse.json();

                setUserID(content[0]._id);
            } catch (err) {
                console.log(err);
            }
        };

        get();
    }, [User]);
    const userEmail = getSessionStorageOrDefault('userEmail', '');
    const navigate = useNavigate();
    useEffect(() => {
        setUser({ email: userEmail });
        if (userEmail === '') {
            navigate('/free/pages/login/login3', { replace: true });
        }
    }, []);
    const setQRCodeHandler = async () => {
        const Url = `${APP_URL}/mobile?email=${User.email}&id=${userID}&title=${title}&type=${qrType.split(' ').join('')}`;

        try {
            const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/qr/addQRcode`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: User.email,
                    title,
                    qrCode: Url,
                    type: qrType
                })
            });

            const content = await rawResponse.json();

            setQRCodes((old) => [...old, content]);
            settitle('');
            setQRCode('');
        } catch (err) {
            console.log(err);
            settitle('');
            setQRCode('');
        }
    };
    useEffect(() => {
        const getQRCodes = async () => {
            try {
                const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/qr/getQRCodes/${User.email}`);
                const content = await rawResponse.json();

                setQRCodes(content);
            } catch (err) {
                console.log(err);
            }
        };

        getQRCodes();
    }, [User]);

    const generateQRCode = () => {
        if (title !== '') {
            const Url = `${APP_URL}/mobile?email=${User.email}&id=${userID}&title=${title}&type=${qrType.split(' ').join('')}`;

            setQRCode(Url);
            setOpen(false);
        }
        setQRCodeHandler();
    };

    const deleteQRcode = async (c) => {
        try {
            const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/qr/removeQRCode/${c._id}`, {
                method: 'delete'
            });
            const res = await rawResponse.json();
            console.log(res);
            const filteredqrCodes = qrCodes.filter((q) => q.qrCode !== c.qrCode);
            setQRCodes(filteredqrCodes);
        } catch (err) {
            console.log(err);
        }
    };
    const updateQRCodeHandler = async () => {
        const Url = `${APP_URL}/mobile?email=${User.email}&id=${userID}&title=${title}&type=${qrType.split(' ').join('')}`;
        const temp = [...qrCodes];
        console.log(temp);
        const index = temp.findIndex((ele) => ele._id === selected._id);
        temp[index].title = title;
        temp[index].qrCode = Url;
        temp[index].type = qrType;
        setQRCodes(temp);

        try {
            const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/qr/updateQRCode`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: User.email,
                    title,
                    qrCode: Url,
                    id: selected._id,
                    type: qrType
                })
            });

            const content = await rawResponse.json();

            settitle('');
            setQRCode('');

            setSelected(null);
            setShowEdit(false);
        } catch (err) {
            console.log(err);
            settitle('');
            setQRCode('');
        }
    };
    const reGenerateQRCode = () => {
        if (title !== '') {
            const Url = `${APP_URL}/mobile?email=${User.email}&id=${userID}&title=${title}&type=${qrType.split(' ').join('')}`;

            setQRCode(Url);
            setOpen(false);
        }
        updateQRCodeHandler();
    };
    return (
        <>
            <Helmet>
                <title>QR Code Generate </title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100%',
                    py: 3
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'background.default',

                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        m: 3,
                        mb: 0
                    }}
                >
                    <Typography color="textPrimary" variant="h2" sx={{ mb: 3 }}>
                        QR Code Generate
                    </Typography>

                    <Button
                        variant="contained"
                        component="label"
                        onClick={() => {
                            settitle('');
                            setQRType('');
                            setOpen(true);
                        }}
                    >
                        Generate QR
                    </Button>
                </Box>
                <PerfectScrollbar>
                    <Box
                        sx={{
                            minWidth: 600,
                            ml: 10,
                            mr: 10,
                            mt: 5,
                            backgroundColor: 'white'
                        }}
                    >
                        <Table sx={{ overflow: 'scroll' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>

                                    <TableCell>Type</TableCell>
                                    <TableCell>Options</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {qrCodes.map((c) => (
                                    <>
                                        <TableRow hover key={IDBCursor}>
                                            <TableCell>{c.title}</TableCell>
                                            <TableCell>{c.type}</TableCell>

                                            <TableCell>
                                                <Tooltip title="QR Code">
                                                    <IconButton
                                                        onClick={() => {
                                                            setSelectedQR(c);
                                                            setShowView(true);
                                                        }}
                                                        sx={{ color: 'grey' }}
                                                        component="span"
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => {
                                                            setSelected(c);
                                                            settitle(c.title);
                                                            setQRType(c.type);
                                                            setShowEdit(true);
                                                        }}
                                                        component="span"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        sx={{ color: 'rgb(205,10,10)' }}
                                                        onClick={() => deleteQRcode(c)}
                                                        component="span"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
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
                    <DialogTitle id="alert-dialog-title">QR CODE</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Title"
                                type="text"
                                fullWidth
                                sx={{ mb: 5 }}
                                value={title}
                                variant="standard"
                                onChange={(e) => settitle(e.target.value)}
                            />
                            <h6 style={{ marginBottom: '10px' }}>Select Type</h6>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                fullWidth
                                label="Select Type"
                                value={qrType}
                                onChange={(e) => setQRType(e.target.value)}
                            >
                                {['Social Media Campaigns', 'Dine In']?.map((cat) => (
                                    <MenuItem value={cat} key={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
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
                <Dialog
                    fullWidth
                    open={showEdit}
                    onClose={() => {
                        setOpen(false);
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">QR CODE</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Title"
                                fullWidth
                                value={title}
                                variant="standard"
                                onChange={(e) => settitle(e.target.value)}
                            />
                            <h6 style={{ marginBottom: '10px', marginTop: '20px' }}>Select Type</h6>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                fullWidth
                                label="Select Type"
                                value={qrType}
                                onChange={(e) => setQRType(e.target.value)}
                            >
                                {['Social Media Campaigns', 'Dine In']?.map((cat) => (
                                    <MenuItem value={cat} key={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setShowEdit(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                reGenerateQRCode();
                            }}
                            autoFocus
                        >
                            Generate
                        </Button>
                    </DialogActions>
                </Dialog>
                {qrCode !== '' ? (
                    <Box
                        sx={{
                            ml: 60,
                            backgroundColor: 'white',
                            width: '600px',
                            boxShadow: '1px 1px 40px 1px grey'
                        }}
                    >
                        <QRCode value={qrCode} />
                    </Box>
                ) : null}
                <Dialog open={showView} onClose={() => setShowView(false)} TransitionComponent={Transition}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItem: 'center'
                        }}
                    >
                        <Toolbar>
                            <Typography sx={{ ml: 2, flex: 3 }} variant="h6" component="div">
                                QR code
                            </Typography>
                            <IconButton edge="start" color="inherit" onClick={() => setShowView(false)} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>

                        <QRCode size={500} includeMargin value={selectedQR?.qrCode} />
                    </Box>
                </Dialog>
            </Box>
        </>
    );
};

export default QRcode;
