
import { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../services/UserService';
import { createCuentaBancaria } from '../../services/CuentasBancariasService';
import { getMonedas } from '../../services/MonedasService';

const CrearCuenta = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [usuarioId, setUsuarioId] = useState('');
    const [nombre, setNombre] = useState('');
    const [numero, setNumero] = useState('');
    const [tipo, setTipo] = useState('');
    const [documentoIdentidad, setDocumentoIdentidad] = useState('');
    const [banco, setBanco] = useState('');
    const [moneda, setMoneda] = useState('');
    const [monedas, setMonedas] = useState([]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo(token);
                setUsuarioId(data.id);
            } catch (error) {
                console.error('Failed to fetch user info', error);
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

        if (token) {
            fetchUserInfo();
            fetchMonedas();
        }
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const cuentaData = {
            usuario_id_fk: usuarioId,
            nombre_titular: nombre,
            numero_cuenta: numero,
            tipo,
            documento_identidad: documentoIdentidad,
            banco,
            moneda_id_fk: moneda,
        };

        try {
            await createCuentaBancaria(token, cuentaData);
            alert('Cuenta bancaria creada exitosamente');
            navigate('/billetera/FormRetirar');
        } catch (error) {
            console.error('Error al crear cuenta bancaria', error);
            alert('Error al crear cuenta bancaria');
        }
    };

    const handleCancel = () => {
        navigate('/movimiento-retirar');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#333', color: 'white' }}>
            <CssBaseline />
            <Container component="main" sx={{ mt: 8, mb: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'yellow' }}>
                    Crear Nueva Cuenta Bancaria
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Nombre del Titular"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Número de Cuenta"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Documento de Identidad"
                        value={documentoIdentidad}
                        onChange={(e) => setDocumentoIdentidad(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Banco"
                        value={banco}
                        onChange={(e) => setBanco(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="select-moneda">Moneda</InputLabel>
                        <Select
                            labelId="select-moneda"
                            id="select-moneda"
                            value={moneda}
                            onChange={(e) => setMoneda(e.target.value)}
                            fullWidth
                            required
                        >
                            {monedas.map((moneda) => (
                                <MenuItem key={moneda.id} value={moneda.id}>
                                    {moneda.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="select-tipo">Tipo de Cuenta</InputLabel>
                        <Select
                            labelId="select-tipo"
                            id="select-tipo"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            fullWidth
                            required
                        >
                            <MenuItem value="corriente">Corriente</MenuItem>
                            <MenuItem value="ahorros">Ahorros</MenuItem>
                            <MenuItem value="nomina">Nómina</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, backgroundColor: '#f0ad4e', color: 'black' }}>
                        Crear Cuenta Bancaria
                    </Button>
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleCancel}>
                        Cancelar
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default CrearCuenta;
