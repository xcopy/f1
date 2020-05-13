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

const SeasonDrivers = ({busy, data, match, onReady}) => {
    const {params: {year}} = match;

    useEffect(() => {
        onReady(`${year}/driverStandings`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year]);

    return (
        <>
            <h1 className="uk-text-uppercase">{year} Driver Standings</h1>
            {busy ? <span data-uk-spinner=""/> : (() => {
                const {
                    StandingsTable: {
                        StandingsLists: [
                            StandingsList = {}
                        ]
                    }
                } = data;
                const {DriverStandings = []} = StandingsList;
                const tableColumns = [
                    positionCell,
                    driverCell,
                    nationalityCell,
                    teamCell,
                    winsCell,
                    pointsCell
                ];
                const tableData = [];

                DriverStandings.forEach(standings => {
                    const {position, wins, points, Driver, Constructors} = standings;
                    const {nationality} = Driver;

                    tableData.push({
                        position, wins, points, nationality,
                        Driver, Constructors
                    });
                })

                return <DataTable keyField="position" columns={tableColumns} data={tableData}/>;
            })()}
        </>
    );
};

export default seasonWithData(SeasonDrivers);
