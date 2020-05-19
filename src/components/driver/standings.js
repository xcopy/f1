import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {pointsCell, positionCell, teamCell, winsCell} from '../data-table';

export default function DriverStandings({standings}) {
    const columns = [
        {
            name: 'Season',
            selector: 'season',
            center: true,
            grow: 0
        },
        {
            name: 'Rounds',
            center: true,
            selector: 'round'
        },
        teamCell,
        positionCell,
        winsCell,
        pointsCell
    ];

    columns.forEach(column => Object.assign(column, {sortable: true}));

    const data = standings.map(standing => {
        const {
            season, round,
            DriverStandings: [{position, points, wins, Constructors}]
        } = standing;

        return {
            season,
            round,
            Constructors,
            position: parseInt(position),
            wins: parseInt(wins),
            points: parseInt(points)
        };
    });

    return <DataTable keyField="season" {...{columns, data}}/>;
}

DriverStandings.propTypes = {
    standings: PropTypes.array.isRequired
};
