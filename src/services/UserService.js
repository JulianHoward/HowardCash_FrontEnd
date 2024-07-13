
import axios from 'axios';

export const getUserInfo = async (token) => {
    const response = await axios.get('http://localhost:3000/api/meUser', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const getUsuarios = async (token) => {
    const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const getUsuarioById = async (token, userId) => {
    const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const fetchBeneficiarios = async (token) => {
    try {
        const response = await axios.get('http://localhost:3000/api/beneficiarios', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener beneficiarios:', error);
    }
}
