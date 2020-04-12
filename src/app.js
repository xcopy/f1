import React from 'react';
import {
    BrowserRouter as Router,
    Switch, Route, Link
} from 'react-router-dom';

import 'uikit/dist/css/uikit.css';
import 'uikit/dist/js/uikit.min';
import 'uikit/dist/js/uikit-icons.min';

function App() {
    return (
        <>
            <Router>
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

                <Switch>
                    <Route path="/drivers">Drivers</Route>
                    <Route path="/teams">Teams</Route>
                    <Route path="/">Standings</Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;
