import React, {useState, useEffect} from 'react';
import api from '../api';
import Moment from "react-moment";
import LinkDriver from "./link-driver";
import LinkTeam from "./link-team";

const GrandPrixDetails = ({match}) => {
    const {params: {year, round}} = match;
    const [busy, setBusy] = useState(true);
    const [race, setRace] = useState({});

    useEffect(() => {
        let isMounted = true;

        api.get(`${year}/${round}/results`)
            .then(response => {
                const {RaceTable: {Races}} = response.data;

                if (isMounted) {
                    setRace(Races[0]);
                    setBusy(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            {busy ? <div data-uk-spinner=""/> : (() => {
                const {
                    season,
                    date,
                    raceName,
                    Results,
                    Circuit: {
                        circuitName,
                        Location: {country, locality}
                    }
                } = race;

                return (
                    <>
                        <h1 className="uk-text-uppercase">{season} {raceName}</h1>
                        <div className="uk-margin-medium-bottom">
                            <b className="uk-margin-small-right">
                                <Moment format="DD MMM YYYY">{date}</Moment>
                            </b>
                            {circuitName} / {locality}, {country}
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
                                        <table className="uk-table uk-table-striped">
                                            <thead>
                                                <tr>
                                                    <th className="uk-table-shrink">Pos</th>
                                                    <th>No</th>
                                                    <th>Driver</th>
                                                    <th>Car</th>
                                                    <th>Time/Status</th>
                                                    <th>Laps</th>
                                                    <th>Points</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {Results.map((result, i) => {
                                                const {
                                                    position,
                                                    number,
                                                    Driver,
                                                    Constructor,
                                                    laps,
                                                    points,
                                                    Time,
                                                    status
                                                } = result;

                                                return (
                                                    <tr key={`result-${i}`}>
                                                        <td className="uk-text-center">{position}</td>
                                                        <td>{number}</td>
                                                        <td>
                                                            <LinkDriver driver={Driver}/>
                                                        </td>
                                                        <td>
                                                            <LinkTeam constructor={Constructor}/>
                                                        </td>
                                                        <td>{Time?.time || status}</td>
                                                        <td>{laps}</td>
                                                        <td><b>{points}</b></td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </li>
                                    <li>
                                        <table className="uk-table uk-table-striped">
                                            <thead>
                                                <tr>
                                                    <th className="uk-table-shrink">Pos</th>
                                                    <th>No</th>
                                                    <th>Driver</th>
                                                    <th>Car</th>
                                                    <th>Lap</th>
                                                    <th>Time</th>
                                                    <th>Avg Speed (kph)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {(() => {
                                                const results = Results.filter(r => r.FastestLap);

                                                return results.sort((a, b) => {
                                                    return a.FastestLap.rank - b.FastestLap.rank;
                                                }).map((result, i) => {
                                                    const {
                                                        number,
                                                        Driver,
                                                        Constructor,
                                                        FastestLap: {
                                                            rank,
                                                            lap,
                                                            Time: {time},
                                                            AverageSpeed: {speed}
                                                        }
                                                    } = result;

                                                    return (
                                                        <tr key={`fastest-lap-${i}`}>
                                                            <td className="uk-text-center">{rank}</td>
                                                            <td>{number}</td>
                                                            <td>
                                                                <LinkDriver driver={Driver}/>
                                                            </td>
                                                            <td>
                                                                <LinkTeam constructor={Constructor}/>
                                                            </td>
                                                            <td>{lap}</td>
                                                            <td>{time}</td>
                                                            <td>{speed}</td>
                                                        </tr>
                                                    );
                                                })
                                            })()}
                                            </tbody>
                                        </table>
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
