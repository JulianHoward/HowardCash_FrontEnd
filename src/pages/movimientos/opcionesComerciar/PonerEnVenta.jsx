import { useEffect, useState } from "react";
import { getUserInfo } from "../../../services/UserService";
import { useNavigate } from "react-router-dom";
import { getUserBilleteras } from "../../../services/BilleteraService";
import { Box, Button, Container, CssBaseline, FormControl, IconButton, InputLabel, Menu, MenuItem, Select, TextField, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { postVenta } from "../../../services/MovimientosServices";


const PonerEnVenta = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const [anchorEl, setAnchorEl] = useState(null);
    const [userName, setUserName] = useState('');
    const [correo, setCorreo] = useState('');
    const [wallets, setWallets] = useState([]);
    const [selectedWalletId, setSelectedWalletId] = useState('');
    const [valorVenta, setValorVenta] = useState('');
    const [monto, setMonto] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [idUserSession, setIdUserSession] = useState('');

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
        const fetchBilleteras = async () => {
            try {
                const billeteras = await getUserBilleteras(token, idUserSession);
                setWallets(billeteras);
            } catch (error) {
                console.error('Failed to fetch user billeteras', error);
            }
        };
        if (idUserSession) {
            fetchBilleteras();
        }
    }, [token, idUserSession]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const selectedWallet = wallets.find(wallet => wallet.id === selectedWalletId);
            const venta = {
                venta_moneda_id_fk: selectedWallet.billetera_moneda_id,
                valor_venta: valorVenta,
                monto,
                venta_billetera_origen_id_fk: selectedWalletId,
                metodo_pago: metodoPago,
                estado: 'Pendiente',
            };
            console.log('Venta:', venta);
            console.log('Billetera seleccionada:', selectedWallet)
            await postVenta(token, venta);
            navigate('/billetera/FormComerciar');
        } catch (error) {
            console.error('Failed to post venta', error);
        }
    }

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
                <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
                    Poner en venta
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="wallet-label" sx={{ color: 'white' }}>Billetera de Origen</InputLabel>
                        <Select
                            labelId="wallet-label"
                            id="wallet"
                            value={selectedWalletId}
                            label="Billetera de Origen"
                            onChange={(e) => setSelectedWalletId(e.target.value)}
                            sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
                        >
                            {wallets.map(wallet => (
                                <MenuItem key={wallet.id} value={wallet.id}>
                                    {wallet.billetera_usuario_id}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Valor de Venta"
                        variant="outlined"
                        value={valorVenta}
                        onChange={(e) => setValorVenta(e.target.value)}
                        sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
                    />
                    <TextField
                        fullWidth
                        label="Monto"
                        variant="outlined"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
                    />
                    <TextField
                        fullWidth
                        label="Método de Pago"
                        variant="outlined"
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: 'yellow', color: '#333' }}>
                        Publicar Venta
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default PonerEnVenta;
