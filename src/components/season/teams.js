import React, {useEffect} from 'react';
import DataTable, {
    positionCell,
    nationalityCell,
    teamCell,
    winsCell,
    pointsCell
} from '../data-table';
import seasonWithData from './with-data';

const SeasonTeams = ({busy, data, match, onReady}) => {
    const {params: {year}} = match;

    useEffect(() => {
        onReady(`${year}/constructorStandings`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year]);

    return (
        <>
            <h1 className="uk-text-uppercase">{year} Constructor Standings</h1>
            {busy ? <span data-uk-spinner=""/> : (() => {
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

export default seasonWithData(SeasonTeams);
