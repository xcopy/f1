import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DataTable, {
    driverCell,
    teamCell,
    timeCell,
    pointsCell,
    positionCell
} from '../data-table';
import Card from '../card';

const columns = [
    driverCell,
    teamCell,
    timeCell,
    pointsCell,
    positionCell
];

export default function DriverResults({races}) {
    return (
        <div
            data-uk-grid=""
            data-uk-height-match="target: > div > .uk-card"
            className="uk-grid-small">
            {races.map(race => {
                const {season, round, date, raceName, Results: data} = race;
                const key = `${season}-${round}-results`;

                data.forEach(row => {
                    const {Driver: {driverId}} = row;
                    row.id = `${key}-${driverId}`;
                });

                return (
                    <div key={key} className="uk-width-1-2">
                        <Card title={() => {
                            return (
                                <>
                                    <div>{raceName}</div>
                                    <div className="uk-text-muted uk-text-small">
                                        Round {round}, {moment(date).format('DD MMM YYYY')}
                                    </div>
                                </>
                            );
                        }}>
                            <DataTable {...{columns, data}}/>
                        </Card>
                    </div>
                );
            })}
        </div>
    );
}

DriverResults.propTypes = {
    races: PropTypes.array.isRequired
};
