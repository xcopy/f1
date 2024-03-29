import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
// import styled from 'styled-components';
import Navbar from './components/navbar';
import Footer from './components/footer';
import SeasonLayout, {minYear, currentYear} from './components/season/layout';
import SeasonResults from './components/season/results';
import SeasonDrivers from './components/season/drivers';
import SeasonTeams from './components/season/teams';
import GPDetails from './components/gp/details';
import DriverList from './components/driver/list';
import DriverDetails from './components/driver/details';
import TeamList from './components/team/list';
import TeamDetails from './components/team/details';
import CircuitList from './components/circuit/list';
// import CircuitDetails from './components/circuit/details';

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
};

function App() {
    return (
        <div className="uk-flex uk-flex-column uk-height-viewport">
            <header>
                <Navbar/>
            </header>

            <main style={{flexGrow: 1}}>
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

                    <Route exact path="/circuits" component={CircuitList}/>
                    {/*<Route exact path="/circuits/:circuitId([a-z-_]+)" component={CircuitDetails}/>*/}

                    <Route exact path="/teams" component={TeamList}/>
                    <Route exact path="/teams/:teamId([a-z0-9-_]+)" component={TeamDetails}/>

                    <Route exact path="/drivers" component={DriverList}/>
                    <Route exact path="/drivers/:driverId([a-z0-9-_]+)" component={DriverDetails}/>

                    <Redirect exact from="/" to={`/${currentYear}/results`}/>

                    <Route render={() => (
                        <h1 className="uk-padding-small uk-margin-remove uk-text-center">Page not found. Sorry.</h1>
                    )}/>
                </Switch>
            </main>

            <footer>
                <Footer/>
            </footer>
        </div>
    );
}

export default App;
