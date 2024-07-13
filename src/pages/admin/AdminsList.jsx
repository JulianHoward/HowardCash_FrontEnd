import { Box, Button, Container, CssBaseline, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAdmin, getAdmins } from "../../services/AdminService";


const AdminsList = () => {
    const [admins, setAdmins] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const data = await getAdmins(token);
                setAdmins(data);
            } catch (error) {
                console.error('Error al obtener los admins:', error);
            }
        };
        if(token) {
            fetchAdmins();
        }
    }, [token]);

    const handleDelete = async (id) => {
        try {
            await deleteAdmin(token, id);
            setAdmins(admins.filter(admin => admin.id !== id));
        } catch (error) {
            console.error('Error al eliminar el admin:', error);
        }
    }

    const handleUpdate = (id) => {
        navigate(`/admin/update/${id}`);
    }

    const handleCreate = () => {
        navigate('/admin/create-new-admin');
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#333' }}>
            <CssBaseline />
            <Container component="main" sx={{ mt: 8, mb: 2, color: 'white' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'yellow' }}>
                    Lista de Administradores
                </Typography>
                <TableContainer component={Paper} sx={{ backgroundColor: '#444' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                                <TableCell sx={{ color: 'white' }}>Apellido</TableCell>
                                <TableCell sx={{ color: 'white' }}>Correo</TableCell>
                                <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {admins.map(admin => (
                                <TableRow key={admin.id}>
                                    <TableCell sx={{ color: 'white' }}>{admin.nombre}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{admin.apellido}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{admin.correo}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleUpdate(admin.id)} sx={{ mr: 2 }}>
                                            Actualizar
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDelete(admin.id)}>
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button variant="contained" color="success" onClick={handleCreate} sx={{ mt: 2 }}>
                    Crear Nuevo Administrador
                </Button>
            </Container>
        </Box>
    );
};

export default AdminsList;
