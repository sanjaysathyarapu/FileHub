import React from 'react';
import {FaHome, FaFileAlt, FaShareAlt, FaCompress, FaCog, FaSignOutAlt} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import {useAuth0} from "@auth0/auth0-react";

const Sidebar = ({ isOpen }) => {
    const { logout } = useAuth0();
    return (
        <aside className={isOpen ? 'sidebar' : 'sidebar sidebar--collapsed'}>
            <ul className="sidebar__list">
                <li className="sidebar__item">
                    <NavLink to="/home" className="sidebar__link" activeClassName="sidebar__link--active">
                        <FaHome />
                        <span className={isOpen ? 'sidebar__text' : 'sidebar__text sidebar__text--collapsed'}>Home</span>
                    </NavLink>
                </li>
                <li className="sidebar__item">
                    <NavLink to="/myfiles" className="sidebar__link" activeClassName="sidebar__link--active">
                        <FaFileAlt />
                        <span className={isOpen ? 'sidebar__text' : 'sidebar__text sidebar__text--collapsed'}>My Files</span>
                    </NavLink>
                </li>
                <li className="sidebar__item">
                    <NavLink to="/sharedfiles" className="sidebar__link" activeClassName="sidebar__link--active">
                        <FaShareAlt />
                        <span className={isOpen ? 'sidebar__text' : 'sidebar__text sidebar__text--collapsed'}>Shared Files</span>
                    </NavLink>
                </li>
                {/*<li className="sidebar__item">*/}
                {/*    <NavLink to="/compressfiles" className="sidebar__link" activeClassName="sidebar__link--active">*/}
                {/*        <FaCompress />*/}
                {/*        <span className={isOpen ? 'sidebar__text' : 'sidebar__text sidebar__text--collapsed'}>Compress Files</span>*/}
                {/*    </NavLink>*/}
                {/*</li>*/}
                {/*<li className="sidebar__item">*/}
                {/*    <NavLink to="/settings" className="sidebar__link" activeClassName="sidebar__link--active">*/}
                {/*        <FaCog />*/}
                {/*        <span className={isOpen ? 'sidebar__text' : 'sidebar__text sidebar__text--collapsed'}>Settings</span>*/}
                {/*    </NavLink>*/}
                {/*</li>*/}
                <li className="sidebar__item">
                    <NavLink to="/logout" className="sidebar__link" activeClassName="sidebar__link--active">
                        <FaSignOutAlt />
                        <span className={isOpen ? 'sidebar__text' : 'sidebar__text sidebar__text--collapsed'}>Log Out</span>
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
