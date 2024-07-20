import axios from "axios";
import {__API_URL__} from "../../env";

export const instance = axios.create({
    baseURL: __API_URL__,
});

const setAuthToken = (token) => {
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('access_token', token);
    } else {
        delete instance.defaults.headers.common['Authorization'];
        localStorage.removeItem('access_token');
    }
};

const setRefreshToken = (token) => {
    if (token) {
        localStorage.setItem('refresh_token', token);
    } else {
        localStorage.removeItem('refresh_token');
    }
};

export { instance, setAuthToken, setRefreshToken };

