import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../../services/UserService";
import { Box, Button, Container, CssBaseline, Grid, IconButton, Link, Menu, MenuItem, Typography } from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { AccountCircle } from "@mui/icons-material";
import { getVentasPendientes } from "../../../services/MovimientosServices";
import { getMonedaById } from "../../../services/MonedasService";

const VentasPendientes = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const [anchorEl, setAnchorEl] = useState(null);
    const [userName, setUserName] = useState('');
    const [correo, setCorreo] = useState('');
    
    const [ventasPendientes, setVentasPendientes] = useState([]);
    const [monedas, setMonedas] = useState({});

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo(token);
                console.log('User Info:', data);
                setUserName(data.nombre);
                setCorreo(data.correo);
                
            } catch (error) {
                console.error('Failed to fetch user info', error);
            }
        };

        if (token && username) {
            fetchUserInfo();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, username]);

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

    useEffect(() => {
        const fetchVentasPendientes = async () => {
            try {
                const ventasPendientes = await getVentasPendientes(token);
                setVentasPendientes(ventasPendientes);
                ventasPendientes.forEach(async (venta) => {
                    const coinName = await getMonedaById(token, venta.venta_moneda_id_fk);
                    setMonedas(prevMonedas => ({
                        ...prevMonedas,
                        [venta.venta_moneda_id_fk]: coinName.nombre,
                    }));
                });
            } catch (error) {
                console.error('Failed to fetch ventas pendientes', error);
            }
        }
        if(token) {
            fetchVentasPendientes();
        }
    }, [token]);

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
                    {ventasPendientes.map(venta => (
                        <Box key={venta.id} sx={{ mb: 3, p: 2, border: '1px solid #555', borderRadius: '4px', backgroundColor: '#444' }}>
                            <Typography variant="body1" sx={{ color: 'white' }}>Venta Id: {venta.id}</Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>Moneda: {monedas[venta.venta_moneda_id_fk]}</Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>Valor de Venta: {venta.valor_venta}</Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>Monto: {venta.monto}</Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>Billetera de Origen: {venta.venta_billetera_origen_id_fk}</Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>Método de Pago: {venta.metodo_pago}</Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>Estado: {venta.estado}</Typography>
                            <Button variant="contained" sx={{ mt: 2, backgroundColor: 'yellow', color: '#333' }}>Iniciar Compra</Button>
                        </Box>
                    ))}
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

export default VentasPendientes;
