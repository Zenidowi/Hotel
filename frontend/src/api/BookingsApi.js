import {__API_URL__} from "../env";
import axios from "axios";

export class Booking {
    static async getBookings() {
       return await axios.get(`${__API_URL__}bookings/`)
    }

    static async createBooking({client, room, check_in_date, check_out_date, total_cost, status}) {
        return await axios.post(`${__API_URL__}bookings/`, {client, room, check_in_date, check_out_date, total_cost, status});
    }

    static async deleteBooking(id) {
        return await axios.delete(`${__API_URL__}bookings/${id}/`);
    }
}