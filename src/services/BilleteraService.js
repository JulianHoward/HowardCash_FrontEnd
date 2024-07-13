import axios from 'axios';

// Obtener las billeteras de un usuario
export const getUserBilleteras = async (token, userId) => {
    const response = await axios.get('http://localhost:3000/api/billeteras', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const billeterasUser = response.data.filter(billetera => billetera.billetera_usuario_id === userId);
    const billeteraMonedaInfo = await Promise.all(billeterasUser.map(async (billetera) => {
        const monedasResponse = await axios.get(`http://localhost:3000/api/monedas/${billetera.billetera_moneda_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const owner_billetera_name_request = await axios.get(`http://localhost:3000/api/users/${billetera.billetera_usuario_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const owner_billetera_name = owner_billetera_name_request.data.nombre;
        const moneda = monedasResponse.data;
        const valorUSD = billetera.saldo * moneda.valor_usd;
        return {
            ...billetera,
            monedaNombre: moneda.nombre,
            valorUSD,
            owner_billetera_name
        };
    }));
    console.log('billeteraMonedaInfo', billeteraMonedaInfo);
    return billeteraMonedaInfo;
};

// Crear una nueva billetera
export const createBilletera = async (token, idUserSession, monedaId) => {
    try {
        const billeteras = await getUserBilleteras(token, idUserSession);
        const alreadyExists = billeteras.some(billetera => billetera.billetera_moneda_id === monedaId);

        if (alreadyExists) {
            throw new Error('Ya tienes una billetera con esta moneda.');
        }

        const nuevaBilletera = {
            billetera_usuario_id: idUserSession,
            billetera_moneda_id: monedaId,
            saldo: 0.0,
        };
        const response = await axios.post('http://localhost:3000/api/billeteras', nuevaBilletera, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la billetera:', error);
        throw error;
    }
};

export const getAllBilleteras = async (token) => {
    const response = await axios.get('http://localhost:3000/api/billeteras', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
