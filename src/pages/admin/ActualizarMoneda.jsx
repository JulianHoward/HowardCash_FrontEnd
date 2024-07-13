import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMonedaById, updateMoneda } from "../../services/MonedasService";
import { Box, Button, Container, CssBaseline, TextField, Typography } from "@mui/material";


const ActualizarMoneda = () => {
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [simbolo, setSimbolo] = useState('');
    const [valor_usd, setValorUSD] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMoneda = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await getMonedaById(token, id);
                setNombre(response.nombre);
                setSimbolo(response.simbolo);
                setValorUSD(response.valor_usd);
            } catch (error) {
                console.error('Error al obtener la moneda:', error);
          }
        };
        fetchMoneda();
    }, [id]);

    const handleNombreChange = (e) => setNombre(e.target.value);
    const handleSimboloChange = (e) => setSimbolo(e.target.value);
    const handleValorUSDChange = (e) => setValorUSD(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await updateMoneda(token, id, { nombre, simbolo, valor_usd });
            navigate('/admin/monedas');
        } catch (error) {
            console.error('Error al actualizar la moneda:', error);
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#333' }}>
            <CssBaseline />
            <Container component="main" sx={{ mt: 8, mb: 2, color: 'white' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'yellow' }}>
                    Actualizar Moneda
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
                        Actualizar Moneda
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default ActualizarMoneda;
