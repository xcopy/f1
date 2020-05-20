import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {pointsCell, teamCell, winsCell} from '../data-table';
import {faTrophy} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

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
        winsCell,
        pointsCell,
        {
            name: 'Pos',
            selector: 'position',
            center: true,
            grow: 0,
            cell: ({position}) => {
                return position === 1 ? (
                    <FontAwesomeIcon icon={faTrophy} style={{color: '#FFD700'}}/>
                ) : position;
            }
        }
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
