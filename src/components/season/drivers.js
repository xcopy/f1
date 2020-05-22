import React, {useEffect} from 'react';
import DataTable, {
    positionCell,
    nationalityCell,
    driverCell,
    teamCell,
    winsCell,
    pointsCell
} from '../data-table';
import seasonWithData from './with-data';
import Spinner from '../spinner';

const SeasonDrivers = ({busy, data, match, onReady}) => {
    const {params: {year}} = match;

    useEffect(() => {
        onReady(`${year}/driverStandings`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year]);

    return (
        <>
            <h1 className="uk-text-uppercase">{year} Driver Standings</h1>
            {busy ? <Spinner/> : (() => {
                const
                    {StandingsTable: {StandingsLists: [StandingsList = {}]}} = data,
                    {DriverStandings: tableData = []} = StandingsList,
                    tableColumns = [
                        positionCell,
                        driverCell,
                        nationalityCell,
                        teamCell,
                        winsCell,
                        pointsCell
                    ];

                return <DataTable
                    keyField="position"
                    columns={tableColumns}
                    data={tableData}
                />;
            })()}
        </>
    );
};

export default seasonWithData(SeasonDrivers);
