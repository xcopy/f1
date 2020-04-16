import React, {useState, useEffect} from 'react';
import api from '../api';
import LinkDriver from "./link-driver";
import LinkTeam from "./link-team";

const GrandPrixDetails = ({match}) => {
    const {year, round} = match.params;
    const [busy, setBusy] = useState(true);
    const [race, setRace] = useState({});

    useEffect(() => {
        let isMounted = true;

        api.get(`${year}/${round}/results`)
            .then(response => {
                const {RaceTable} = response.data;
                const {Races} = RaceTable;

                if (isMounted) {
                    setRace(Races[0]);
                    setBusy(false);
                }
            });

        return () => {
            isMounted = false
        };
    });

    return (
        <>
            {busy ? <div data-uk-spinner=""/> : (() => {
                const {season, raceName, Results} = race;

                return (
                    <>
                        <h1 className="uk-text-uppercase">{season} {raceName}</h1>
                        <div data-uk-grid="">
                            <div className="uk-width-1-6">
                                <ul className="uk-tab-left" data-uk-tab="connect: #contents; animation: uk-animation-fade">
                                    <li>
                                        <a href="/">Race Result</a>
                                    </li>
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
                                                <th>Time/Retired</th>
                                                <th>Laps</th>
                                                <th>Points</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {Results.map(result => {
                                                const {position, Driver, Constructor, laps, points, Time, status} = result;
                                                const {driverId, permanentNumber} = Driver;

                                                return (
                                                    <tr key={driverId}>
                                                        <td>{position}</td>
                                                        <td>{permanentNumber}</td>
                                                        <td>
                                                            <LinkDriver driver={Driver}/>
                                                        </td>
                                                        <td>
                                                            <LinkTeam constructor={Constructor}/>
                                                        </td>
                                                        <td>{Time ? Time.time : status}</td>
                                                        <td>{laps}</td>
                                                        <td><b>{points}</b></td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </li>
                                    <li>2</li>
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