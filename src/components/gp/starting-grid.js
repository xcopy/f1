import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {
    driverCell,
    numberCell,
    positionCell,
    teamCell,
    timeCell
} from '../data-table';
import f1CarIcon from '../../img/f1-car-icon.svg';

export default function GPStartingGrid({race}) {
    const data = [];
    const columns = [
        positionCell,
        numberCell,
        driverCell,
        teamCell,
        timeCell
    ];

    const {QualifyingResults} = race;

    QualifyingResults
        .sort((a, b) => a.position - b.position)
        .forEach(result => {
            const {
                position,
                number,
                Driver,
                Constructor,
                Q1, Q2, Q3
            } = result;
            const {driverId} = Driver;

            data.push({
                position, number,
                Driver, Constructor,
                Time: {
                    time: Q3 || Q2 || Q1
                },
                driverId
            });
        });

    return (
        <div data-uk-grid="">
            <div className="uk-width-2-3">
                <DataTable keyField="driverId" {...{columns, data}}/>
            </div>
            <div className="uk-width-1-3">
                <div data-uk-grid="">
                    {data.map((row, i) => {
                        const {
                            Time: {time = '--:--'},
                            Driver: {code, givenName, familyName}
                        } = row;
                        const fullName = `${givenName} ${familyName}`;

                        return (
                            <div key={i} className="uk-width-1-2 uk-text-center">
                                <div className={i % 2 ? ' uk-margin-large-top' : ''}>
                                    <img src={f1CarIcon} alt="" style={{opacity: .5, width: 100}}/>
                                    <div className={`uk-text-bold uk-margin-remove uk-${code ? 'h3' : 'h5'}`}
                                         title={fullName}>
                                        {code
                                            ? code
                                            : <div className="uk-text-truncate">{fullName}</div>
                                        }
                                    </div>
                                    <div>{time || '--:--'}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

GPStartingGrid.propTypes = {
    race: PropTypes.object.isRequired
};
