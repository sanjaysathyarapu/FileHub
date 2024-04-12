import React, {useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./login/login";
import Home from "./home/Home";
import Logout from "./Logout";
import MyFiles from "./sidebarItems/myFiles/MyFiles";
import {useAuth0} from "@auth0/auth0-react";

// Import your logo file

// Custom wrapper component to protect routes based on authentication
const ProtectedRoute = ({ element, ...rest }) => {
    const { user, isAuthenticated } = useAuth0();
    useEffect(() => {
        if (isAuthenticated) {
            console.log('User:', user); // For debugging
        }
    }, [user, isAuthenticated]);
    return isAuthenticated ? <element {...rest} /> : <Navigate to="/" />;
};


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/myfiles" element={<MyFiles />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </Router>

    );
}

export default App;
