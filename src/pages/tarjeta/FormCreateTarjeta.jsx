import { AccountCircle, Add } from "@mui/icons-material";
import { Box, CssBaseline, IconButton, Menu, MenuItem, Typography, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../services/UserService";
import { createTarjeta, validarTarjeta } from "../../services/TarjetaService";
import { Container } from "react-bootstrap";

const FormCreateTarjeta = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const [anchorEl, setAnchorEl] = useState(null);
    const [userName, setUserName] = useState('');
    const [correo, setCorreo] = useState('');
    const [idUserSession, setIdUserSession] = useState('');
    const [numero, setNumero] = useState('');
    const [cvv, setCvv] = useState('');
    const [fechaVencimiento, setFechaVencimiento] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo(token);
                console.log('User Info:', data);
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

    const handleCreateCard = async (event) => {
        event.preventDefault();
        if (!validarTarjeta(numero)) {
            alert('Número de tarjeta inválido');
            return;
        }
        try {
            await createTarjeta(token, idUserSession, numero, cvv, fechaVencimiento);
            navigate('/billetera/FormDepositar');
        } catch (error) {
            console.error('Failed to create tarjeta', error);
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
                <Box component="form" onSubmit={handleCreateCard} sx={{ mt: 4, backgroundColor: '#444', padding: 3, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ color: 'yellow', mb: 2 }}>
                        Crear Nueva Tarjeta
                    </Typography>
                    <TextField
                        fullWidth
                        variant="filled"
                        label="Número de Tarjeta"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        required
                        sx={{ mb: 2, backgroundColor: 'white', borderRadius: 1 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        label="CVV"
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                        sx={{ mb: 2, backgroundColor: 'white', borderRadius: 1 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        label="Fecha de Vencimiento"
                        value={fechaVencimiento}
                        onChange={(e) => setFechaVencimiento(e.target.value)}
                        required
                        sx={{ mb: 2, backgroundColor: 'white', borderRadius: 1 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        sx={{ backgroundColor: 'yellow', color: 'black' }}
                    >
                        Crear Tarjeta
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default FormCreateTarjeta;
