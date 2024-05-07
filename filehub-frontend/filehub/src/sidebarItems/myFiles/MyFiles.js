import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // Import Link component for navigation
import Navbar from "../../navbar/Navbar";
import Sidebar from "../../sidebar/Sidebar";
import "./MyFiles.css";

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
    const [uploadFile, setUploadFile] = useState(null);
    const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
    const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');
    const {user} = useAuth0();
    const fileInputRef = useRef(null);
    const [shareSuccessMessage, setShareSuccessMessage] = useState('');
    const [pdfViewModalOpen, setPdfViewModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // Fetch files from backend API
        axios.get("http://localhost:8080/file/all", {
            params: {
                userEmail: user.email
            }
        })
            .then(response => {
                console.log(response);
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

    const handlePdfView = (file) => {
        setSelectedFile(file);
        setPdfViewModalOpen(true);
    };


    const handleShare = (email, file) => {
        const url = `http://localhost:8080/file/${file.fileId}/share?userEmail=${encodeURIComponent(email)}`;

        axios.post(url)
            .then(response => {
                console.log("File shared successfully:", response.data);
                setShareSuccessMessage(`File "${file.fileName}" shared successfully with ${email}.`);
                setTimeout(() => setShareSuccessMessage(''), 5000);
            })
            .catch(error => {
                console.error("Error sharing file:", error);
            });

        setShareModalOpen(false);
    };

    const handleFileUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        axios.post(`http://localhost:8080/file/${user.email}/upload/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(response => {
                const newFile = response.data;
                setFiles(prevFiles => {
                    const updatedFiles = [...prevFiles, newFile];
                    setSelectedFile(newFile);
                    setUploadSuccessMessage('File uploaded successfully.');
                    setTimeout(() => setUploadSuccessMessage(''), 5000);
                    return updatedFiles;
                });
            })
            .catch(error => {
                console.error("Error uploading file:", error);
            });
    };

    const handleDelete = (fileId) => {
        axios.delete(`http://localhost:8080/file/${user.email}/${fileId}`)
            .then(() => {
                setFiles(files.filter(file => file.fileId !== fileId));
                setDeleteSuccessMessage('File deleted successfully.');
                setTimeout(() => setDeleteSuccessMessage(''), 5000);
            })
            .catch(error => {
                console.error("Error deleting file:", error);
            });
    };

    const handleSummarize = (file) => {
        setIsLoading(true);
        const url = `http://127.0.0.1:5000/tldr`;
        axios.get(url, {
            params: {
                fileUrl: file.fileURL
            }
        })
            .then(response => {
                setModalContent(response.data.summary);
                setIsModalOpen(true);
                setIsLoading(false);
                console.log("Summarization response:", response.data);

            })
            .catch(error => {
                setModalContent("Failed to retrieve summary.");
                setIsModalOpen(true);
                setIsLoading(false);
                console.error("Error during summarization:", error);
            });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Modal Component
    const Modal = ({isOpen, onClose, content}) => {
        if (!isOpen) return null;
        return (
            <div className="modal-backdrop">
                <div className="modal">
                    <h2>Document Summary</h2>
                    <p>{content}</p>
                    <button onClick={onClose} className="close-btn">Close</button>
                </div>
            </div>
        );
    };

    return (
        <div className="home">
            <Navbar toggleSidebar={toggleSidebar}/>
            <Sidebar isOpen={isSidebarOpen}/>
            <div className="home__content">
                <h1>My Files</h1>
                <div className="upload-btn-container">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{display: 'none'}}
                    />
                    <button className="upload-btn" onClick={handleFileUploadClick}>
                        Upload File
                    </button>
                </div>
                {shareSuccessMessage && <div className="success-message">{shareSuccessMessage}</div>}
                {deleteSuccessMessage && <div className="success-message">{deleteSuccessMessage}</div>}
                {uploadSuccessMessage && <div className="success-message">{uploadSuccessMessage}</div>}
                {isLoading && <div className="loader"></div>} {/* Loader displayed when loading */}
                <table className="file-table">
                    <thead>
                    <tr>
                        <th>File Name</th>
                        <th>File Type</th>
                        <th>Uploaded At</th>
                        <th>Last Edited</th>
                        <th>File Size</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {files.map(file => (
                        <tr key={file.id}>
                             { file.fileType === "pdf" ? <td><Link to={`/view/pdf/${file.fileId}`}>{file.fileName}</Link></td> :
                            <td><Link to={`/edit/${file.fileId}`}>{file.fileName}</Link></td> }
                            <td>{file.fileType}</td>
                            <td>{file.uploadedAt}</td>
                            <td>{file.lastEditedAt}</td>
                            <td>{file.fileSize}</td>
                            <td>
                                <div className="button-container">
                                    <button className="share-btn" onClick={() => handleShareButtonClick(file)}>Share
                                    </button>
                                    <button className="summarize-btn" onClick={() => handleSummarize(file)}>TL;DR
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(file.fileId)}>Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent}/>
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
