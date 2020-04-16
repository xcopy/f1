import React from 'react';
import {Link} from 'react-router-dom';

const SeasonTeamsTable = ({busy, data, match}) => {
    const {year} = match.params;

    return (
        <>
            <h1 className="uk-text-uppercase">{year} Constructor Standings</h1>
            {busy ? <div data-uk-spinner=""/> : (() => {
                const {StandingsTable} = data;
                const {StandingsLists} = {...StandingsTable};

                if (!StandingsLists?.length) {
                    return 'There are no results to display.';
                }

                const {ConstructorStandings} = StandingsLists[0];

                return (
                    <table className="uk-table uk-table-striped">
                        <thead>
                            <tr>
                                <th className="uk-table-shrink">Pos</th>
                                <th>Team</th>
                                <th>Nationality</th>
                                <th>Wins</th>
                                <th>Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                        {ConstructorStandings.map(standings => {
                            const {position, Constructor, wins, points} = standings;
                            const {constructorId, name, nationality} = Constructor;

                            return (
                                <tr key={position}>
                                    <td className="uk-text-center">{position}</td>
                                    <td>
                                        <Link to={`/teams/${constructorId}`}>{name}</Link>
                                    </td>
                                    <td>{nationality}</td>
                                    <td>{wins}</td>
                                    <td><b>{points}</b></td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                )
            })()}
        </>
    );
};

export default SeasonTeamsTable;
