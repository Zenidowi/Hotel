import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Modal, Select, Space, Table} from "antd";
import Header from "../../components/Header/Header";
import Column from "antd/es/table/Column";
import {Rooms} from "../../api/RoomsApi";
import {Clients} from "../../api/ClientsApi";
import {Booking} from "../../api/BookingsApi";
import './RoomsPage.css';
import {useForm} from "antd/es/form/Form";

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

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [clients, setClients] = useState([]);
    const [roomModal, setRoomModal] = useState(false);
    const [bookingModal, setBookingModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [form] = useForm();
    const [bookingForm] = useForm();

    const fetchRooms = () => {
        Rooms.getRooms()
            .then(response => {
                setRooms(response.data);
            })
            .catch(() => {
                message.error('Не удалось получить номера');
            });
    };

    const fetchClients = () => {
        Clients.getClients()
            .then(response => {
                setClients(response.data);
            })
            .catch(() => {
                message.error('Не удалось получить клиентов');
            });
    };

    const addRoom = () => {
        const formData = {
            ...form.getFieldsValue(),
        };

        Rooms.createRoom(formData)
            .then(response => {
                form.resetFields();
                fetchRooms();
            })
            .catch(() => {
                message.error('Не удалось добавить номер');
            });
        setRoomModal(false);
    };

    const addBooking = () => {
        const formData = {
            ...bookingForm.getFieldsValue(),
            total_cost: calculateTotalCost(),
        };

        Booking.createBooking(formData)
            .then(response => {
                bookingForm.resetFields();
                fetchRooms();
                message.success('Бронирование успешно добавлено');
            })
            .catch(() => {
                message.error('Не удалось добавить бронирование');
            });
        setBookingModal(false);
    };

    const deleteRoom = (id) => {
        if (id !== undefined) {
            Rooms.deleteRoom(id)
                .then(response => {
                    message.success('Номер успешно удален');
                    fetchRooms();
                })
                .catch(() => {
                    message.error('Не удалось удалить номер');
                });
        }
    };

    const handleRoomChange = (roomId) => {
        const room = rooms.find(room => room.id === roomId);
        setSelectedRoom(room);
        if (room) {
            bookingForm.setFieldsValue({
                price: room.price,
                discount: room.discount || 0,
                total_cost: calculateTotalCost(room.price, room.discount || 0)
            });
        }
    };

    const calculateTotalCost = (price = selectedRoom?.price, discount = bookingForm.getFieldValue('discount')) => {
        return (price - (price * (discount / 100))).toFixed(2);
    };

    useEffect(() => {
        fetchRooms();
        fetchClients();
    }, []);

    return (
        <div className='rooms-page'>
            <Modal
                open={roomModal}
                onOk={() => addRoom()}
                onCancel={() => setRoomModal(false)}
                okText='Добавить'
                cancelText='Отмена'
            >
                <Form form={form} layout="vertical" className="clients-page-form">
                    <Form.Item label='Тип номера' name='room_type' rules={[{ required: true, message: 'Пожалуйста, введите тип номера' }]}>
                        <Select
                            options={[
                                { value: 'single', label: 'Одноместный' },
                                { value: 'double', label: 'Двухместный' },
                                { value: 'triple', label: 'Трехместный' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label='Категория' name='category' rules={[{ required: true, message: 'Пожалуйста, введите категорию номера' }]}>
                        <Select
                            options={[
                                { value: 'standard', label: 'Стандарт' },
                                { value: 'deluxe', label: 'Делюкс' },
                                { value: 'luxury', label: 'Люкс' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label='Детская кровать' name='has_child_bed' rules={[{ required: true, message: 'Пожалуйста, введите есть ли детская кровать в номере' }]}>
                        <Select
                            options={[
                                { value: 'true', label: 'Есть' },
                                { value: 'false', label: 'Нет' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label='Цена за сутки' name='price' rules={[{ required: true, message: 'Пожалуйста, введите цену номера' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Скидка' name='discount'>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                open={bookingModal}
                onOk={() => addBooking()}
                onCancel={() => setBookingModal(false)}
                okText='Забронировать'
                cancelText='Отмена'
            >
                <Form form={bookingForm} layout="vertical">
                    <Form.Item label='Клиент' name='client' rules={[{ required: true, message: 'Пожалуйста, выберите клиента' }]}>
                        <Select>
                            {clients.map(client => (
                                <Select.Option key={client.id} value={client.id}>{client.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Номер' name='room' rules={[{ required: true, message: 'Пожалуйста, выберите номер' }]}>
                        <Select onChange={handleRoomChange}>
                            {rooms.map(room => (
                                <Select.Option key={room.id} value={room.id}>{room.room_type} - {room.category}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Дата заезда' name='check_in_date' rules={[{ required: true, message: 'Пожалуйста, выберите дату заезда' }]}>
                        <Input type='date' />
                    </Form.Item>
                    <Form.Item label='Дата выезда' name='check_out_date' rules={[{ required: true, message: 'Пожалуйста, выберите дату выезда' }]}>
                        <Input type='date' />
                    </Form.Item>
                    <Form.Item label='Цена за сутки' name='price'>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label='Скидка' name='discount'>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label='Общая стоимость' name='total_cost'>
                        <Input disabled />
                    </Form.Item>
                </Form>
            </Modal>

            <Header />
            <div className="rooms-page_content">
                <div className="rooms-page-addOrSearch">
                    <Button onClick={() => setRoomModal(true)} className='rooms-page-add'>Добавить номер</Button>
                </div>
                <Table dataSource={rooms} rowKey="id">
                    <Column title="Тип номера" dataIndex="room_type" key="room_type" render={(text) => roomTypeMap[text]} />
                    <Column title="Категория" dataIndex="category" key="category" render={(text) => categoryMap[text]}/>
                    <Column title="Цена за сутки" dataIndex="price" key="price" />
                    <Column title="Скидка" dataIndex="discount" key="discount" />
                    <Column
                        title="Действия"
                        key="action"
                        render={(_, record) => (
                            <Space size="middle">
                                <a onClick={() => deleteRoom(record.id)}>Удалить</a>
                                <a onClick={() => setBookingModal(true)}>Забронировать</a>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </div>
    );
};

export default RoomsPage;
