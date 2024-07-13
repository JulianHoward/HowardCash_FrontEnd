import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { postRegister } from '../../services/AuthService';

const Copyright = (props) => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                HowardCash
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

const RegisterForm = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});

    const enviarDatos = (e) => {
        const form = e.currentTarget;
        let isValid = form.checkValidity();

        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        const newErrors = {
            password: {}
        };
        if (!password) {
            newErrors.password.emptyPassword = 'La contraseña es requerida';
        } else {
            if (password.length < 5) {
                newErrors.password.passwordLength = 'La contraseña debe tener al menos 5 caracteres';
            }
            const passwordRegex = new RegExp(/^(?=.*[!@#%$])/);
            if (!passwordRegex.test(password)) {
                newErrors.password.passwordSymbols = 'La contraseña debe contener al menos uno de los siguientes símbolos: !@#%$';
            }
            const upperCaseRegex = new RegExp(/^(?=.*[A-Z])/);
            if (!upperCaseRegex.test(password)) {
                newErrors.password.passwordUpperCase = 'La contraseña debe contener al menos una letra mayúscula';
            }
            const lowerCaseRegex = new RegExp(/^(?=.*[a-z])/);
            if (!lowerCaseRegex.test(password)) {
                newErrors.password.passwordLowerCase = 'La contraseña debe contener al menos una letra minúscula';
            }
            const numberRegex = new RegExp(/^(?=.*[0-9])/);
            if (!numberRegex.test(password)) {
                newErrors.password.passwordNumber = 'La contraseña debe contener al menos un número';
            }
        }

        if (Object.keys(newErrors.password).length === 0) {
            delete newErrors.password;
        } else {
            isValid = false;
        }
        if (!isValid) {
            setErrors(newErrors);
            console.log('Formulario inválido', newErrors);
            return;
        }

        doRegister();
    }

    const doRegister = () => {
        const credentials = {
            nombre,
            apellido,
            correo,
            password
        }

        postRegister(credentials)
            .then(() => {
                navigate('/login');
            }).catch((err) => {
                console.log(err)
                if (err.response.status === 400) {
                    setErrors({ ...errors, formError: err.response.data.message });
                }
            });
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Registro
                    </Typography>
                    <Box component="form" noValidate validated={validated} onSubmit={enviarDatos} sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="nombre"
                                    name="nombre"
                                    required
                                    fullWidth
                                    id="nombre"
                                    label="Nombre"
                                    autoFocus
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="apellido"
                                    name="apellido"
                                    required
                                    fullWidth
                                    id="apellido"
                                    label="Apellido"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="correo"
                                    name="correo"
                                    required
                                    fullWidth
                                    id="correo"
                                    label="Correo"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={!!errors.password}
                                    helperText={errors.password && Object.values(errors.password).join(', ')}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Registrarse
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    ¿Ya tienes una cuenta? Inicia sesión
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default RegisterForm;
