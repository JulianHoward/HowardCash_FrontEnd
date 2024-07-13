import axios from "axios"


export const getAdmins = async (token) => {
    const response = await axios.get('http://localhost:3000/api/admins', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateAdmin = async (token, id, admin) => {
    await axios.put(`http://localhost:3000/api/admins/${id}`, admin, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const deleteAdmin = async (token, id) => {
    await axios.delete(`http://localhost:3000/api/admins/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
