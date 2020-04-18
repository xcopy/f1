import React from 'react';
import DataTable, {
    positionCell,
    nationalityCell,
    driverCell,
    teamCell,
    winsCell,
    pointsCell
} from './data-table';

const SeasonDriversTable = ({busy, data, match}) => {
    const {params: {year}} = match;

    return (
        <>
            <h1 className="uk-text-uppercase">{year} Driver Standings</h1>
            {busy ? <div data-uk-spinner=""/> : (() => {
                const {StandingsTable} = data;
                const {StandingsLists} = {...StandingsTable};

                if (!StandingsLists?.length) {
                    return 'There are no results to display.';
                }

                const {DriverStandings} = StandingsLists[0];
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

export default SeasonDriversTable;
