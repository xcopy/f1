import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Navbar from './components/navbar';
import Season from './components/season';

import 'uikit/dist/css/uikit.css';
import 'uikit/dist/js/uikit.min';
import 'uikit/dist/js/uikit-icons.min';

function App() {
    return (
        <>
            <Navbar/>

            <Switch>
                <Route path="/drivers">Drivers</Route>
                <Route path="/teams">Teams</Route>
                <Route path="/:year?" component={Season}/>
            </Switch>
        </>
    );
}

export default App;
