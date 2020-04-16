import React from 'react';
import {linkToDriver, linkToTeam} from '../helpers';

const SeasonDriversTable = ({busy, data, match}) => {
    const {year} = match.params;

    return (
        <>
            <h1 className="uk-text-uppercase">{year} Driver Standings</h1>
            {busy ? <div data-uk-spinner=""/> : (() => {
                const {StandingsTable} = data;
                const {StandingsLists} = {...StandingsTable};

                if (!StandingsLists?.length) {
                    return 'There are no results to display.';
                }

                const {DriverStandings} = StandingsLists[0];

                return (
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
                        {DriverStandings.map(standings => {
                            const {position, Driver, Constructors, wins, points} = standings;
                            const {nationality} = Driver;

                            return (
                                <tr key={position}>
                                    <td className="uk-text-center">{position}</td>
                                    <td>{linkToDriver(Driver)}</td>
                                    <td>{nationality}</td>
                                    <td>
                                        {Constructors.map(constructor => {
                                            const {constructorId} = constructor;

                                            return (
                                                <div key={constructorId}>{linkToTeam(constructor)}</div>
                                            );
                                        })}
                                    </td>
                                    <td>{wins}</td>
                                    <td><b>{points}</b></td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                );
            })()}
        </>
    );
};

export default SeasonDriversTable;
