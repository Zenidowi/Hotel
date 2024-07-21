import React, {useEffect} from 'react';
import Container from "../components/Container/Container";
import {Route, Routes, useNavigate} from "react-router-dom";
import AuthPage from "../pages/AuthPage/AuthPage";
import ClientsPage from "../pages/ClientsPage/ClientsPage";
import RoomsPage from "../pages/RoomsPage/RoomsPage";
import BookingsPage from "../pages/BookingsPage/BookingsPage";

const App = () => {
    const token = localStorage.getItem("access");
    const navigate = useNavigate()
    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, []);

    return (
        <Container>
            <Routes>
                {token ? (
                    <>
                        <Route path='/clients' element={<ClientsPage/>}/>
                        <Route path='/rooms' element={<RoomsPage/>}/>
                        <Route path='/booking' element={<BookingsPage/>}/>
                    </>
                ) : (
                    <Route path='/' element={<AuthPage/>}/>
                )}
            </Routes>
        </Container>
    );
};

export default App;