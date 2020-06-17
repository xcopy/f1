import React, {useEffect, useState} from 'react';
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
import Card from '../card';
import Wiki from '../wiki';

const SeasonResults = ({busy, data, match, onReady}) => {
    const {params: {year}} = match;
    const [url, setUrl] = useState('');

    useEffect(() => {
        onReady(`${year}/results/1`);
        setUrl(`https://en.wikipedia.org/wiki/${year}_Formula_One_${year <= 1980 ? 'season' : 'World_Championship'}`);
        // eslint-disable-next-line
    }, [year]);

    return busy ? <Spinner/> : (
        <>
            <h1 className="uk-text-uppercase">{year} Race Results</h1>
            <hr className="uk-divider-icon"/>
            <Card title="Summary">
                <Wiki url={url}/>
            </Card>
            <hr className="uk-divider-icon"/>
            {(() => {
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
