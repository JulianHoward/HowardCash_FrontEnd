import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteMoneda, getMonedas } from "../../services/MonedasService";
import { Box, Button, Container, CssBaseline, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";


const MonedasList = () => {
    const [monedas, setMonedas] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchMonedas = async () => {
            try {
                const data = await getMonedas(token);
                setMonedas(data);
            } catch (error) {
                console.error('Error al obtener las monedas:', error);
            }
        };
        if(token) {
            fetchMonedas();
        }
    }, [token]);

    const handleDelete = async (id) => {
        try {
            await deleteMoneda(token, id);
            setMonedas(monedas.filter(moneda => moneda.id !== id));
        } catch (error) {
            console.error('Error al eliminar la moneda:', error);
        }
    };

    const handleUpdate = (id) => {
        navigate(`/admin/monedas/${id}`);
    };

    const handleCreate = () => {
        navigate('/admin/monedas/crear');
    };

    const handleNavigateToAdmins = () => {
        navigate('/admin/admins-crud');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#333' }}>
            <CssBaseline />
            <Container component="main" sx={{ mt: 8, mb: 2, color: 'white' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'yellow' }}>
                    Lista de Monedas
                </Typography>
                <TableContainer component={Paper} sx={{ backgroundColor: '#444' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                                <TableCell sx={{ color: 'white' }}>Símbolo</TableCell>
                                <TableCell sx={{ color: 'white' }}>Valor USD</TableCell>
                                <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {monedas.map(moneda => (
                                <TableRow key={moneda.id}>
                                    <TableCell sx={{ color: 'white' }}>{moneda.nombre}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{moneda.simbolo}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{moneda.valor_usd}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleUpdate(moneda.id)} sx={{ mr: 2 }}>
                                            Actualizar
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDelete(moneda.id)}>
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button variant="contained" color="success" onClick={handleCreate} sx={{ mt: 2 }}>
                    Crear Nueva Moneda
                </Button>
                <Button variant="contained" color="info" onClick={handleNavigateToAdmins} sx={{ mt: 2 }}>
                    Ver CRUD de Administradores
                </Button>
            </Container>
        </Box>
    );
};

export default MonedasList;
