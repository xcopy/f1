import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Spinner from '../spinner';
import Card from '../card';

const Leader = ({label, primary, secondary}) => {
    return (
        <div className="uk-grid-small" data-uk-grid="">
            <div className="uk-width-expand" data-uk-leader="">{label}</div>
            <div>
                <span className="uk-text-bold">{primary}</span>
                {' '}
                {secondary && <span className="uk-text-muted">({secondary})</span>}
            </div>
        </div>
    );
};

export default function DriverRecords({standings, races}) {
    const
        {busy: loadingStandings, data: Standings} = standings,
        {busy: loadingRaces, data: Races} = races;

    /*
    function round(num, exp = 2) {
        const pow = Math.pow(10, exp);
        return Math.round((num + Number.EPSILON) * pow) / pow;
    }
    */

    function getTitles() {
        return Standings.filter(({DriverStandings, ConstructorStandings}) => {
            const [{position}] = (DriverStandings || ConstructorStandings);
            return parseInt(position) === 1;
        }).length;
    }

    function getPoles() {
        return Races.filter(({Results: [{grid}]}) => parseInt(grid) === 1).length;
    }

    function getTotalOf(prop) {
        return Standings.map(({DriverStandings, ConstructorStandings}) => {
            const [standing] = (DriverStandings || ConstructorStandings);
            return parseInt(standing[prop]);
        }).reduce((total, num) => total + num, 0);
    }

    function getPodiums() {
        return Races.filter(({Results: [{position}]}) => parseInt(position) <= 3).length;
    }

    function getFastestLaps() {
        return Races.filter(race => {
            const {Results: [{FastestLap: {rank} = {}}]} = race;
            return parseInt(rank) === 1;
        }).length;
    }

    function getFinishes(top10 = false) {
        return Races.filter(({Results: [{positionText}]}) => {
            const position = parseInt(positionText);
            return top10 ? position <= 10 : position > 0;
        }).length;
    }

    return (
        <Card title="Records">
            {loadingStandings && loadingRaces ? <Spinner text="Loading records..."/> : (() => {
                const
                    entries = Races.length,
                    finishes = getFinishes(),
                    top10 = getFinishes(true),
                    wins = getTotalOf('wins');

                return (
                    <>
                        <Leader label="Championships" primary={getTitles()}/>
                        <Leader label="Entries" primary={entries}/>
                        <Leader
                            label="Finishes overall"
                            primary={finishes}
                            /*secondary={`${round(finishes * 100 / entries)}%`}*/
                        />
                        <Leader
                            label="Finishes in Top 10"
                            primary={top10}
                            /*secondary={`${round(top10 * 100 / entries)}%`}*/
                        />
                        <Leader
                            label="Wins"
                            primary={wins}
                            /*secondary={`${round(wins * 100 / entries)}%`}*/
                        />
                        <Leader label="Pole positions" primary={getPoles()}/>
                        <Leader label="Podiums" primary={getPodiums()}/>
                        <Leader label="Points" primary={getTotalOf('points')}/>
                        <Leader label="Fastest laps" primary={getFastestLaps()}/>

                        <div className="uk-text-muted uk-margin-top">
                            <FontAwesomeIcon icon={faInfoCircle}/> Some items may be inaccurate.
                        </div>
                    </>
                );
            })()}
        </Card>
    );
}

DriverRecords.propTypes = {
    standings: PropTypes.object.isRequired,
    races: PropTypes.object.isRequired
};
