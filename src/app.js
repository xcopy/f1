import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './components/navbar';
import Footer from './components/footer';
import SeasonLayout, {minYear, currentYear} from './components/season/layout';
import SeasonResults from './components/season/results';
import SeasonDrivers from './components/season/drivers';
import SeasonTeams from './components/season/teams';
import GPDetails from './components/gp/details';
import DriverList from './components/driver/list';
import DriverDetails from './components/driver/details';

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

const Layout = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    main {
        flex-grow: 1;
    }
`;

function App() {
    return (
        <Layout>
            <header>
                <Navbar/>
            </header>

            <main>
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
                    <Route exact path="/drivers/:id(\w+)" component={DriverDetails}/>

                    <Redirect exact from="/" to={`/${currentYear}/results`}/>

                    <Route render={() => (
                        <h1 className="uk-padding-small uk-margin-remove uk-text-center">Page not found. Sorry.</h1>
                    )}/>
                </Switch>
            </main>

            <footer>
                <Footer/>
            </footer>
        </Layout>
    );
}

export default App;
