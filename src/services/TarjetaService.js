
import axios from 'axios';

export const validarTarjeta = (number) => {
    const arr = number.split('').reverse().map(x => parseInt(x));
    const lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce(
        (acc, val, idx) =>
            idx % 2 !== 0
                ? acc + val
                : acc + ((val *= 2) > 9 ? val - 9 : val),
        0
    );
    sum += lastDigit;
    return sum % 10 === 0;
};

export const getUserTarjetas = async (token, userId) => {
    const response = await axios.get(`http://localhost:3000/api/tarjetas`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data.filter(tarjeta => tarjeta.tarjeta_usuario_id  === userId);
}

export const createTarjeta = async (token, idUserSession, numero, cvv, fechaVencimiento) => {
    const newTarjeta = {
        tarjeta_usuario_id: idUserSession,
        numero,
        cvv,
        fecha_vencimiento: fechaVencimiento,
    };
    try {
        const response = axios.post('http://localhost:3000/api/tarjetas', newTarjeta, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Tarjeta creada', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to create tarjeta', error);
    }
};
