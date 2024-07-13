import { AccountCircle, Add } from "@mui/icons-material";
import { Box, CssBaseline, IconButton, Menu, MenuItem, Typography, Card, CardContent, Button, Grid, TextField, Select, MenuItem as MuiMenuItem, FormControl, InputLabel, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import visaLogo from '../../assets/visa-logo.png';
import { getUserInfo } from "../../services/UserService";
import { getUserTarjetas } from "../../services/TarjetaService";
import { createMovimiento } from "../../services/MovimientosServices";
import { getUserBilleteras } from "../../services/BilleteraService";

const MovimientoDepositar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const [anchorEl, setAnchorEl] = useState(null);
    const [userName, setUserName] = useState('');
    const [correo, setCorreo] = useState('');
    const [idUserSession, setIdUserSession] = useState('');
    const [tarjetas, setTarjetas] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [billeteras, setBilleteras] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [tipoTransaccion] = useState('Ingreso');
    const [movimientoBilleteraDestinoId, setMovimientoBilleteraDestinoId] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo(token);
                setUserName(data.nombre);
                setCorreo(data.correo);
                setIdUserSession(data.id);
            } catch (error) {
                console.error('Failed to fetch user info', error);
            }
        };

        if (token && username) {
            fetchUserInfo();
        }
    }, [token, username]);

    useEffect(() => {
        const fetchUserTarjetas = async () => {
            try {
                const tarjetas = await getUserTarjetas(token, idUserSession);
                setTarjetas(tarjetas);
            } catch (error) {
                console.error('Failed to fetch user tarjetas', error);
            }
        };
        if (idUserSession) {
            fetchUserTarjetas();
        }
    }, [token, idUserSession]);

    useEffect(() => {
        const fetchBilleteras = async () => {
            try {
                const billeteras = await getUserBilleteras(token, idUserSession);
                setBilleteras(billeteras);
            } catch (error) {
                console.error('Failed to fetch user billeteras', error);
            }
        };
        if (idUserSession) {
            fetchBilleteras();
        }
    }, [token, idUserSession]);

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

    const handleCreateCard = () => {
        navigate('/crearTarjeta');
    };

    const handleCardClick = (card) => {
        setSelectedCard(selectedCard === card.id ? null : card.id);
    };

    const handleSubmitMovimiento = async (event) => {
        event.preventDefault();
        try {
            const movimiento = {
                descripcion,
                movimiento_billetera_origen_id: selectedCard,
                monto,
                tipo_transaccion: tipoTransaccion,
                movimiento_billetera_destino_id: movimientoBilleteraDestinoId
            };
            await createMovimiento(token, movimiento);
            alert('Movimiento creado exitosamente');
            setSelectedCard(null);
        } catch (error) {
            console.error('Failed to create movimiento', error);
            alert('Error al crear el movimiento');
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
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ color: 'yellow', mb: 2 }}>
                        Tus Tarjetas
                    </Typography>
                    <Grid container spacing={2}>
                        {tarjetas.map((tarjeta) => (
                            <Grid item xs={12} sm={6} md={4} key={tarjeta.id}>
                                <Card 
                                    sx={{ backgroundColor: '#444', color: 'white', borderRadius: 2, padding: 2 }}
                                    onClick={() => handleCardClick(tarjeta)}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <img src={visaLogo} alt="Visa Logo" style={{ width: '50px' }} />
                                            <Typography variant="h6" sx={{ color: 'yellow' }}>VISA</Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ mb: 2, letterSpacing: 2 }}>
                                            {`${tarjeta.numero.substring(0, 4)} ${tarjeta.numero.substring(4, 8)} ${tarjeta.numero.substring(8, 12)} ${tarjeta.numero.substring(12, 16)}`}
                                        </Typography>
                                        <Typography variant="body2">
                                            {`Vencimiento: ${tarjeta.fecha_vencimiento}`}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    {selectedCard && (
                        <Box 
                            sx={{ 
                                position: 'fixed', 
                                top: '50%', 
                                left: '50%', 
                                transform: 'translate(-50%, -50%)', 
                                backgroundColor: '#444', 
                                padding: 4, 
                                borderRadius: 2, 
                                zIndex: 1300 
                            }}
                        >
                            <form onSubmit={handleSubmitMovimiento}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    variant="filled"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    sx={{ mb: 2, backgroundColor: '#555' }}
                                    InputLabelProps={{ style: { color: 'yellow' } }}
                                />
                                <TextField
                                    fullWidth
                                    label="Monto"
                                    variant="filled"
                                    type="number"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    sx={{ mb: 2, backgroundColor: '#555' }}
                                    InputLabelProps={{ style: { color: 'yellow' } }}
                                />
                                <FormControl fullWidth sx={{ mb: 2, backgroundColor: '#555' }}>
                                    <InputLabel id="select-tarjeta">Seleccionar Billetera</InputLabel>
                                    <Select
                                        labelId="select-tarjeta"
                                        id="select-tarjeta"
                                        value={movimientoBilleteraDestinoId}
                                        onChange={(e) => setMovimientoBilleteraDestinoId(e.target.value)}
                                        sx={{ color: 'white' }}
                                    >
                                        {billeteras.map(billetera => (
                                            <MuiMenuItem key={billetera.id} value={billetera.id}>
                                                {`${billetera.owner_billetera_name} - ${billetera.monedaNombre}`}
                                            </MuiMenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, backgroundColor: 'yellow', color: 'black' }}
                                >
                                    Crear Movimiento
                                </Button>
                            </form>
                        </Box>
                    )}
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button 
                            variant="contained" 
                            sx={{ backgroundColor: 'yellow', color: 'black' }}
                            startIcon={<Add />}
                            onClick={handleCreateCard}
                        >
                            Agregar nueva tarjeta
                        </Button>
                    </Box>
                    {!tarjetas.length && (
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                                No tienes tarjetas agregadas.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default MovimientoDepositar;
