import React, {useEffect} from 'react';
import './login.css';
import logo from '../assets/FileHubLogo.jpeg';
import {useAuth0} from "@auth0/auth0-react";


// Import your logo file

const Login = () => {
    const { loginWithRedirect} = useAuth0();

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="Filehub Logo" />
                <h1 className="App-title">Filehub</h1>
                <button onClick={() => loginWithRedirect()} className="Login-button">Login</button>
            </header>
        </div>
    );
}

export default Login;
