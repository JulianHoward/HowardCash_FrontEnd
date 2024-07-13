import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postMoneda } from "../../services/MonedasService";
import { Box, Button, Container, CssBaseline, TextField, Typography } from "@mui/material";


const FormMonedas = () => {
    const [nombre, setNombre] = useState('');
    const [simbolo, setSimbolo] = useState('');
    const [valor_usd, setValorUSD] = useState('');
    const navigate = useNavigate();

    const handleNombreChange = (e) => setNombre(e.target.value);
    const handleSimboloChange = (e) => setSimbolo(e.target.value);
    const handleValorUSDChange = (e) => setValorUSD(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const moneda = {
            nombre,
            simbolo,
            valor_usd
        };

        try {
            const response = await postMoneda(token, moneda);
            console.log('Moneda creada:', response);
            navigate('/admin/monedas');
        } catch (error) {
            console.error('Error al crear la moneda:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#333' }}>
            <CssBaseline />
            <Container component="main" sx={{ mt: 8, mb: 2, color: 'white' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'yellow' }}>
                    Crear Nueva Moneda
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="nombre"
                        label="Nombre"
                        name="nombre"
                        autoComplete="nombre"
                        autoFocus
                        value={nombre}
                        onChange={handleNombreChange}
                        sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'yellow' }, '&.Mui-focused fieldset': { borderColor: 'yellow' } } }}
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="simbolo"
                        label="Símbolo"
                        name="simbolo"
                        autoComplete="simbolo"
                        value={simbolo}
                        onChange={handleSimboloChange}
                        sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'yellow' }, '&.Mui-focused fieldset': { borderColor: 'yellow' } } }}
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="valorUsd"
                        label="Valor en USD"
                        name="valorUsd"
                        autoComplete="valorUsd"
                        value={valor_usd}
                        onChange={handleValorUSDChange}
                        sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'yellow' }, '&.Mui-focused fieldset': { borderColor: 'yellow' } } }}
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, backgroundColor: 'yellow', color: 'black', '&:hover': { backgroundColor: 'darkyellow' } }}
                    >
                        Crear Moneda
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default FormMonedas;
