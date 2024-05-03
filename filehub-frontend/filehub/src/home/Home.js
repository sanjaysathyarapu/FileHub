// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth0 } from '@auth0/auth0-react';
// import Navbar from '../navbar/Navbar';
// import Sidebar from '../sidebar/Sidebar';
// import './Home.css';
//
// const Home = () => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [userStats, setUserStats] = useState({ noOfFilesUploaded: 'Loading...', noOfFilesShared: 'Loading...' });
//     const { user, isAuthenticated } = useAuth0();
//
//     useEffect(() => {
//         const fetchUserStats = async () => {
//             try {
//                 // Check for the user's email
//                 const userEmail = user?.email;
//
//                 if (userEmail) {
//                     const response = await axios.get(`http://localhost:8080/file/user/stats`, {
//                         params: { email: userEmail } // Passing email as request parameter
//                     });
//                     setUserStats({
//                         noOfFilesUploaded: response.data.noOfFilesUploaded,
//                         noOfFilesShared: response.data.noOfFilesShared
//                     });
//                 } else {
//                     throw new Error('Missing Email');
//                 }
//             } catch (error) {
//                 console.error('Error fetching user stats:', error.message);
//                 setUserStats({ noOfFilesUploaded: 'Error', noOfFilesShared: 'Error' });
//             }
//         };
//
//         if (isAuthenticated && user) {
//             fetchUserStats();
//         }
//     }, [user, isAuthenticated]);
//
//     const toggleSidebar = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };
//
//     return (
//         <div className="home">
//             <Navbar toggleSidebar={toggleSidebar} />
//             <Sidebar isOpen={isSidebarOpen} />
//             <div className="home__content">
//                 <h1>Welcome, {isAuthenticated ? user.nickname : 'Guest'}</h1>
//                 <div className="home__activity">
//                     <p>Number of files uploaded: {userStats.noOfFilesUploaded}</p>
//                     <p>Number of files shared: {userStats.noOfFilesShared}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Home;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './Home.css';

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userStats, setUserStats] = useState({ noOfFilesUploaded: 0, noOfFilesShared: 0 });
    const { user, isAuthenticated } = useAuth0();

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const userEmail = user?.email;
                if (userEmail) {
                    const response = await axios.get('http://localhost:8080/file/user/stats', {
                        params: { email: userEmail }
                    });
                    setUserStats({
                        noOfFilesUploaded: response.data.noOfFilesUploaded,
                        noOfFilesShared: response.data.noOfFilesShared
                    });
                } else {
                    throw new Error('Missing Email');
                }
            } catch (error) {
                console.error('Error fetching user stats:', error.message);
                setUserStats({ noOfFilesUploaded: 0, noOfFilesShared: 0 });
            }
        };

        if (isAuthenticated && user) {
            fetchUserStats();
        }
    }, [user, isAuthenticated]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const data = [
        { name: 'Files Uploaded', count: userStats.noOfFilesUploaded },
        { name: 'Files Shared', count: userStats.noOfFilesShared }
    ];

    return (
        <div className="home">
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} />
            <div className="home__content">
                <h1>Welcome, {isAuthenticated ? user.nickname : 'Guest'}</h1>
                <div className="home__activity">
                    <BarChart width={500} height={300} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
};

export default Home;

