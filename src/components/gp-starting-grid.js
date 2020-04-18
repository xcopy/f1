import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {
    driverCell,
    numberCell,
    positionCell,
    teamCell,
    timeCell
} from './data-table';
import f1CarIcon from '../img/f1-car-icon.svg';

export default function GPStartingGrid({results, qualifyingResults}) {
    const columns = [
        positionCell,
        numberCell,
        driverCell,
        teamCell,
        timeCell
    ];
    const data = [];

    results
        .sort((a, b) => a.grid - b.grid)
        .forEach(result => {
            const {
                grid,
                number,
                Driver,
                Constructor
            } = result;
            const {driverId} = Driver;
            const [Q = {}] = qualifyingResults.filter(result => result.position === grid);
            const {Q1, Q2, Q3} = Q;

            data.push({
                position: grid, number,
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
                                    <img src={f1CarIcon} alt="" style={{opacity: .5}}/>
                                    <div className={`uk-text-bold uk-margin-remove uk-${code ? 'h1' : 'h4'}`}
                                         title={fullName}>
                                        {code
                                            ? code
                                            : <div className="uk-text-truncate">{fullName}</div>
                                        }
                                    </div>
                                    <div>{time}</div>
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
    results: PropTypes.array.isRequired,
    qualifyingResults: PropTypes.array.isRequired
};
