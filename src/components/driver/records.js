import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Spinner from '../spinner';

export default function DriverRecords({standings, races}) {
    const
        {busy: loadingStandings, data: Standings} = standings,
        {busy: loadingRaces, data: Races} = races,
        reducer = (total, num) => total + num;

    function getTitlesCount() {
        return Standings.filter(standing => {
            const {DriverStandings: [{position}]} = standing;
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
            const {DriverStandings: [obj]} = standing;
            return parseInt(obj[prop]);
        }).reduce(reducer);
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
        <div className="uk-card uk-card-default">
            <div className="uk-card-header">
                <h3 className="uk-card-title">Records</h3>
            </div>
            <div className="uk-card-body">
                {loadingStandings ? <Spinner text="Loading records..."/> : (() => {
                    const rows = [
                        ['Championships', getTitlesCount(), loadingStandings],
                        ['Entries', Races.length, loadingRaces],
                        ['Pole positions', getPolePositionsCount(), loadingRaces],
                        ['Wins', getTotalCountOf('wins'), loadingStandings],
                        ['Podiums', getPodiumsCount(), loadingRaces],
                        ['Career points', getTotalCountOf('points'), loadingStandings],
                        ['Fastest Laps', getFastestLapsCount(), loadingRaces]
                    ];

                    return (
                        <>
                            {rows.map(([label, qty, hidden]) =>
                                <div
                                    key={label}
                                    data-uk-grid=""
                                    className={`uk-grid-small${hidden ? ' uk-hidden' : ''}`}>
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
            </div>
        </div>
    );
}

DriverRecords.propTypes = {
    standings: PropTypes.object.isRequired,
    races: PropTypes.object.isRequired
};
