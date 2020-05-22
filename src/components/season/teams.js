import React, {useEffect} from 'react';
import DataTable, {
    positionCell,
    nationalityCell,
    teamCell,
    winsCell,
    pointsCell
} from '../data-table';
import seasonWithData from './with-data';
import Spinner from '../spinner';

const SeasonTeams = ({busy, data, match, onReady}) => {
    const {params: {year}} = match;

    useEffect(() => {
        onReady(`${year}/constructorStandings`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year]);

    return (
        <>
            <h1 className="uk-text-uppercase">{year} Constructor Standings</h1>
            {busy ? <Spinner/> : (() => {
                const
                    {StandingsTable: {StandingsLists: [StandingsList = {}]}} = data,
                    {ConstructorStandings: tableData = []} = StandingsList,
                    tableColumns = [
                        positionCell,
                        teamCell,
                        nationalityCell,
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

export default seasonWithData(SeasonTeams);
