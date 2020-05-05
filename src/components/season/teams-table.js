import React from 'react';
import DataTable, {
    positionCell,
    nationalityCell,
    teamCell,
    winsCell,
    pointsCell
} from '../data-table';

const SeasonTeamsTable = ({busy, data, match}) => {
    const {params: {year}} = match;

    return (
        <>
            <h1 className="uk-text-uppercase">{year} Constructor Standings</h1>
            {busy ? <div data-uk-spinner=""/> : (() => {
                const {
                    StandingsTable: {
                        StandingsLists: [
                            StandingsList = {}
                        ]
                    }
                } = data;
                const {ConstructorStandings = []} = StandingsList;
                const tableColumns = [
                    positionCell,
                    teamCell,
                    nationalityCell,
                    winsCell,
                    pointsCell
                ];
                const tableData = [];

                ConstructorStandings.forEach(standings => {
                    const {position, wins, points, Constructor} = standings;
                    const {nationality} = Constructor;

                    tableData.push({
                        position, nationality, wins, points,
                        Constructor
                    });
                });

                return <DataTable keyField="position" columns={tableColumns} data={tableData}/>;
            })()}
        </>
    );
};

export default SeasonTeamsTable;
