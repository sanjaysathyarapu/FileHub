import "./MyFiles.css"
import Navbar from "../../navbar/Navbar";
import Sidebar from "../../sidebar/Sidebar";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";

const MyFiles = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const { user } = useAuth0();

    useEffect(() => {
        // Fetch files from backend API
        axios.get("http://localhost:8080/file/all" , {
            params: {
                userEmail: user.name
            }
        })
            .then(response => {
                setFiles(response.data);
            })
            .catch(error => {
                console.error("Error fetching files:", error);
            });
    }, []);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="home">
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} />
            <div className="home__content">
                <h1>My Files</h1>
                <div className="upload-btn-container">
                    <button className="upload-btn">Upload File</button>
                </div>
                <table className="file-table">
                    <thead>
                    <tr>
                        <th>File Name</th>
                        <th>File Type</th>
                        <th>Uploaded At</th>
                        <th>Last Edited</th>
                        <th>File Size</th>
                    </tr>
                    </thead>
                    <tbody>
                    {files.map(file => (
                        <tr key={file.id}>
                            <td><a href={file.fileURL}>{file.fileName}</a></td>
                            <td>{file.fileType}</td>
                            <td>{file.uploadedAt}</td>
                            <td>{file.lastEditedAt}</td>
                            <td>{file.fileSize}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export default MyFiles;
