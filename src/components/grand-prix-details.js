import React, {useState, useEffect} from 'react';
import axios from 'axios';
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
import f1CarIcon from '../img/f1-car-icon.svg';

const GrandPrixDetails = ({match}) => {
    const {params: {year, round}} = match;
    const [busy, setBusy] = useState(true);
    const [races, setRaces] = useState([]);

    useEffect(() => {
        let isMounted = true;

        setRaces([]);
        setBusy(true);

        axios.all([
            api.get(`${year}/${round}/results`),
            api.get(`${year}/${round}/qualifying`)
        ]).then(axios.spread((R, Q) => {
            const {RaceTable: {Races: $races}} = R.data;
            const {RaceTable: {Races: $races_}} = Q.data;

            if (isMounted) {
                $races.length && (
                    $races[0].QualifyingResults = $races_[0]?.QualifyingResults || []
                );

                setRaces($races);
                setBusy(false);
            }
        }));

        return () => {
            isMounted = false;
        };
    }, [year, round]);

    return (
        <>
            {busy ? <div data-uk-spinner=""/> : (() => {
                if (!races.length) {
                    return 'There are no results to display';
                }

                const {
                    season,
                    date,
                    raceName,
                    Results,
                    QualifyingResults,
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
                                                    laps,
                                                    points,
                                                    status,
                                                    Driver,
                                                    Constructor,
                                                    Time
                                                } = result;
                                                const {driverId} = Driver;

                                                tableData.push({
                                                    positionText, number, laps, points, status,
                                                    Driver, Constructor, Time,
                                                    driverId
                                                });
                                            });

                                            return <DataTable
                                                keyField="driverId"
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

                                            results
                                                .sort((a, b) => a.FastestLap.rank - b.FastestLap.rank)
                                                .forEach(result => {
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
                                                    const {driverId} = Driver;

                                                    tableData.push({
                                                        position: rank,
                                                        number, lap, speed,
                                                        Driver, Constructor, Time,
                                                        driverId
                                                    });
                                                });

                                            return <DataTable
                                                keyField="driverId"
                                                columns={tableColumns}
                                                data={tableData}/>
                                        })()}
                                    </li>
                                    <li>
                                        {(() => {
                                            const results = Results.filter(result => result.grid > 0);
                                            const tableColumns = [
                                                positionCell,
                                                numberCell,
                                                driverCell,
                                                teamCell,
                                                timeCell
                                            ];
                                            const tableData = [];

                                            results
                                                .sort((a, b) => a.grid - b.grid)
                                                .forEach(result => {
                                                    const {
                                                        grid,
                                                        number,
                                                        Driver,
                                                        Constructor
                                                    } = result;
                                                    const {driverId} = Driver;
                                                    const [Q = {}] = QualifyingResults.filter(result => result.position === grid);
                                                    const {Q1, Q2, Q3} = Q;

                                                    tableData.push({
                                                        position: grid, number,
                                                        Driver, Constructor,
                                                        Time: {
                                                            time: Q3 || Q2 || Q1
                                                        },
                                                        driverId
                                                    });
                                                });

                                            return (
                                                <div data-uk-grid="">
                                                    <div className="uk-width-2-3">
                                                        <DataTable
                                                            keyField="driverId"
                                                            columns={tableColumns}
                                                            data={tableData}/>
                                                    </div>
                                                    <div className="uk-width-1-3">
                                                        <div data-uk-grid="">
                                                            {tableData.map((row, i) => {
                                                                const {
                                                                    Time: {time = '--:--'},
                                                                    Driver: {code, givenName, familyName}
                                                                } = row;
                                                                const fullName = `${givenName} ${familyName}`;

                                                                return (
                                                                    <div key={i} className="uk-width-1-2 uk-text-center">
                                                                        <div className={i % 2 ? ' uk-margin-large-top' : ''}>
                                                                            <img src={f1CarIcon} alt="" style={{opacity: .5}}/>
                                                                            <div className={`uk-text-bold uk-margin-remove uk-${code ? 'h1' : 'h4'}`}
                                                                                 title={fullName}>
                                                                                {code
                                                                                    ? code
                                                                                    : <div className="uk-text-truncate">{fullName}</div>
                                                                                }
                                                                            </div>
                                                                            <div>{time}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
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
