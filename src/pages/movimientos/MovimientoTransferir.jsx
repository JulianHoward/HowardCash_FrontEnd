import { useState, useEffect } from 'react';
import { Box, CssBaseline, IconButton, Menu, MenuItem, Typography, Button, Grid, TextField, MenuItem as MuiMenuItem, Container, Link } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { fetchBeneficiarios, getUserInfo, getUsuarios } from '../../services/UserService';
import { getAllBilleteras, getUserBilleteras } from '../../services/BilleteraService';
import { validarExistenciaBeneficiario } from '../../services/BeneficiariosService';
import { transferirEntreBilleteras } from '../../services/MovimientosServices';
import { getMonedas } from '../../services/MonedasService';

const MovimientoTransferir = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const [anchorEl, setAnchorEl] = useState(null);
    const [userName, setUserName] = useState('');
    const [correo, setCorreo] = useState('');
    const [idUserSession, setIdUserSession] = useState('');
    const [billeterasOrigenFetch, setBilleterasOrigenFetch] = useState([]);
    const [billeterasDestinoFetch, setBilleterasDestinoFetch] = useState([]);
    const [beneficiarios, setBeneficiarios] = useState([]);
    const [selectedBeneficiario, setSelectedBeneficiario] = useState('');
    const [billeteraOrigen, setBilleteraOrigen] = useState('');
    const [billeteraDestino, setBilleteraDestino] = useState('');
    const [montoTransferencia, setMontoTransferencia] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo(token);
                setUserName(data.nombre);
                setCorreo(data.correo);
                setIdUserSession(data.id);
                const benefs = await fetchBeneficiarios(token);
                setBeneficiarios(benefs);
            } catch (error) {
                console.error('Failed to fetch user info', error);
            }
        };
        if (token && username) {
            fetchUserInfo();
        }
    }, [token, username]);

    useEffect(() => {
        const fetchBilleteras = async () => {
            try {
                const billeteras = await getUserBilleteras(token, idUserSession);
                setBilleterasOrigenFetch(billeteras);
            } catch (error) {
                console.error('Failed to fetch user billeteras', error);
            }
        };
        if (idUserSession) {
            fetchBilleteras();
        }
    }, [token, idUserSession]);

    useEffect(() => {
        const fetchAllBilleteras = async () => {
            try {
                const billeteras = await getAllBilleteras(token);
                setBilleterasDestinoFetch(billeteras);
            } catch (error) {
                console.error('Failed to fetch all billeteras', error);
            }
        };
        fetchAllBilleteras();
    }, [token]);

    useEffect(() => {
        const fetchAllDataDestino = async () => {
            try {
                const [billeteras, usuarios, monedas] = await Promise.all([
                    getAllBilleteras(token),
                    getUsuarios(token),
                    getMonedas(token)
                ]);
                const billeterasDestinoData = billeteras.map(billetera => {
                    const usuario = usuarios.find(user => user.id === billetera.billetera_usuario_id);
                    const moneda = monedas.find(moneda => moneda.id === billetera.billetera_moneda_id);
                    return {
                        ...billetera,
                        owner_billetera_name: usuario ? usuario.nombre : 'Desconocido',
                        monedaNombre: moneda ? moneda.nombre : 'Desconocido'
                    };
                });
                setBilleterasDestinoFetch(billeterasDestinoData)
            } catch (error) {
                console.error('Failed to fetch all data', error);
            }
        };
        fetchAllDataDestino();
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

    const handleTransferir = async () => {
        try {
            console.log('Token:', token);
            console.log('Billetera Origen ID:', billeteraOrigen);
            console.log('Monto Transferencia:', montoTransferencia);
            console.log('Selected Beneficiario ID:', selectedBeneficiario);
            const beneficiarioExists = await validarExistenciaBeneficiario(token, selectedBeneficiario);
            console.log('NO ENTIENDO YA selectedBenfe:', selectedBeneficiario)
            console.log('Beneficiario Exists:', beneficiarioExists);
            if (!beneficiarioExists) {
                console.error('Beneficiario no existe');
                return;
            }

            // Transferir entre billeteras
            console.log("Token:", token);
            console.log("Billetera Origen:", billeteraOrigen);
            console.log("Billetera Destino:", billeteraDestino);
            console.log("Selected Beneficiario ID antes de transferir:", selectedBeneficiario);
            console.log("Monto Transferencia:", montoTransferencia);
            const rr = await transferirEntreBilleteras(token, billeteraOrigen, billeteraDestino, montoTransferencia, selectedBeneficiario);
            console.log('Transferencia realizada:', rr);
            navigate('/homepage');
        } catch (error) {
            console.error('Error al transferir fondos:', error);
            alert('Hubo un error al transferir fondos. Por favor intenta nuevamente más tarde.');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#333' }}>
            <CssBaseline />
            <Container component="main" sx={{ mt: 8, mb: 2, color: 'white' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'yellow' }}>
                    Welcome to HowardCash
                </Typography>
                <Typography variant="h6" sx={{ color: 'yellow' }}>
                    {`Hello, ${userName}!`}
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
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            required
                            id="beneficiario"
                            label="Seleccionar Beneficiario"
                            variant="outlined"
                            value={selectedBeneficiario}
                            onChange={(e) => setSelectedBeneficiario(e.target.value)}
                        >
                            {beneficiarios.map((beneficiario) => (
                                <MenuItem key={beneficiario.id} value={beneficiario.id}>
                                    {beneficiario.nombre_referencia}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            required
                            id="billetera"
                            label="Billetera de Origen"
                            variant="outlined"
                            value={billeteraOrigen}
                            onChange={(e) => setBilleteraOrigen(e.target.value)}
                        >
                            {billeterasOrigenFetch.map(billetera => (
                                <MuiMenuItem key={billetera.id} value={billetera.id}>
                                    {`${billetera.owner_billetera_name} - ${billetera.monedaNombre}`}
                                </MuiMenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            required
                            id="billeteraDestino"
                            label="Billetera de Destino"
                            variant="outlined"
                            value={billeteraDestino}
                            onChange={(e) => setBilleteraDestino(e.target.value)}
                        >
                            {billeterasDestinoFetch.map(billetera => (
                                <MuiMenuItem key={billetera.id} value={billetera.id}>
                                    {`${billetera.owner_billetera_name} - ${billetera.monedaNombre}`}
                                </MuiMenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            id="monto"
                            label="Monto a Transferir"
                            variant="outlined"
                            value={montoTransferencia}
                            onChange={(e) => setMontoTransferencia(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={handleTransferir}
                            sx={{ mt: 2, backgroundColor: 'yellow', color: 'black' }}
                        >
                            Transferir
                        </Button>
                    </Grid>
                </Grid>

                <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ position: 'fixed', bottom: '2rem', right: '2rem' }}
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
                    <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                </Menu>
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

export default MovimientoTransferir;
