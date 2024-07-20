import React from 'react';
import './AuthPage.css';
import {Button, Form, Input} from "antd";
import {useForm} from "antd/es/form/Form";

const AuthPage = () => {
    const onSubmit = (values) => {
        console.log(values);
    }

    return (
        <div className="container">
            <div className="auth-page">
                <h1 className="auth-page-title">Войти</h1>
                <Form layout="vertical" className="auth-page-form">
                    <Form.Item label='Логин:' name="username" >
                        <Input/>
                    </Form.Item>
                    <Form.Item label='Пароль:' name="password">
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={onSubmit} type="primary" htmlType="submit">Войти</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AuthPage;