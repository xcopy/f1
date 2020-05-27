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
            cell: ({position, positionText}) => {
                const pos = parseInt(positionText || position);

                return pos === 1 ? (
                    <FontAwesomeIcon icon={faTrophy} style={{color: '#FFD700'}}/>
                ) : pos;
            }
        }
    ];

    const data = standings.map(standing => {
        const {
            season, round,
            DriverStandings: [{position, positionText, points, wins, Constructors}]
        } = standing;

        return {
            season,
            round,
            Constructors,
            position,
            positionText,
            wins,
            points
        };
    });

    return <DataTable keyField="season" {...{columns, data}}/>;
}

DriverStandings.propTypes = {
    standings: PropTypes.array.isRequired
};
