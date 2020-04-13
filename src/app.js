import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Navbar from './components/navbar';
import Season, {currentYear} from './components/season';

import 'uikit/dist/css/uikit.min.css';
import UIkit from 'uikit';
import icons from 'uikit/dist/js/uikit-icons.min';

UIkit.use(icons);

function App() {
    return (
        <>
            <Navbar/>

            <Switch>
                <Route path="/drivers">Drivers</Route>
                <Route path="/teams">Teams</Route>
                <Route path="/:year(\d+)" component={Season}/>
                <Redirect exact from="/" to={`/${currentYear}`}/>
                <Route render={() => (
                    <h1 className="uk-margin-medium uk-text-center">Page not found. Sorry.</h1>
                )}/>
            </Switch>
        </>
    );
}

export default App;
