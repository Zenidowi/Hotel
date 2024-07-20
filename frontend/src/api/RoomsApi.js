import axios from "axios";
import {__API_URL__} from "../env";

export class Rooms {
    static async getRooms() {
        return await axios.get(`${__API_URL__}rooms/`);
    }

    static async createRoom({room_type, category, has_child_bed, price, discount}) {
        return await axios.post(`${__API_URL__}rooms/`, {room_type, category, has_child_bed, price, discount});
    }

    static async deleteRoom(id) {
        return await axios.delete(`${__API_URL__}rooms/${id}/`);
    }
}