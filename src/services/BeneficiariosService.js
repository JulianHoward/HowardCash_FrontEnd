
import axios from 'axios';

export const validarExistenciaBeneficiario = async (token, beneficiarioId) => {
    try {
        console.log('Token en servicio:', token);
        console.log('ID de beneficiario en servicio:', beneficiarioId);
        const response = await axios.get(`http://localhost:3000/api/beneficiarios/${beneficiarioId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Respuesta de validación de beneficiario service:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al validar beneficiario:', error);
        throw error;
    }
};