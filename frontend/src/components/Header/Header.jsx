import React, { useEffect, useState } from 'react';
import './Header.css';
import {Button, Tabs} from "antd";
import Avatar from './Avatar.png';
import { useNavigate, useLocation } from "react-router-dom";

const items = [
    {
        key: '1',
        label: 'Клиенты',
    },
    {
        key: '2',
        label: 'Номера',
    },
    {
        key: '3',
        label: 'Бронирование',
    },
];

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('1');

    useEffect(() => {
        // Определите активную вкладку в зависимости от текущего пути
        switch (location.pathname) {
            case '/clients':
                setActiveTab('1');
                break;
            case '/rooms':
                setActiveTab('2');
                break;
            case '/booking':
                setActiveTab('3');
                break;
            default:
                setActiveTab('1'); // Установите вкладку по умолчанию
                break;
        }
    }, [location.pathname]);

    const onChange = (key) => {
        setActiveTab(key);
        switch (key) {
            case '1':
                navigate('/clients');
                break;
            case '2':
                navigate('/rooms');
                break;
            case '3':
                navigate('/booking');
                break;
            default:
                break;
        }
    };

    return (
        <div className="header">
            <h1 className='header_title'>Hotel</h1>
            <Tabs activeKey={activeTab} onChange={onChange} items={items} />
            <Button type={"primary"}>Выйти</Button>
        </div>
    );
};

export default Header;
