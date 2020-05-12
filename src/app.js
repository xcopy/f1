import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Navbar from './components/navbar';
import SeasonLayout, {minYear, currentYear} from './components/season/layout';
import SeasonResults from './components/season/results';
import SeasonDrivers from './components/season/drivers';
import SeasonTeams from './components/season/teams';
import GPDetails from './components/gp/details';
import DriverList from './components/driver/list';

import 'uikit/dist/css/uikit.min.css';
import UIkit from 'uikit';
import icons from 'uikit/dist/js/uikit-icons.min';

UIkit.use(icons);

const SeasonRouteWrapper = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props =>
            <SeasonLayout {...props}>
                <Component {...props}/>
            </SeasonLayout>
        }/>
    );
}

function App() {
    return (
        <>
            <Navbar/>

            <Switch>
                <SeasonRouteWrapper exact path="/:year(\d+)/results" component={SeasonResults}/>
                <SeasonRouteWrapper exact path="/:year(\d+)/results/:round(\d+)" component={GPDetails}/>

                <SeasonRouteWrapper path="/:year(\d+)/drivers" component={SeasonDrivers}/>
                <SeasonRouteWrapper path="/:year(\d+)/teams" component={SeasonTeams}/>

                <Route exact path="/:year(\d+)" render={({match}) => {
                    let {params: {year}} = match;

                    // must be 1950 >= year =< 2020
                    (year < minYear || year > currentYear) && (year = currentYear);

                    return <Redirect to={`/${year}/results`}/>;
                }}/>

                <Route exact path="/drivers" component={DriverList}/>

                <Redirect exact from="/" to={`/${currentYear}/results`}/>

                <Route render={() => (
                    <h1 className="uk-margin-medium uk-text-center">Page not found. Sorry.</h1>
                )}/>
            </Switch>
        </>
    );
}

export default App;
