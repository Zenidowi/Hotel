import React from 'react';
import './AuthPage.css';
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { AuthService } from "../../api/AuthApi";
import {useNavigate} from "react-router-dom";

const AuthPage = () => {
    const [form] = useForm();
    const navigate = useNavigate();
    const onFinish = (values) => {
        const { username, password } = values;
        AuthService.login(username, password)
            .then(response => {
                console.log(response.data);
                localStorage.setItem("access", response.data.access);
                localStorage.setItem("refresh", response.data.refresh);
                navigate('/clients')
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div className="container">
            <div className="auth-page">
                <h1 className="auth-page-title">Войти</h1>
                <Form
                    form={form}
                    layout="vertical"
                    className="auth-page-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label='Логин:'
                        name="username"
                        rules={[{ required: true, message: 'Введите логин!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='Пароль:'
                        name="password"
                        rules={[{ required: true, message: 'Введите пароль!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Войти</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AuthPage;
