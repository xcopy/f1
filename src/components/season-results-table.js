import React from 'react';
import Moment from 'react-moment';
import {Link} from 'react-router-dom';
import LinkDriver from './link-driver';
import LinkTeam from './link-team';

const SeasonResultsTable = ({busy, data, match}) => {
    const {params: {year}} = match;

    return (
        <>
            <h1 className="uk-text-uppercase">{year} Race Results</h1>
            {busy ? <div data-uk-spinner=""/> : (() => {
                const {RaceTable} = data;
                const {Races} = {...RaceTable};

                if (!Races?.length) {
                    return 'There are no results to display.';
                }

                return (
                    <table className="uk-table uk-table-striped">
                        <thead>
                            <tr>
                                <th className="uk-table-shrink">Round</th>
                                <th>Date</th>
                                <th>Grand Prix</th>
                                <th>Location</th>
                                <th>Winner</th>
                                <th>Car</th>
                                <th>Laps</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                        {Races.map(race => {
                            const {
                                round,
                                date,
                                raceName,
                                Circuit: {
                                    circuitName,
                                    Location: {country, locality}
                                },
                                Results
                            } = race;
                            const {
                                laps,
                                Driver,
                                Constructor,
                                Time: {time}
                            } = Results[0];

                            return (
                                <tr key={round}>
                                    <td className="uk-text-center">{round}</td>
                                    <td>
                                        <Moment format="DD MMM YYYY">{date}</Moment>
                                    </td>
                                    <td>
                                        <Link to={`/${year}/results/${round}`}>{raceName}</Link>
                                    </td>
                                    <td>
                                        <div>{circuitName}</div>
                                        {locality}, {country}
                                    </td>
                                    <td>
                                        <LinkDriver driver={Driver}/>
                                    </td>
                                    <td>
                                        <LinkTeam constructor={Constructor}/>
                                    </td>
                                    <td>{laps}</td>
                                    <td>{time}</td>
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

export default SeasonResultsTable;
