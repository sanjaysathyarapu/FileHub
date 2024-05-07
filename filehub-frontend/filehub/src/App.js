import React, {useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./login/login";
import Home from "./home/Home";
import Logout from "./Logout";
import MyFiles from "./sidebarItems/myFiles/MyFiles";
import {useAuth0} from "@auth0/auth0-react";
import SharedFiles from "./sidebarItems/SharedFiles/SharedFiles";
import FileEditor from "./editor/FileEditor";
import PDFFileViewer from "./editor/PDFFileViewer";


const ProtectedRoute = ({ element, ...rest }) => {
    const { user, isAuthenticated } = useAuth0();
    useEffect(() => {
        if (isAuthenticated) {
            console.log('User:', user);
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
                <Route path="/sharedfiles" element={<SharedFiles />} />
                <Route path="/edit/:fileId" element={<FileEditor/>}/>
                <Route path="/view/pdf/:fileId" element={<PDFFileViewer/>}/>
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </Router>
    );
}

export default App;
