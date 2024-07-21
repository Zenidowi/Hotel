import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Select, Space, Table } from "antd";
import Header from "../../components/Header/Header";
import Column from "antd/es/table/Column";
import { Rooms } from "../../api/RoomsApi";
import { Clients } from "../../api/ClientsApi";
import { Booking } from "../../api/BookingsApi";
import './RoomsPage.css';
import { useForm } from "antd/es/form/Form";

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

const has_ = {
    true: 'Есть',
    false: 'Нет',
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
            room: selectedRoom?.id, // Отправляем id номера
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
                room_description: `${getReadableRoomType(room.room_type)} - ${getReadableCategory(room.category)}`
            });
            updateTotalCost(room.price, bookingForm.getFieldValue('discount'), bookingForm.getFieldValue('nights'));
        }
    };

    const updateTotalCost = (price, discount, nights) => {
        bookingForm.setFieldsValue({
            total_cost: calculateTotalCost(price, discount, nights)
        });
    };

    const calculateTotalCost = (price = selectedRoom?.price, discount = bookingForm.getFieldValue('discount'), nights = bookingForm.getFieldValue('nights')) => {
        const totalBeforeDiscount = price * nights;
        const discountAmount = totalBeforeDiscount * (discount / 100);
        return (totalBeforeDiscount - discountAmount).toFixed(2);
    };

    const getReadableRoomType = (roomType) => {
        return roomTypeMap[roomType] || roomType;
    };

    const getReadableCategory = (category) => {
        return categoryMap[category] || category;
    };

    const handleCheckInChange = (date) => {
        const checkInDate = new Date(date);
        const checkOutDate = new Date(bookingForm.getFieldValue('check_out_date'));
        const nights = calculateNights(checkInDate, checkOutDate);
        bookingForm.setFieldsValue({ nights });
        updateTotalCost(selectedRoom?.price, bookingForm.getFieldValue('discount'), nights);
    };

    const handleCheckOutChange = (date) => {
        const checkInDate = new Date(bookingForm.getFieldValue('check_in_date'));
        const checkOutDate = new Date(date);
        const nights = calculateNights(checkInDate, checkOutDate);
        bookingForm.setFieldsValue({ nights });
        updateTotalCost(selectedRoom?.price, bookingForm.getFieldValue('discount'), nights);
    };

    const calculateNights = (checkInDate, checkOutDate) => {
        if (checkInDate && checkOutDate) {
            const diffTime = Math.abs(checkOutDate - checkInDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? diffDays : 1; // Минимум 1 ночь
        }
        return 1; // Минимум 1 ночь
    };

    useEffect(() => {
        fetchRooms();
        fetchClients();
    }, []);

    const openBookingModal = (record) => {
        setSelectedRoom(record);
        bookingForm.setFieldsValue({
            room_description: `${getReadableRoomType(record.room_type)} - ${getReadableCategory(record.category)}`,
            price: record.price,
            discount: record.discount || 0,
            nights: 1, // Установим по умолчанию 1 ночь
            total_cost: calculateTotalCost(record.price, 0, 1) // Рассчитаем стоимость для 1 ночи
        });
        setBookingModal(true);
    };

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
                    <Form.Item label='Номер' name='room_description' rules={[{ required: true, message: 'Пожалуйста, выберите номер' }]}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label='Дата заезда' name='check_in_date' rules={[{ required: true, message: 'Пожалуйста, выберите дату заезда' }]}>
                        <Input type="date" onChange={e => handleCheckInChange(e.target.value)} />
                    </Form.Item>
                    <Form.Item label='Дата выезда' name='check_out_date' rules={[{ required: true, message: 'Пожалуйста, выберите дату выезда' }]}>
                        <Input type="date" onChange={e => handleCheckOutChange(e.target.value)} />
                    </Form.Item>
                    <Form.Item label='Количество суток' name='nights'>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label='Цена за сутки' name='price'>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label='Скидка' name='discount'>
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item label='Общая стоимость' name='total_cost'>
                        <Input disabled />
                    </Form.Item>
                </Form>
            </Modal>

            <Header />

            <div className="rooms-page-content">
                <Button onClick={() => setRoomModal(true)} className='rooms-page-add' type='primary'>Добавить номер</Button>
                <Table dataSource={rooms} rowKey='id'>
                    <Column title="Тип номера" dataIndex="room_type" key="room_type" render={(text) => getReadableRoomType(text)} />
                    <Column title="Категория" dataIndex="category" key="category" render={(text) => getReadableCategory(text)} />
                    <Column title="Цена за сутки" dataIndex="price" key="price" />
                    <Column title="Детская кровать" dataIndex="has_child_bed" key="has_child_bed" render={(text) => has_[text]} />
                    <Column
                        title="Действия"
                        key="actions"
                        render={(text, record) => (
                            <Space size="middle">
                                <Button onClick={() => openBookingModal(record)}>Забронировать</Button>
                                <Button danger onClick={() => deleteRoom(record.id)}>Удалить</Button>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </div>
    );
};

export default RoomsPage;
