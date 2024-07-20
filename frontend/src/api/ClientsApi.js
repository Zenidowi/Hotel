import axios from "axios";
import {__API_URL__} from "../env";

export class Clients {
    static async getClients() {
        return await axios.get(`${__API_URL__}clients/`);
    }

    static async createClients({name, contact_phone, email}) {
        return await axios.post(`${__API_URL__}clients/`, {name, contact_phone, email});
    }

    static async deleteClients(id) {
        return await axios.delete(`${__API_URL__}clients/${id}/`);
    }

}