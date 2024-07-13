import { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, IconButton, Link } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { getUserInfo } from '../../services/UserService';
import { getMonedas } from '../../services/MonedasService';
import { getUserBilleteras, createBilletera } from '../../services/BilleteraService';

const FormCreateBilletera = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [userName, setUserName] = useState('');
    const [idUserSession, setIdUserSession] = useState('');
    const [monedas, setMonedas] = useState([]);
    const [monedaId, setMonedaId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userInfo = await getUserInfo(token);
            setUserName(userInfo.nombre);
            setIdUserSession(userInfo.id);
        };

        if (token) {
            fetchUserInfo();
        }
    }, [token]);

    useEffect(() => {
        const fetchMonedasFromApi = async () => {
            try {
                const data = await getMonedas(token);
                setMonedas(data);
            } catch (error) {
                console.error('Error fetching monedas:', error);
            }
        };

        if (token) {
            fetchMonedasFromApi();
        }
    }, [token]);

    const handleCreateWallet = async () => {
        try {
            // Fetch user's existing wallets
            const billeteras = await getUserBilleteras(token, idUserSession);
            const alreadyExists = billeteras.some(billetera => billetera.billetera_moneda_id === monedaId);

            if (alreadyExists) {
                setError('Ya tienes una billetera con esta moneda.');
                return;
            }

            await createBilletera(token, idUserSession, monedaId);
            navigate('/homepage');
        } catch (error) {
            console.error('Error al crear la billetera:', error);
            setError('Error al crear la billetera.');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#333', color: 'white' }}>
            <Container component="main" sx={{ mt: 8, mb: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'yellow' }}>
                    Bienvenido a HowardCash
                </Typography>
                <Typography variant="h6" sx={{ color: 'yellow' }}>
                    {`Hello, ${userName}!`}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, color: 'yellow' }}>
                    Crear nueva billetera
                </Typography>
                {error && (
                    <Typography variant="body1" sx={{ color: 'red' }}>
                        {error}
                    </Typography>
                )}
                <Card sx={{ backgroundColor: '#444', color: 'white', marginTop: '20px' }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                    Selecciona la moneda:
                                </Typography>
                                <select
                                    value={monedaId}
                                    onChange={(e) => setMonedaId(e.target.value)}
                                    style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                                >
                                    <option value="">Seleccione una moneda</option>
                                    {monedas.map((moneda) => (
                                        <option key={moneda.id} value={moneda.id}>
                                            {moneda.nombre}
                                        </option>
                                    ))}
                                </select>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreateWallet}
                    style={{ marginTop: '20px' }}
                >
                    Crear nueva billetera
                </Button>
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

export default FormCreateBilletera;
