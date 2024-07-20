import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Modal, Select, Space, Table} from "antd";
import Header from "../../components/Header/Header";
import Search from "antd/es/input/Search";
import Column from "antd/es/table/Column";
import {Rooms} from "../../api/RoomsApi";
import './RoomsPage.css';
import FormItem from "antd/es/form/FormItem";
import {useForm} from "antd/es/form/Form";
import {Option} from "antd/es/mentions";
import {Clients} from "../../api/ClientsApi";

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [roomModal, setRoomModal] = useState(false);
    const [form] = useForm()

    const fetchRooms = () => {
        Rooms.getRooms()
            .then(response => {
                setRooms(response.data);
            })
            .catch(() => {
                message.error('Не удалось получить номера')
            })
    }

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

    useEffect(() => {
        fetchRooms()
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
                    <FormItem label='Тип номера' name='room_type' rules={[{ required: true, message: 'Пожалуйста, введите тип номера' }]}>
                        <Select
                            options={[
                                {
                                    value: 'single',
                                    label: 'Одноместный',
                                },
                                {
                                    value: 'double',
                                    label: 'Двухместный',
                                },
                                {
                                    value: 'triple',
                                    label: 'Трехместный',
                                },
                            ]}
                        />
                    </FormItem>
                    <FormItem label='Категория' name='category' rules={[{ required: true, message: 'Пожалуйста, введите категорию номера' }]}>
                        <Select
                            options={[
                                {
                                    value: 'standard',
                                    label: 'Стандарт',
                                },
                                {
                                    value: 'deluxe',
                                    label: 'Делюкс',
                                },
                                {
                                    value: 'luxury',
                                    label: 'Люкс',
                                },
                            ]}
                        />
                    </FormItem>
                    <FormItem label='Детская кровать' name='has_child_bed' rules={[{ required: true, message: 'Пожалуйста, введите есть ли детская кровать в номере' }]}>
                        <Select options={[
                            {
                                value: 'true',
                                label: 'Есть',
                            },
                            {
                                value: 'false',
                                label: 'Нет',
                            }
                        ]}/>
                    </FormItem>
                    <FormItem label='Цена за сутки' name='price' rules={[{ required: true, message: 'Пожалуйста, введите цену номера'}]}>
                        <Input />
                    </FormItem>
                    <FormItem label='Скидка' name='discount'>
                        <Input />
                    </FormItem>
                </Form>
            </Modal>
            <Header />
            <div className="rooms-page_content">
                <div className="rooms-page-addOrSearch">
                    <Button onClick={() => setRoomModal(true)} className='rooms-page-add'>Добавить номер</Button>
                    {/*<Search*/}
                    {/*    placeholder='Поиск номера'*/}
                    {/*    className="rooms-page-search"*/}
                    {/*    enterButton*/}
                    {/*/>*/}
                </div>
                <Table dataSource={rooms} rowKey="id">
                    <Column title="Тип номера" dataIndex="room_type" key="room_type" />
                    <Column title="Категория" dataIndex="category" key="category" />
                    <Column title="Цена за сутки" dataIndex="price" key="price" />
                    <Column title="Скидка" dataIndex="discount" key="discount" />
                    <Column
                        title="Действия"
                        key="action"
                        render={(_, record) => (
                            <Space size="middle">
                                <a onClick={() => deleteRoom(record.id)}>Удалить</a>
                                <a>Забронировать</a>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </div>
    );
};

export default RoomsPage;