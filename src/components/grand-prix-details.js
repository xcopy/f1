import React, {useState, useEffect} from 'react';
import api from '../api';
import Moment from 'react-moment';
import DataTable, {
    positionCell,
    numberCell,
    driverCell,
    teamCell,
    lapsCell,
    timeCell,
    pointsCell
} from './data-table';

const GrandPrixDetails = ({match}) => {
    const {params: {year, round}} = match;
    const [busy, setBusy] = useState(true);
    const [races, setRaces] = useState([]);

    useEffect(() => {
        let isMounted = true;

        setRaces([]);
        setBusy(true);

        api.get(`${year}/${round}/results`)
            .then(response => {
                const {RaceTable: {Races}} = response.data;

                if (isMounted) {
                    setRaces(Races);
                    setBusy(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [year, round]);

    return (
        <>
            {busy ? <div data-uk-spinner=""/> : (() => {
                if (!races.length) {
                    return 'There are no results to display.';
                }

                const {
                    season,
                    date,
                    raceName,
                    Results,
                    Circuit: {
                        circuitName,
                        Location: {country, locality}
                    }
                } = races[0];

                return (
                    <>
                        <h1 className="uk-text-uppercase">{season} {raceName}</h1>
                        <div className="uk-margin-medium-bottom">
                            <span data-uk-icon="calendar"/>{' '}
                            <Moment format="DD MMM YYYY" className="uk-text-bold">{date}</Moment> / Round {round}
                            <div>
                                <span data-uk-icon="location"/>{' '}
                                {circuitName} / {locality}, {country}
                            </div>
                        </div>
                        <div data-uk-grid="">
                            <div className="uk-width-1-6">
                                <ul className="uk-tab-left" data-uk-tab="connect: #contents; animation: uk-animation-fade">
                                    <li><a href="/">Race Result</a></li>
                                    <li><a href="/">Fastest Laps</a></li>
                                    <li><a href="/">Starting Grid</a></li>
                                    <li><a href="/">Pit Stop Summary</a></li>
                                    <li><a href="/">Qualifying</a></li>
                                </ul>
                            </div>
                            <div className="uk-width-5-6">
                                <ul id="contents" className="uk-switcher">
                                    <li>
                                        {(() => {
                                            const tableColumns = [
                                                positionCell,
                                                numberCell,
                                                driverCell,
                                                teamCell,
                                                lapsCell,
                                                timeCell,
                                                pointsCell
                                            ];
                                            const tableData = [];

                                            Results.forEach(result => {
                                                const {
                                                    positionText,
                                                    number,
                                                    Driver,
                                                    Constructor,
                                                    laps,
                                                    points,
                                                    Time,
                                                    status
                                                } = result;

                                                tableData.push({
                                                    id: `${number}-${positionText}`,
                                                    positionText, number, laps, points, status,
                                                    Driver, Constructor, Time
                                                });
                                            });

                                            return <DataTable
                                                keyField="id"
                                                columns={tableColumns}
                                                data={tableData}/>
                                        })()}
                                    </li>
                                    <li>
                                        {(() => {
                                            const results = Results.filter(result => result.FastestLap);
                                            const tableColumns = [
                                                positionCell,
                                                numberCell,
                                                driverCell,
                                                teamCell,
                                                {
                                                    name: 'Lap',
                                                    selector: 'lap'
                                                },
                                                timeCell,
                                                {
                                                    name: 'Avg Speed (kph)',
                                                    selector: 'speed'
                                                }
                                            ];
                                            const tableData = [];

                                            results.sort((a, b) => {
                                                return a.FastestLap.rank - b.FastestLap.rank;
                                            }).forEach(result => {
                                                const {
                                                    number,
                                                    Driver,
                                                    Constructor,
                                                    FastestLap: {
                                                        rank,
                                                        lap,
                                                        Time,
                                                        AverageSpeed: {speed}
                                                    }
                                                } = result;

                                                tableData.push({
                                                    position: rank,
                                                    number, lap, speed,
                                                    Driver, Constructor, Time
                                                });
                                            });

                                            return <DataTable
                                                keyField="position"
                                                columns={tableColumns}
                                                data={tableData}/>
                                        })()}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                )
            })()}
        </>
    );
};

export default GrandPrixDetails;
