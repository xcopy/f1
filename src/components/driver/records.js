import React from 'react';
import PropTypes from 'prop-types';

export default function DriverRecords({data}) {
    const {Standings, QualifyingResults, Results} = data;
    const reducer = (total, num) => total + num;
    const rows = [
        ['Championships', getTitlesCount()],
        ['Entries', getEntriesCount()],
        ['Pole positions', QualifyingResults.length],
        ['Wins', getTotalCountOf('wins')],
        ['Podiums', getPodiumsCount()],
        ['Career points', getTotalCountOf('points')],
        ['Fastest Laps', getFastestLapsCount()]
    ];

    function getTitlesCount() {
        return Standings.filter(standing => {
            const {DriverStandings: [{position}]} = standing;
            return parseInt(position) === 1;
        }).length;
    }

    function getEntriesCount() {
        return Standings
            .map(({round}) => parseInt(round))
            .reduce(reducer);
    }

    function getTotalCountOf(prop) {
        return Standings.map(standing => {
            const {DriverStandings: [obj]} = standing;
            return parseInt(obj[prop]);
        }).reduce(reducer);
    }

    function getPodiumsCount() {
        return Results.filter(result => {
            const {Results: [{position}]} = result;
            return parseInt(position) <= 3;
        }).length;
    }

    function getFastestLapsCount() {
        return Results.filter(result => {
            const {Results: [{FastestLap: {rank} = {}}]} = result;
            return parseInt(rank) === 1;
        }).length;
    }

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
        </>
    );
}

DriverRecords.propTypes = {
    data: PropTypes.object.isRequired
};
