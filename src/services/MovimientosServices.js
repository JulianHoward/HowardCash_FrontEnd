
import axios from 'axios';

export const createMovimiento = async (token, movimientoData) => {
    try {
        const response = await axios.post('http://localhost:3000/api/movimientos', movimientoData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Movimiento creado', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al crear movimiento', error);
    }
}

export const transferirEntreBilleteras = async (token, billetera_origen_id, billetera_destino_id, monto, beneficiarioId) => {
    console.log("Token en transferirEntreBilleteras:", token);
    console.log("Billetera Origen en transferirEntreBilleteras:", billetera_origen_id);
    console.log("Billetera Destino en transferirEntreBilleteras:", billetera_destino_id);
    console.log("Monto en transferirEntreBilleteras:", monto);
    console.log("Beneficiario ID en transferirEntreBilleteras:", beneficiarioId);

    try {
        const response = await axios.post('http://localhost:3000/api/movimientos', {
            descripcion: `Transferencia a billetera ${billetera_destino_id} - beneficiario:${beneficiarioId}`,
            movimiento_billetera_origen_id: billetera_origen_id,
            monto,
            tipo_transaccion: 'Transferencia',
            movimiento_billetera_destino_id: billetera_destino_id,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error al transferir fondos: ${error.response?.data?.message || error.message}`);
    }
}

export const getVentasPendientes = async (token) => {
    try {
        const response = await axios.get('http://localhost:3000/api/ventas/pendientes', {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener ventas pendientes:', error);
    }
}

export const postVenta = async (token, venta) => {
    try {
         const response = await axios.post('http://localhost:3000/api/ventas', venta, {
            headers: {
                Authorization: `Bearer ${token}`
            },
         });
        return response.data;
    } catch (error) {
        console.error('Error al crear venta:', error);
    }
}

export const getMovimientosByBilleteraId = async (token, billeteraId) => {
    const response = await axios.get(`http://localhost:3000/api/movimientos/billetera/${billeteraId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
