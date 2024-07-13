
import axios from 'axios';
import { createMovimiento } from './MovimientosServices';

export const getCuentasBancariasUser = async (token, userId) => {
    const response = await axios.get('http://localhost:3000/api/cuentas-bancarias', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const cuentasUser = response.data.filter(cuenta => cuenta.usuario_id_fk === userId);
    console.log('cuentasUser', cuentasUser);
    return cuentasUser;
};

const API_URL = 'http://localhost:3000/api/cuentas-bancarias';

export const createCuentaBancaria = async (token, cuentaData) => {
    try {
        const response = await axios.post(API_URL, cuentaData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear cuenta bancaria', error);
        throw error;
    }
};


export const retirar = async (token, movimientoData) => {
    try {
        const movimiento = {
            descripcion: movimientoData.descripcion,
            movimiento_billetera_origen_id: movimientoData.cuentaSeleccionada,
            monto: movimientoData.monto,
            tipo_transaccion: 'Egreso',
            movimiento_billetera_destino_id: movimientoData.billeteraSeleccionada,
        };
        console.log('movimientoData retirar service', movimientoData);
        await createMovimiento(token, movimiento);
        return true;
    } catch (error) {
        console.error('Error al retirar:', error);
        throw error;
    }
};
