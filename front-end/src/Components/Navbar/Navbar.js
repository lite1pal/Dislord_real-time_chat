import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ url, inner, isAuth }) => {
    return (
        <div className="Navbar">
            <p>Status <strong>{isAuth ? 'logged in' : 'no logged in'}</strong></p>
            <ul>
                {url && inner ? <li><Link to={url}>{inner}</Link></li> : ""}
            </ul>
        </div>
    )
}

export default Navbar;