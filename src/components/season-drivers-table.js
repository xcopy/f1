import React from 'react';
import {Link} from 'react-router-dom';

const SeasonDriversTable = ({busy, year, data}) => {
    return (
        <>
            <h1 className="uk-text-uppercase">{year} Driver Standings</h1>
            <div className="uk-inline uk-dark uk-width-1-1">
                {/*<div className={busy ? 'uk-overlay-default uk-position-cover' : ''}/>*/}
                <table className="uk-table uk-table-striped">
                    <thead>
                    <tr>
                        <th className="uk-table-shrink">Pos</th>
                        <th>Driver</th>
                        <th>Nationality</th>
                        <th>Car</th>
                        <th>Wins</th>
                        <th>Pts</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.StandingsTable ? data.StandingsTable.StandingsLists[0].DriverStandings.map(standings => {
                        const {position, Driver, Constructors, wins, points} = standings;
                        const {driverId, givenName, familyName, nationality} = Driver;

                        return (
                            <tr key={position}>
                                <td className="uk-text-center">{position}</td>
                                <td>
                                    <Link to={`/drivers/${driverId}`}>{givenName} {familyName}</Link>
                                </td>
                                <td>{nationality}</td>
                                <td>
                                    {Constructors.map(constructor =>
                                        <div key={constructor.name}>{constructor.name}</div>
                                    )}
                                </td>
                                <td>{wins}</td>
                                <td><b>{points}</b></td>
                            </tr>
                        )
                    }) : null}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default SeasonDriversTable;
