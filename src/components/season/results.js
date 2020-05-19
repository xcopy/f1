import React, {useEffect} from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import DataTable, {
    driverCell,
    teamCell,
    lapsCell,
    timeCell
} from '../data-table';
import seasonWithData from './with-data';
import Spinner from '../spinner';

const SeasonResults = ({busy, data, match, onReady}) => {
    const {params: {year}} = match;

    useEffect(() => {
        onReady(`${year}/results/1`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year]);

    return (
        <>
            <h1 className="uk-text-uppercase">{year} Race Results</h1>
            {busy ? <Spinner/> : (() => {
                const {RaceTable: {Races}} = data;

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

                const tableData = Races.map(race => {
                    const {round, date, raceName, Circuit, Results: [results]} = race;
                    const {laps, Driver, Constructor, Time} = results;

                    return {
                        round, date, raceName, laps,
                        Circuit, Driver, Constructor, Time
                    };
                });

                return <DataTable keyField="round" columns={tableColumns} data={tableData}/>;
            })()}
        </>
    );
};

export default seasonWithData(SeasonResults);
