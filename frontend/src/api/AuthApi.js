import axios from "axios";
import {__API_URL__} from "../env";

export class AuthService {

    static async login(username, password) {
        return await axios.post(`${__API_URL__}accounts/login/`, {username, password});
    }
}
