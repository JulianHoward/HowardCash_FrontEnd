import { useEffect, useState } from 'react';
import { Box, Container, CssBaseline, Typography, IconButton, Menu, MenuItem, Card, CardContent, Grid, Link, Button, ButtonBase } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SendIcon from '@mui/icons-material/Send';
import { getUserInfo } from '../services/UserService';
import { getUserBilleteras } from '../services/BilleteraService';

const Homepage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const [anchorEl, setAnchorEl] = useState(null);
    const [userName, setUserName] = useState('');
    const [correo, setCorreo] = useState('');
    const [idUserSession, setIdUserSession] = useState('');
    const [wallets, setWallets] = useState([]);
    const [chartData] = useState([
        { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
        { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
        { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
        { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
        { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
        { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
    ]);

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

    useEffect(() => {
        const fetchUserBilletera = async () => {
            try {
                const billeteraMonedaInfo = await getUserBilleteras(token, idUserSession);
                console.log('Filtered User Wallets with Moneda Info:', billeteraMonedaInfo);
                setWallets(billeteraMonedaInfo);
            } catch (error) {
                console.error('Failed to fetch user wallets', error);
            }
        };
        if(idUserSession) {
            fetchUserBilletera();
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

    const handleCreateWallet = () => {
        navigate('/billetera/FormCreateBilletera')
    };

    const handleMoveDepositar = () => {
        navigate('/billetera/FormDepositar')
    }

    const handleMoveRetirar = () => {
        navigate('/billetera/FormRetirar')
    }

    const handleMoveTransferir = () => {
        navigate('/billetera/FormTransferir')
    }

    const handleMoveComerciar = () => {
        navigate('/billetera/FormComerciar')
    }

    const handleWalletClick = (id) => {
        navigate(`/billetera/movimientosById/${id}`);   
    }

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
                <ResponsiveContainer width="100%" height={400} style={{ marginTop: '20px' }}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                        <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                    <Typography variant="h5" component="h2" sx={{ color: 'yellow', flexGrow: 1 }}>
                        Mis Billeteras
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreateWallet}
                        sx={{ backgroundColor: 'yellow', color: 'black' }}
                    >
                        Crear Nueva Billetera
                    </Button>
                </Box>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {wallets.length > 0 ? (
                        wallets.map((billetera) => (
                            <Grid item xs={12} sm={6} md={4} key={billetera.id}>
                                <ButtonBase onClick={() => handleWalletClick(billetera.id)} sx={{ width: '100%' }}>
                                    <Card sx={{ backgroundColor: '#444', color: 'white', width: '100%', textAlign: 'left' }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                                                {`Wallet ID: ${billetera.codigo_uuid}`}
                                            </Typography>
                                            <Typography variant="body1">
                                                {`Moneda: ${billetera.monedaNombre}`}
                                            </Typography>
                                            <Typography variant="body1">
                                                {`Saldo: ${billetera.saldo}`}
                                            </Typography>
                                            <Typography variant="body1">
                                                {`Valor en USD: ${billetera.valorUSD !== undefined ? billetera.valorUSD : 0}`}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </ButtonBase>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ color: 'yellow', fontSize: '1.2rem', textAlign: 'center', marginTop: '20px' }}>
                            No tienes billeteras.
                        </Typography>
                    )}
                </Grid>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component="h2" sx={{ color: 'yellow', mb: 2 }}>
                        Movimientos
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleMoveDepositar}
                                startIcon={<AccountBalanceWalletIcon />}
                                sx={{ backgroundColor: 'yellow', color: 'black' }}
                            >
                                Depositar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleMoveRetirar}
                                startIcon={<AttachMoneyIcon />}
                                sx={{ backgroundColor: 'yellow', color: 'black' }}
                            >
                                Retirar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleMoveComerciar}
                                startIcon={<SwapHorizIcon />}
                                sx={{ backgroundColor: 'yellow', color: 'black' }}
                            >
                                Comerciar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleMoveTransferir}
                                startIcon={<SendIcon />}
                                sx={{ backgroundColor: 'yellow', color: 'black' }}
                            >
                                Transferir
                            </Button>
                        </Grid>
                    </Grid>
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

export default Homepage;
