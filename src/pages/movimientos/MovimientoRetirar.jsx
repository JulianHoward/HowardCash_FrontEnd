import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, CssBaseline, IconButton, Menu, MenuItem, Typography, TextField, Button, FormControl, InputLabel, Select } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { getUserInfo, getUsuarioById } from '../../services/UserService';
import { getCuentasBancariasUser, retirar } from '../../services/CuentasBancariasService';
import { getMonedaById, getMonedas } from '../../services/MonedasService';
import { getUserBilleteras } from '../../services/BilleteraService';

const MovimientoRetirar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const [userName, setUserName] = useState('');
    const [correo, setCorreo] = useState('');
    const [idUserSession, setIdUserSession] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [usuarios, setUsuarios] = useState({});
    const [nombresMonedas, setNombresMonedas] = useState({});

    const [cuentasBancarias, setCuentasBancarias] = useState([]);
    const [cuentaSeleccionada, setCuentaSeleccionada] = useState('');
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [monedas, setMonedas] = useState([]);
    const [billeteras, setBilleteras] = useState([]);
    const [billeteraSeleccionada, setBilleteraSeleccionada] = useState('');

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
        const fetchCuentasBancarias = async () => {
            try {
                const cuentas = await getCuentasBancariasUser(token, idUserSession);
                setCuentasBancarias(cuentas);
                console.log("datos que bota", cuentas);
            } catch (error) {
                console.error('Failed to fetch cuentas bancarias', error);
            }
        };

        const fetchMonedas = async () => {
            try {
                const monedasData = await getMonedas(token);
                setMonedas(monedasData);
            } catch (error) {
                console.error('Failed to fetch monedas', error);
            }
        };

        const fetchBilleteras = async () => {
            try {
                const billeterasData = await getUserBilleteras(token, idUserSession);
                setBilleteras(billeterasData);
        
                const usuarioIds = [...new Set(billeterasData.map(billetera => billetera.billetera_usuario_id))];
                const monedaIds = [...new Set(billeterasData.map(billetera => billetera.billetera_moneda_id))];
        
                const [usuarios, monedas] = await Promise.all([
                    Promise.all(usuarioIds.map(id => getUsuarioById(token, id))),
                    Promise.all(monedaIds.map(id => getMonedaById(token, id))),
                ]);
        
                const usuariosTemp = usuarios.reduce((acc, usuario) => {
                    acc[usuario.id] = usuario.nombre;
                    return acc;
                }, {});
        
                const monedasTemp = monedas.reduce((acc, moneda) => {
                    acc[moneda.id] = moneda.nombre;
                    return acc;
                }, {});
        
                setUsuarios(usuariosTemp);
                setNombresMonedas(monedasTemp);
            } catch (error) {
                console.error('Failed to fetch billeteras', error);
            }
        };
        

        if (token && idUserSession) {
            fetchCuentasBancarias();
            fetchMonedas();
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

    const handleSubmitRetiro = async (event) => {
        event.preventDefault();
        try {
            await retirar(token, {
                descripcion,
                cuentaSeleccionada,
                monto,
                billeteraSeleccionada,
            });
            navigate('/homepage');
        } catch (error) {
            console.error('Error al retirar:', error);
        }
    };

    const handleCrearCuenta = () => {
        navigate('/crear-cuenta');
    };

    const getMonedaNombre = (monedaId) => {
        const moneda = monedas.find((m) => m.id === monedaId);
        return moneda ? moneda.nombre : 'Desconocida';
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

                <Box component="form" onSubmit={handleSubmitRetiro} sx={{ mt: 2 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="select-cuenta">Seleccionar Cuenta Bancaria</InputLabel>
                        <Select
                            labelId="select-cuenta"
                            id="select-cuenta"
                            value={cuentaSeleccionada}
                            onChange={(e) => setCuentaSeleccionada(e.target.value)}
                            fullWidth
                            required
                        >
                            {cuentasBancarias.map((cuenta) => (
                                <MenuItem key={cuenta.id} value={cuenta.id}>
                                    {`${cuenta.nombre_titular} - ${cuenta.banco} - ${getMonedaNombre(cuenta.moneda_id_fk)}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="select-billetera">Seleccionar Billetera Destino</InputLabel>
                        <Select
                            labelId="select-billetera"
                            id="select-billetera"
                            value={billeteraSeleccionada}
                            onChange={(e) => setBilleteraSeleccionada(e.target.value)}
                            fullWidth
                            required
                        >
                            {billeteras.map((billetera) => (
                                <MenuItem key={billetera.id} value={billetera.id}>
                                    {`${usuarios[billetera.billetera_usuario_id]} - ${nombresMonedas[billetera.billetera_moneda_id]}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Monto a Retirar"
                        type="number"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        multiline
                        rows={4}
                        required
                        sx={{ mb: 2 }}
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Realizar Retiro
                    </Button>
                </Box>

                <Typography variant="h6" sx={{ mt: 4 }}>
                    No tienes una cuenta bancaria?
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Crea una cuenta bancaria para poder realizar retiros.
                </Typography>
                <Button variant="contained" onClick={handleCrearCuenta} sx={{ mt: 2 }}>
                    Crear Cuenta Bancaria
                </Button>
            </Container>
        </Box>
    );
};

export default MovimientoRetirar;
