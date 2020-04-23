import React from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import DataTable, {
    driverCell,
    teamCell,
    lapsCell,
    timeCell
} from '../data-table';

const SeasonResultsTable = ({busy, data, match}) => {
    const {params: {year}} = match;

    return (
        <>
            <h1 className="uk-text-uppercase">{year} Race Results</h1>
            {busy ? <div data-uk-spinner=""/> : (() => {
                const {RaceTable} = data;
                const {Races = []} = {...RaceTable};

                const tableColumns = [
                    {
                        name: 'Round',
                        selector: 'round',
                        center: true,
                        grow: 0
                    },
                    {
                        name: 'Date',
                        selector: 'date',
                        format: row => moment(row.date).format('DD MMM YYYY')
                    },
                    {
                        name: 'Grand Prix',
                        selector: 'raceName',
                        grow: 2,
                        cell: row => {
                            const {round, raceName} = row;
                            return <Link to={`/${year}/results/${round}`}>{raceName}</Link>;
                        }
                    },
                    {
                        name: 'Location',
                        grow: 2,
                        cell: row => {
                            const {
                                Circuit: {
                                    circuitName,
                                    Location: {country, locality}
                                }
                            } = row;

                            return (
                                <div>
                                    <div>{circuitName}</div>
                                    <div>{locality}, {country}</div>
                                </div>
                            );
                        }
                    },
                    driverCell,
                    teamCell,
                    lapsCell,
                    timeCell
                ];
                const tableData = [];

                Races.forEach(race => {
                    const {round, date, raceName, Circuit, Results} = race;
                    const {laps, Driver, Constructor, Time} = Results[0];

                    tableData.push({
                        round, date, raceName, laps,
                        Circuit, Driver, Constructor, Time
                    });
                });

                return <DataTable keyField="round" columns={tableColumns} data={tableData}/>;
            })()}
        </>
    );
};

export default SeasonResultsTable;
