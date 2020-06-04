import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Spinner from '../spinner';
import Card from '../card';

export default function DriverRecords({standings, races}) {
    const
        {busy: loadingStandings, data: Standings} = standings,
        {busy: loadingRaces, data: Races} = races;

    function getTitlesCount() {
        return Standings.filter(standing => {
            const {DriverStandings, ConstructorStandings} = standing;
            const [{position}] = (DriverStandings || ConstructorStandings);
            return parseInt(position) === 1;
        }).length;
    }

    function getPolePositionsCount() {
        return Races.filter(race => {
            const {Results: [{grid}]} = race;
            return parseInt(grid) === 1;
        }).length;
    }

    function getTotalCountOf(prop) {
        return Standings.map(standing => {
            const {DriverStandings, ConstructorStandings} = standing;
            const [obj] = (DriverStandings || ConstructorStandings);
            return parseInt(obj[prop]);
        }).reduce((total, num) => total + num, 0);
    }

    function getPodiumsCount() {
        return Races.filter(race => {
            const {Results: [{position}]} = race;
            return parseInt(position) <= 3;
        }).length;
    }

    function getFastestLapsCount() {
        return Races.filter(race => {
            const {Results: [{FastestLap: {rank} = {}}]} = race;
            return parseInt(rank) === 1;
        }).length;
    }

    return (
        <Card title="Records">
            {loadingStandings && loadingRaces ? <Spinner text="Loading records..."/> : (() => {
                const rows = [
                    ['Championships', getTitlesCount()],
                    ['Entries', Races.length],
                    ['Pole positions', getPolePositionsCount()],
                    ['Wins', getTotalCountOf('wins')],
                    ['Podiums', getPodiumsCount()],
                    ['Points', getTotalCountOf('points')],
                    ['Fastest Laps', getFastestLapsCount()]
                ];

                return (
                    <>
                        {rows.map(([label, qty]) =>
                            <div
                                key={label}
                                data-uk-grid=""
                                className="uk-grid-small">
                                <div className="uk-width-expand" data-uk-leader="">
                                    {label}
                                </div>
                                <div className="uk-text-bold">{qty}</div>
                            </div>
                        )}

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
