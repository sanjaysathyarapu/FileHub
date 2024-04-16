import "./MyFiles.css";
import Navbar from "../../navbar/Navbar";
import Sidebar from "../../sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

// Modal component for sharing files
const ShareModal = ({ isOpen, onClose, onShare, file }) => {
    const [email, setEmail] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        onShare(email, file);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Share File</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter email to share with"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="modal-share-btn">Share</button>
                    <button onClick={onClose} className="modal-close-btn">Close</button>
                </form>
            </div>
        </div>
    );
};

const MyFiles = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const { user } = useAuth0();

    useEffect(() => {
        // Fetch files from backend API
        axios.get("http://localhost:8080/file/all", {
            params: {
                userEmail: user.email // Assuming `user.email` holds the email of the logged-in user
            }
        })
            .then(response => {
                setFiles(response.data);
            })
            .catch(error => {
                console.error("Error fetching files:", error);
            });
    }, [user.email]); // Dependency array includes user.email to refetch when it changes

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleShareButtonClick = (file) => {
        setSelectedFile(file);
        setShareModalOpen(true);
    };

    const handleShare = (email, file) => {
        // Implement share functionality here
        // This is where you would call the backend API to share the file
        console.log(`Sharing ${file.fileName} with ${email}`);
        // Then close the modal
        setShareModalOpen(false);
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
                        <th>Actions</th> {/* Added Actions column for share button */}
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
                            <td>
                                {/* Share button for each file */}
                                <button className="share-btn" onClick={() => handleShareButtonClick(file)}>Share</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {/* ShareModal Component */}
                {shareModalOpen && (
                    <ShareModal
                        isOpen={shareModalOpen}
                        onClose={() => setShareModalOpen(false)}
                        onShare={handleShare}
                        file={selectedFile}
                    />
                )}
            </div>
        </div>
    );
};

export default MyFiles;
