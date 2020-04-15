import React from 'react';
import {Link} from 'react-router-dom';

const SeasonTeamsTable = ({busy, year, data}) => {
    return (
        <>
            <h1 className="uk-text-uppercase">{year} Constructor Standings</h1>
            <div className="uk-inline uk-dark uk-width-1-1">
                {/*<div className={busy ? 'uk-overlay-default uk-position-cover' : ''}/>*/}
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
                    {data.StandingsTable ? data.StandingsTable.StandingsLists[0].ConstructorStandings.map(standings => {
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
                    }) : null}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default SeasonTeamsTable;
