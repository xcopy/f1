import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Navbar from './components/navbar';
import SeasonLayout, {currentYear} from './components/season-layout';
import SeasonResults from './components/season-results';

import 'uikit/dist/css/uikit.min.css';
import UIkit from 'uikit';
import icons from 'uikit/dist/js/uikit-icons.min';

UIkit.use(icons);

const SeasonRouteWrapper = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props =>
            <SeasonLayout {...props}>
                <Component year={props.match.params.year} {...props}/>
            </SeasonLayout>
        }/>
    );
}

function App() {
    return (
        <>
            <Navbar/>

            <Switch>
                <SeasonRouteWrapper path="/:year(\d+)" component={SeasonResults}/>
                <Redirect exact from="/" to={`/${currentYear}`}/>
                <Route render={() => (
                    <h1 className="uk-margin-medium uk-text-center">Page not found. Sorry.</h1>
                )}/>
            </Switch>
        </>
    );
}

export default App;
