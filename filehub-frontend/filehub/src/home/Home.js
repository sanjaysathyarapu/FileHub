import React, {useEffect, useState} from 'react';

import './Home.css';
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import {useAuth0} from "@auth0/auth0-react";

const Home = () => {

    const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            console.log('User:', user); // For debugging
        }
    }, [user, isAuthenticated]);


    useEffect(() => {
        const storeAccessToken = async () => {
            try {
                const tokenClaims = await getIdTokenClaims();
                const accessToken = tokenClaims.__raw; // Access token
                localStorage.setItem('accessToken', accessToken);
            } catch (error) {
                console.error('Error storing access token:', error);
            }
        };
        storeAccessToken();
    }, [getIdTokenClaims]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="home">
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} />
            <div className="home__content">
                <h1>Welcome, {isAuthenticated ? user.nickname : 'Guest'}</h1>
                <div className="home__activity">
                     Display user's past activity
                </div>
            </div>
        </div>
    );
};

export default Home;
