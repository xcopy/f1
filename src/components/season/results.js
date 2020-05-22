import React, {useEffect} from 'react';
import DataTable, {
    roundCell,
    dateCell,
    raceCell,
    locationCell,
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
                    roundCell,
                    dateCell,
                    raceCell,
                    locationCell,
                    driverCell,
                    teamCell,
                    lapsCell,
                    timeCell
                ];
                const tableData = Races.map(race => {
                    const {Results: [result]} = race;
                    return Object.assign({}, race, result);
                });

                return <DataTable
                    keyField="round"
                    columns={tableColumns}
                    data={tableData}
                />;
            })()}
        </>
    );
};

export default seasonWithData(SeasonResults);
