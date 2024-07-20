import React, {useEffect} from 'react';
import './ClientsPage.css';
import Header from "../../components/Header/Header";
import {Button, Form, Input, message, Modal, Space, Table} from "antd";
import Search from "antd/es/input/Search";
import Column from "antd/es/table/Column";
import {Clients} from "../../api/ClientsApi";
import FormItem from "antd/es/form/FormItem";

const ClientsPage = () => {
    const [clients, setClients] = React.useState([]);
    const [clientsModal, setClientsModal] = React.useState(false);
    const [form] = Form.useForm();



    const fetchClients = () => {
        Clients.getClients()
            .then(response => {
                setClients(response.data);
            })
            .catch(() => {
                message.error("Не удалось получить клиентов");
            })
    }

    const deleteClient = (id) => {
        if (id !== undefined) {
            Clients.deleteClients(id)
                .then(response => {
                    message.success('Клиент успешно удален')
                    fetchClients();
                })
                .catch(() => {
                    message.error('Не удалось удалить клиента')
                })
        }
    }

    const addClient = () => {
        const formData = {
            ...form.getFieldsValue(),
        };

        Clients.createClients(formData)
            .then(response => {
                console.log(response.data);
                form.resetFields();
                fetchClients()
            })
            .catch(() => {
                message.error('Не удалось добавить клиента')
            })
        setClientsModal(false)
    }

    useEffect(() => {
        fetchClients()
    }, []);

    return (
        <div className="clients-page">
            <Modal
                open={clientsModal}
                onOk={() => addClient()}
                onCancel={() => setClientsModal(false)}
                okText='Добавить'
                cancelText='Отмена'
            >
                <Form form={form} layout="vertical" className="clients-page-form">
                    <FormItem label='Имя' name='name'>
                        <Input/>
                    </FormItem>
                    <FormItem label='Номер телефона' name='contact_phone'>
                        <Input/>
                    </FormItem>
                    <FormItem label='Электронная почта' name='email'>
                        <Input/>
                    </FormItem>
                </Form>
            </Modal>
            <Header/>
            <div className="clients-page_content">
                <div className="clients-page-addOrSearch">
                    <Button onClick={() => setClientsModal(true)} className='clients-page-add'>Добавить клиента</Button>
                    <Search placeholder='Поиск клиента' className="clients-page-search" enterButton/>
                </div>
                <Table dataSource={clients}>
                    <Column title="Имя" dataIndex="name" key="name" />
                    <Column
                        title="Номер телефона"
                        dataIndex="contact_phone"
                        key="contact_phone"
                    />
                    <Column
                        title="Почта"
                        dataIndex="email"
                        key="email"
                    />
                    <Column
                        title="Действия"
                        key="action"
                        render={(_, record) => (
                            <Space size="middle">
                                <a onClick={() => deleteClient(record.id)}>Удалить</a>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </div>
    );
};

export default ClientsPage;