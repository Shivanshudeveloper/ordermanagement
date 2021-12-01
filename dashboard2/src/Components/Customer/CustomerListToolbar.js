import { Box, Button, Card, CardContent, TextField, InputAdornment, SvgIcon } from '@mui/material';
/* eslint no-underscore-dangle: 0 */

const CustomerListToolbar = (props) => (
    <Box {...props}>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end'
            }}
        >
            <Button>Import</Button>
            <Button sx={{ mx: 1 }}>Export</Button>
            <Button color="primary" variant="contained">
                Add customer
            </Button>
        </Box>
        <Box sx={{ mt: 3 }}>
            <Card>
                <CardContent>
                    <Box sx={{ maxWidth: 500 }}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon fontSize="small" color="action">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="icon icon-tabler icon-tabler-search"
                                                width="30"
                                                height="30"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="#2c3e50"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <circle cx="10" cy="10" r="7" />
                                                <line x1="21" y1="21" x2="15" y2="15" />
                                            </svg>
                                        </SvgIcon>
                                    </InputAdornment>
                                )
                            }}
                            placeholder="Search customer"
                            variant="outlined"
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    </Box>
);

export default CustomerListToolbar;
