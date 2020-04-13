import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Navbar from './components/navbar';
import Season from './components/season';

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
                <Route path="/:year?" component={Season}/>
            </Switch>
        </>
    );
}

export default App;
