import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="uk-navbar-container" data-uk-navbar>
            <div className="uk-navbar-left">
                <a href="/" className="uk-navbar-item uk-logo">
                    <img src="/logo.svg" alt="" style={{height: 20}} data-uk-img/>
                </a>
                <ul className="uk-navbar-nav">
                    <li><Link to="/">Standings</Link></li>
                    <li><Link to="/drivers">Drivers</Link></li>
                    <li><Link to="/teams">Teams</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
