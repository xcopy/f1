import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../img/logo.svg'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';

export default function Navbar() {
    return (
        <nav className="uk-background-secondary" data-uk-navbar="">
            <div className="uk-navbar-left">
                <a href="/" className="uk-navbar-item uk-logo">
                    <img src={logo} alt="" style={{height: 20}} data-uk-img=""/>
                </a>
                <ul className="uk-navbar-nav">
                    <li><Link to="/">Standings</Link></li>
                    <li><Link to="/drivers">Drivers</Link></li>
                    <li><Link to="/teams">Teams</Link></li>
                </ul>
            </div>
            <div className="uk-navbar-right">
                <a href="https://github.com/xcopy/f1" className="uk-navbar-item uk-logo">
                    <FontAwesomeIcon icon={faGithub}/>
                </a>
            </div>
        </nav>
    );
}
