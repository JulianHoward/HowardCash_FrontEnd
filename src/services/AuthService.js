import axios from "axios";

export const postLogin = async (credentials) => {
    console.log('Intentando iniciar sesión con credenciales:', credentials);
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'login-user', credentials)
        .then((res) => {
            // Guardar token y nombre de usuario en localStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            // Guardar también el ID de usuario si está disponible en la respuesta
            localStorage.setItem('userId', res.data.id); // Asumiendo que el backend devuelve userId

            resolve(res.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export const postLoginAdmin = async (credentials) => {
    console.log('Intentando iniciar sesión con credenciales:', credentials);
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'login-admin', credentials)
        .then((res) => {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('admin', res.data.admin);
            localStorage.setItem('adminId', res.data.id);

            resolve(res.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export const postRegister = (credentials) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'register-user', credentials)
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                reject(error);
            });
    });
}

export const getUserDetails = async () => {
    return axios.get(import.meta.env.VITE_BASE_URL + 'meUser').then(response => response.data);
};

