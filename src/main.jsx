import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LoginForm from './pages/auth/LoginForm';
import RegisterForm from './pages/auth/RegisterForm';
import Homepage from './pages/Homepage';
import FormCreateBilletera from './pages/billetera/FormCreateBilletera';
import MovimientoDepositar from './pages/movimientos/MovimientoDepositar';
import FormCreateTarjeta from './pages/tarjeta/FormCreateTarjeta';
import MovimientoRetirar from './pages/movimientos/MovimientoRetirar';
import CrearCuenta from './pages/cuentasBancarias/CrearCuenta';
import MovimientoTransferir from './pages/movimientos/MovimientoTransferir';
import MovimientoComerciar from './pages/movimientos/MovimientoComerciar';
import VentasPendientes from './pages/movimientos/opcionesComerciar/VentasPendientes';
import PonerEnVenta from './pages/movimientos/opcionesComerciar/PonerEnVenta';
import CheckMovimientos from './pages/billetera/CheckMovimientos';
import LoginAdmin from './pages/admin/LoginAdmin';
import MonedasList from './pages/admin/MonedasList';
import FormMonedas from './pages/admin/FormMonedas';
import ActualizarMoneda from './pages/admin/ActualizarMoneda';
import AdminsList from './pages/admin/AdminsList';

const router = createBrowserRouter([
  { path: "/login", element: <LoginForm /> },
  { path: "/register", element: <RegisterForm /> },
  { path: "/login/admin", element: <LoginAdmin />},
  { path: "/homepage", element: <Homepage /> },
  { path: "/billetera/FormCreateBilletera", element: <FormCreateBilletera /> },
  { path: "/billetera/FormDepositar", element: <MovimientoDepositar /> },
  { path: "/crearTarjeta", element: <FormCreateTarjeta /> },
  { path: "/billetera/FormRetirar", element: <MovimientoRetirar />},
  { path: "/crear-cuenta", element: <CrearCuenta /> },
  { path: "/billetera/FormTransferir", element: <MovimientoTransferir /> },
  { path: "/billetera/FormComerciar", element: <MovimientoComerciar /> },
  { path: "/ventas-pendientes", element: <VentasPendientes /> },
  { path: "/vender", element: <PonerEnVenta /> },
  { path: "/billetera/movimientosById/:billeteraId", element: <CheckMovimientos /> },
  { path: "/admin/monedas", element: <MonedasList /> },
  { path: "/admin/monedas/crear", element: <FormMonedas /> },
  { path: "/admin/monedas/:id", element: <ActualizarMoneda /> },
  { path: "/admin/admins-crud", element: <AdminsList /> },
  { path: "*", element: <LoginForm /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
