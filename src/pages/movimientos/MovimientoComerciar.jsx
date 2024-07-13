import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../services/UserService";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Menu, MenuItem, Box, Container, CssBaseline, Button, Grid, Link } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getMonedas } from "../../services/MonedasService";


const MovimientoComerciar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const [anchorEl, setAnchorEl] = useState(null);
    const [userName, setUserName] = useState('');
    const [correo, setCorreo] = useState('');
    //const [setIdUserSession] = useState('');
    const [monedas, setMonedas] = useState([]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo(token);
                console.log('User Info:', data);
                setUserName(data.nombre);
                setCorreo(data.correo);
                //setIdUserSession(data.id);
            } catch (error) {
                console.error('Failed to fetch user info', error);
            }
        };
        if (token && username) {
            fetchUserInfo();
        }
    }, [token, username]);

    useEffect(() => {
        const fetchMonedas = async () => {
            try {
                const data = await getMonedas(token);
                setMonedas(data);
            } catch (error) {
                console.error('Failed to fetch currencies', error);
            }
        };

        fetchMonedas();
    }, [token]);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const handleVentasPendientes = () => {
        navigate('/ventas-pendientes');
    };

    const handleVender = () => {
        navigate('/vender');
    };

    const handleConfirmarVenta = () => {
        navigate('/confirmar-venta');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#333' }}>
            <CssBaseline />
            <Container component="main" sx={{ mt: 8, mb: 2, color: 'white' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'yellow' }}>
                    ¡Bienvenido a HowardCash!
                </Typography>
                <Typography variant="h6" sx={{ color: 'yellow' }}>
                    {`¡Hola, ${userName}!`}
                </Typography>
                <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>{correo}</MenuItem>
                    <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </Menu>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
                        Valores referenciales del mercado de venta y compra
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Moneda</TableCell>
                                    <TableCell>Símbolo</TableCell>
                                    <TableCell>Valor</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {monedas.map((moneda) => (
                                    <TableRow key={moneda.id}>
                                        <TableCell>{moneda.nombre}</TableCell>
                                        <TableCell>{moneda.simbolo}</TableCell>
                                        <TableCell>{moneda.valor_usd}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PendingActionsIcon />}
                        onClick={handleVentasPendientes}
                        sx={{ mr: 2, backgroundColor: 'yellow', color: '#333' }}
                    >
                        Ventas Pendientes
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AttachMoneyIcon />}
                        onClick={handleVender}
                        sx={{ mr: 2, backgroundColor: 'yellow', color: '#333' }}
                    >
                        Vender
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleConfirmarVenta}
                        sx={{ backgroundColor: 'yellow', color: '#333' }}
                    >
                        Confirmar Venta
                    </Button>
                </Box>
            </Container>
            <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#444', color: 'white' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Comunidad
                            </Typography>
                            <Box>
                                <IconButton color="inherit">
                                    <WhatsAppIcon />
                                </IconButton>
                                <IconButton color="inherit">
                                    <InstagramIcon />
                                </IconButton>
                                <IconButton color="inherit">
                                    <FacebookIcon />
                                </IconButton>
                                <IconButton color="inherit">
                                    <TwitterIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Sobre Nosotros
                            </Typography>
                            <Box>
                                <Link href="#" color="inherit" variant="body2">
                                    Legal
                                </Link>
                                <br />
                                <Link href="#" color="inherit" variant="body2">
                                    Términos
                                </Link>
                                <br />
                                <Link href="#" color="inherit" variant="body2">
                                    Políticas
                                </Link>
                                <br />
                                <Link href="#" color="inherit" variant="body2">
                                    Privacidad
                                </Link>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Soporte
                            </Typography>
                            <Box>
                                <Link href="#" color="inherit" variant="body2">
                                    Contactar Ayuda en Línea
                                </Link>
                                <br />
                                <Link href="#" color="inherit" variant="body2">
                                    Buzón de Sugerencias
                                </Link>
                                <br />
                                <Link href="#" color="inherit" variant="body2">
                                    Reglas de Trading
                                </Link>
                                <br />
                                <Link href="#" color="inherit" variant="body2">
                                    Centro de Soporte
                                </Link>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default MovimientoComerciar;
