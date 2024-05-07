import React, { useState, useEffect } from 'react';
import './FileEditor.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";
import {useParams} from "react-router-dom";
import JSZip from 'jszip';
import {xml2js, xml2json} from 'xml-js';
import mammoth from 'mammoth';


const FileEditor = () => {
    const {fileId} = useParams();
    const [content, setContent] = useState('<html><strong>Loading File..</strong></html>');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [file, setFile] = useState([]);
    const [cloudFrontURL, setCloudFrontURL] = useState(null);
    const [isConverting, setIsConverting] = useState(false);

    const saveFileContent = () => {
        setIsConverting(true);
        const decodedContent = encodeURIComponent(content); // Decode HTML content

        axios.post(`http://localhost:8080/file/convert/html-to-docx/${fileId}`, decodedContent)
            .then(response => {
                console.log(response.data);
                window.alert(response.data);
                setIsConverting(false);
            })
            .catch(error => {
                console.error(error);
                setIsConverting(false);
            });
    }



    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'color',
        'align',
        { margin: 'quill-margin-small' }, // Define custom margin classes
        { margin: 'quill-margin-medium' },
        { margin: 'quill-margin-large' }
    ];

    const modules = {
        toolbar: {
            container: [
                [{'header': '1'}, {'header': '2'}, {'font': []}],
                [{size: []}],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image', 'color'],
                [{'align': []}],
                [{ margin: [] }],
                ['clean']
            ],
        },
    };

    useEffect(() => {
        if (cloudFrontURL) {
            fetchFileContent();
        }
    }, [cloudFrontURL]);

    useEffect( () => {
        const fetchFile = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/file/${fileId}`);
                setFile(response.data);
                setCloudFrontURL(response.data.fileURL);

            } catch (error) {
                console.error("Error fetching file:", error);
            }
        };
        if (fileId) {
            fetchFile();
        }
    }, [fileId]);

    const fetchFileContent = () => {
        axios.get(`http://localhost:8080/file/convert/docx-to-html/${fileId}`)
            .then(response => {
                console.log(response);
                setContent(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div className="home">
            <Navbar toggleSidebar={toggleSidebar}/>
            <Sidebar isOpen={isSidebarOpen}/>
            <div className="home__content">

            <ReactQuill className="quill"
                theme="snow"
                value={content}
                formats={formats}
                        modules={modules}
                onChange={(value) => setContent(value)}
                style={{ height: '700px', width: '100%' }}
            />
                <button className="save-button" onClick={saveFileContent}>{isConverting ? 'Saving...' : 'Save'}</button>
            </div>
        </div>
    );
};

export default FileEditor;
