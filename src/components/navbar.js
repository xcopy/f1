import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../img/logo.svg'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';

const MenuItems = () => (
    <>
        <li><Link to="/">Standings</Link></li>
        <li><Link to="/drivers">Drivers</Link></li>
        <li><Link to="/teams">Teams</Link></li>
        <li><Link to="/circuits">Circuits</Link></li>
    </>
);

const GithubLink = () => (
    <a href="https://github.com/xcopy/f1" className="uk-navbar-item uk-text-large">
        <FontAwesomeIcon icon={faGithub}/>
    </a>
);

export default function Navbar() {
    return (
        <nav className="uk-background-secondary uk-padding-small uk-padding-remove-vertical" data-uk-navbar="">
            <div className="uk-navbar-left">
                <a href="/" className="uk-navbar-item uk-logo">
                    <img src={logo} alt="" style={{height: 20}} data-uk-img=""/>
                </a>
                <ul className="uk-navbar-nav uk-visible@m">
                    <MenuItems/>
                </ul>
            </div>
            <div className="uk-navbar-right uk-visible@m">
                <GithubLink/>
            </div>
            <div className="uk-navbar-right uk-hidden@m">
                <a href={'#offcanvas-slide'} className="uk-navbar-toggle" data-uk-toggle="">
                    <span data-uk-icon="menu"/>
                </a>
            </div>
            <div id="offcanvas-slide" data-uk-offcanvas="mode: push; overlay: true">
                <div className="uk-offcanvas-bar">
                    <ul className="uk-nav uk-nav-default uk-text-uppercase">
                        <MenuItems/>
                        <li>
                            <GithubLink/>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
