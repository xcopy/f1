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
            data-uk-height-match="target: > div > .uk-card; row: true"
            className="uk-grid-small">
            {races.map(race => {
                const {season, round, date, raceName, Results: data} = race;

                return (
                    <div key={`${season}-${round}-results`} className="uk-width-1-2">
                        <div className="uk-card uk-card-default">
                            <div className="uk-card-header">
                                <h3 className="uk-card-title uk-margin-remove">{raceName}</h3>
                                <small className="uk-text-muted">
                                    Round {round}, {moment(date).format('DD MMM YYYY')}
                                </small>
                            </div>
                            <div className="uk-card-body">
                                <DataTable keyField="round" {...{columns, data}}/>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

DriverResults.propTypes = {
    races: PropTypes.array.isRequired
};
