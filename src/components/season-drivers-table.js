import React from 'react';
import {linkToDriver, linkToTeam} from '../helpers';

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
                        const {nationality} = Driver;

                        return (
                            <tr key={position}>
                                <td className="uk-text-center">{position}</td>
                                <td>{linkToDriver(Driver)}</td>
                                <td>{nationality}</td>
                                <td>
                                    {Constructors.map(constructor =>
                                        <div key={constructor.constructorId}>{linkToTeam(constructor)}</div>
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
