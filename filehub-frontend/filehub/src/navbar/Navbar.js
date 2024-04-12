import React, {useEffect} from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import './Navbar.css';
import logo from "../assets/FileHubLogo.jpeg";
import {useAuth0} from "@auth0/auth0-react";

const Navbar = ({ toggleSidebar }) => {
    const { user, isAuthenticated } = useAuth0();
    useEffect(() => {
        if (isAuthenticated) {
            console.log('User:', user); // For debugging
        }
    }, [user, isAuthenticated]);

    return (
        <nav className="navbar">
            <div className="navbar__left">
                <button className="navbar__menu-btn" onClick={toggleSidebar}>
                    <FaBars />
                </button>
                <img src={logo} className="navbar__logo" alt="Filehub Logo" />
                <div className="navbar__header">FileHub</div>
            </div>
            <div className="navbar__right">
                <div className="navbar__profile">
                    <FaUser className="navbar__profile-icon" />
                    <span className="navbar__profile-name">{isAuthenticated ? user.nickname : 'Guest'}</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
