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
                const className = isNaN(pos)
                    ? 'uk-text-danger'
                    : pos === 1 ? 'uk-text-warning' : '';

                return (
                    <span className={className}>
                        {pos === 1 ? <FontAwesomeIcon icon={faTrophy}/> : pos || positionText}
                    </span>
                );
            }
        }
    ];

    const data = standings.map(standing => {
        const {
            season, round,
            DriverStandings, ConstructorStandings
        } = standing;
        const [{
            position, positionText, points, wins,
            Constructor, Constructors
        }] = (DriverStandings || ConstructorStandings);

        return {
            id: `${season}-standing`,
            season,
            round,
            position,
            positionText,
            wins,
            points,
            Constructor,
            Constructors,
        };
    });

    return <DataTable {...{columns, data}}/>;
}

DriverStandings.propTypes = {
    standings: PropTypes.array.isRequired
};
