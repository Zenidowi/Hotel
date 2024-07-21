import React from 'react';
import Container from "../components/Container/Container";
import {Route, Routes} from "react-router-dom";
import AuthPage from "../pages/AuthPage/AuthPage";
import ClientsPage from "../pages/ClientsPage/ClientsPage";
import RoomsPage from "../pages/RoomsPage/RoomsPage";
import BookingsPage from "../pages/BookingsPage/BookingsPage";

const App = () => {


    return (
        <Container>
            <Routes>
                <Route path='/' element={<AuthPage/>}/>
                <Route path='/clients' element={<ClientsPage/>}/>
                <Route path='/rooms' element={<RoomsPage/>}/>
                <Route path='/booking' element={<BookingsPage/>}/>
            </Routes>
        </Container>
    );
};

export default App;