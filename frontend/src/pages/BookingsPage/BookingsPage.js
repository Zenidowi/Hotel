import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import Header from "../../components/Header/Header";
import Column from "antd/es/table/Column";
import ColumnGroup from "antd/es/table/ColumnGroup";
import './BookingsPage.css';
import { Booking } from "../../api/BookingsApi";
import { Rooms } from "../../api/RoomsApi";
import { Clients } from "../../api/ClientsApi";

const roomTypeMap = {
    'single': 'Одноместный',
    'double': 'Двухместный',
    'triple': 'Трехместный'
};

const categoryMap = {
    'standard': 'Стандарт',
    'deluxe': 'Делюкс',
    'luxury': 'Люкс'
};

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [clients, setClients] = useState([]);
    const [rooms, setRooms] = useState([]);

    const fetchBookings = () => {
        Booking.getBookings()
            .then(response => {
                setBookings(response.data);
                console.log("Bookings:", response.data); // Отладочный вывод
            })
            .catch(() => {
                message.error('Не удалось получить данные о бронированиях');
            });
    };

    const fetchClients = () => {
        Clients.getClients()
            .then(response => {
                setClients(response.data);
                console.log("Clients:", response.data); // Отладочный вывод
            })
            .catch(() => {
                message.error('Не удалось получить данные о клиентах');
            });
    };

    const fetchRooms = () => {
        Rooms.getRooms()
            .then(response => {
                setRooms(response.data);
                console.log("Rooms:", response.data); // Отладочный вывод
            })
            .catch(() => {
                message.error('Не удалось получить данные о номерах');
            });
    };

    const deleteRoom = (id) => {
        if (id !== undefined) {
            Booking.deleteBooking(id)
                .then(response => {
                    fetchBookings()
                    fetchClients()
                    fetchRooms()
                })
        }
    }

    useEffect(() => {
        fetchBookings();
        fetchClients();
        fetchRooms();
    }, []);

    const getClientInfo = (clientId) => {
        const client = clients.find(client => client.id === clientId);
        console.log("Found Client:", client); // Отладочный вывод
        return client || {};
    };

    const getRoomInfo = (roomId) => {
        const room = rooms.find(room => room.id === roomId);
        console.log("Found Room:", room); // Отладочный вывод
        return room || {};
    };

    const dataWithDetails = bookings.map(booking => {
        const client = getClientInfo(booking.client);
        const room = getRoomInfo(booking.room);

        return {
            ...booking,
            client_name: client.name || 'Неизвестно',
            client_contact_phone: client.contact_phone || 'Неизвестно',
            client_email: client.email || 'Неизвестно',
            room_type: room.room_type || 'Неизвестно',
            room_category: room.category || 'Неизвестно',
            room_has_child_bed: room.has_child_bed ? 'Да' : 'Нет' // Пример преобразования
        };
    });

    return (
        <div className="bookings-page">
            <Header />
            <div className="bookings-page_content">
                <div className="bookings-page-addOrSearch">
                    {/* Здесь может быть добавление/поиск */}
                </div>
                <Table dataSource={dataWithDetails} rowKey="id">
                    <ColumnGroup title='Клиент'>
                        <Column title="Имя" dataIndex="client_name" key="client_name" />
                        <Column title="Номер телефона" dataIndex="client_contact_phone" key="client_contact_phone" />
                        <Column title="Почта" dataIndex="client_email" key="client_email" />
                    </ColumnGroup>
                    <ColumnGroup title='Номер'>
                        <Column title='Тип номера' dataIndex="room_type" key="room_type" render={(text) => roomTypeMap[text]}/>
                        <Column title="Категория" dataIndex="room_category" key="room_category" render={(text) => categoryMap[text]} />
                        <Column title="Детская кровать" dataIndex="room_has_child_bed" key="room_has_child_bed" />
                    </ColumnGroup>
                    <ColumnGroup title='Даты'>
                        <Column title="Дата приезда" dataIndex="check_in_date" key="check_in_date" />
                        <Column title="Дата отъезда" dataIndex="check_out_date" key="check_out_date" />
                    </ColumnGroup>
                    <Column title="Полная цена" dataIndex="total_cost" key="total_cost" />
                    <Column
                        title="Действия"
                        key="action"
                        render={(_, record) => (
                            <Space size="middle">
                                <a onClick={() => deleteRoom(record.id)}>Удалить</a>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </div>
    );
};

export default BookingsPage;
