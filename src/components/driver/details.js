import React, {useEffect} from 'react';
import _ from 'lodash';
import Moment from 'react-moment';
import Spinner from '../spinner';
import Alert from '../alert';
import Wiki from '../wiki';
import DriverTeams from './teams';
import DriverRecords from './records';
import withStandings from '../with-standings';
import {yearsToStr} from '../../helpers';

function DriverDetails(props) {
    const {
        match: {params: {driverId}},
        Driver,
        Standings,
        Races,
        onReady
    } = props;

    useEffect(() => {
        onReady({
            id: driverId,
            Model: 'Driver'
        });
        // eslint-disable-next-line
    }, [driverId]);

    function getSeasonsList() {
        const
            {data} = Standings,
            years = data.map(({season}) => parseInt(season));

        return `${years.length} (${yearsToStr(years)})`;
    }

    function getTeamsList() {
        const {data} = Standings;

        let teams = data.map(standing => {
            const {DriverStandings: [{Constructors}]} = standing;
            return Constructors;
        }).flat();

        teams = _.uniqWith(teams, _.isEqual);

        return <DriverTeams teams={teams}/>;
    }

    return (() => {
        const {busy, data: driver} = Driver;

        return (
            <>
                {busy ? <Spinner text="Loading driver details"/> : (() => {
                    return driver ? (() => {
                        const {url, familyName, givenName, nationality, dateOfBirth} = driver;

                        return (
                            <>
                                <h1 className="uk-text-uppercase">{givenName} {familyName}</h1>
                                <hr className="uk-divider-icon"/>
                                <div
                                    data-uk-grid=""
                                    data-uk-height-match="target: > div > .uk-card"
                                    className="uk-grid-small">
                                    <div className="uk-width-3-4">
                                        <Wiki url={url}>
                                            {(() => {
                                                const {busy} = Standings;

                                                return busy ? <Spinner text="Loading personal info..."/> : (
                                                    <div data-uk-grid="" className="uk-grid-small">
                                                        <div>
                                                            <b>Born:</b> <Moment format="DD MMMM YYYY">{dateOfBirth}</Moment>
                                                            <br/>
                                                            <b>Nationality:</b> {nationality}
                                                        </div>
                                                        <div>
                                                            <b>Seasons:</b> {getSeasonsList()}
                                                            <br/>
                                                            <b>Teams:</b> {getTeamsList()}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </Wiki>
                                    </div>
                                    <div className="uk-width-1-4">
                                        <DriverRecords standings={Standings} races={Races}/>
                                    </div>
                                </div>
                            </>
                        );
                    })() : <Alert>Driver not found.</Alert>
                })()}
            </>
        );
    })();
}

export default withStandings(DriverDetails);
