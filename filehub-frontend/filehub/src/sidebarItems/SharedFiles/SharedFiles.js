import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../../navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import './SharedFiles.css';
import {Link} from "react-router-dom";

const SharedFiles = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sharedFiles, setSharedFiles] = useState([]);
    const { user, isLoading } = useAuth0();

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (user?.email) {
            axios.get("http://localhost:8080/file/shared-with", {
                params: { userEmail: user.email }
            })
                .then(response => {
                    setSharedFiles(response.data);
                })
                .catch(error => {
                    console.error("Error fetching shared files:", error);
                    setSharedFiles([]); // Maintain as an empty array
                });
        }
    }, [user, isLoading]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="home">
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} />
            <div className="home__content">
                <h1>Shared Files</h1>
                {sharedFiles && sharedFiles.length > 0 ? (
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
                        {sharedFiles.map(sharedFile => (
                            <tr key={sharedFile.id}>
                                {sharedFile.file.fileType === "pdf" ?
                                    <td><Link to={`/view/pdf/${sharedFile.file.fileId}`}>{sharedFile.file.fileName}</Link></td> :
                                    <td><Link to={`/edit/${sharedFile.file.fileId}`}>{sharedFile.file.fileName}</Link></td>
                                }
                                <td>{sharedFile.file.fileType}</td>
                                <td>{new Date(sharedFile.file.uploadedAt).toLocaleString()}</td>
                                <td>{new Date(sharedFile.file.lastEditedAt).toLocaleString()}</td>
                                <td>{sharedFile.file.fileSize}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : !isLoading && (
                    <div>No files have been shared with you yet.</div>
                )}
            </div>
        </div>
    );
};

export default SharedFiles;
