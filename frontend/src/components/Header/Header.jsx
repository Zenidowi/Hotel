import React from 'react';
import './Header.css';
import {Tabs} from "antd";
import Avatar from './Avatar.png';

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
    return (
        <div className="header">
            <h1 className='header_title'>Hotel</h1>
            <Tabs defaultActiveKey="1" items={items}/>
            <img className='header_img' src={Avatar} alt='User'/>
        </div>
    );
};

export default Header;