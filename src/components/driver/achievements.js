import React from 'react';
import PropTypes from 'prop-types';

export default function DriverAchievements({data}) {
    const {standings} = data;
    const reducer = (total, num) => total + num;
    const rows = [
        ['Titles', getTitlesCount()],
        ['Entries', getEntriesCount()],
        // ['Starts', 0],
        ['Poles', 0],
        ['Wins', getWinsCount()],
        ['Podiums', 0],
        ['Points', getPointsCount()]
        // ['Fastest Laps', 0]
    ];

    function getTitlesCount() {
        return standings.filter(standing => {
            const {
                DriverStandings: [{position}]
            } = standing;

            return parseInt(position) === 1;
        }).length;
    }

    function getEntriesCount() {
        return standings
            .map(({round}) => parseInt(round))
            .reduce(reducer);
    }

    function getWinsCount() {
        return standings.map(standing => {
            const {
                DriverStandings: [{wins}]
            } = standing;

            return parseInt(wins);
        }).reduce(reducer);
    }

    function getPointsCount() {
        return standings.map(standing => {
            const {
                DriverStandings: [{points}]
            } = standing;

            return parseInt(points);
        }).reduce(reducer);
    }

    return (
        <>
            {rows.map(([label, qty]) =>
                <div
                    key={label}
                    data-uk-grid=""
                    className="uk-grid-small uk-text-uppercase">
                    <div className="uk-width-expand" data-uk-leader="">
                        {label}
                    </div>
                    <div className="uk-text-bold">{qty}</div>
                </div>
            )}
        </>
    );
}

DriverAchievements.propTypes = {
    data: PropTypes.object.isRequired
};
