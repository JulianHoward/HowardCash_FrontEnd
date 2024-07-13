import { useNavigate } from "react-router-dom";
import { postLoginAdmin } from "../../services/AuthService";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from "react";
import { Avatar, Box, Button, Checkbox, Container, createTheme, CssBaseline, FormControlLabel, Grid, Link, TextField, ThemeProvider, Typography } from "@mui/material";


const LoginAdmin = () => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const defaultTheme = createTheme();

    const sendData = (e) => {
        e.preventDefault();
        doLoginAdmin();
    };

    const doLoginAdmin = () => {
        const credentials = {
            correo,
            password
        };

        postLoginAdmin(credentials)
            .then((res) => {
                console.log("Login exitoso", res);
                localStorage.setItem('token', res.token);
                localStorage.setItem('admin', correo);
                navigate('/admin/monedas');
            })
            .catch((err) => {
                console.error("Error al iniciar sesión", err);
                if(err.response.status === 401){
                    setErrors({ ...errors, formError: 'Correo admin o contraseña incorrectos' });
                }
                setErrors(err);
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
                Sign in
              </Typography>
              <Box component="form" noValidate onSubmit={sendData} sx={{ mt: 1 }}>
                {errors.formError && <Typography color="error">{errors.formError}</Typography>}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="correo"
                  label="Email Address"
                  name="correo"
                  autoComplete="correo"
                  autoFocus
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  error={Boolean(errors.correo)}
                  helperText={errors.correo}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Recordar usuario"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      );
}

export default LoginAdmin;
