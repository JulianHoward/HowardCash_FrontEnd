
import axios from 'axios';

export const getMonedas = async (token) => {
    try {
        const response = await axios.get('http://localhost:3000/api/monedas', {
            headers: {
                Authorization: `Bearer ${token}`
            },
    });
    return response.data;
    } catch (error) {
        console.error('Error al obtener las monedas:', error);
    }
};

export const getMonedaById = async (token, monedaId) => {
    const response = await axios.get(`http://localhost:3000/api/monedas/${monedaId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const postMoneda = async (token, moneda) => {
    await axios.post('http://localhost:3000/api/monedas', moneda, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const updateMoneda = async (token, id, moneda) => {
    try {
        const response = await axios.put(`http://localhost:3000/api/monedas/${id}`, moneda, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la moneda:', error);
    }
}

export const deleteMoneda = async (token, id) => {
    await axios.delete(`http://localhost:3000/api/monedas/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
