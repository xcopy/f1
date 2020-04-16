import React from 'react';
import Moment from 'react-moment';
import {Link} from 'react-router-dom';
import {linkToDriver, linkToTeam} from '../helpers';

const SeasonResultsTable = ({busy, data, match}) => {
    const {year} = match.params;

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
                            const {round, date, raceName, Circuit, Results} = race;
                            const {Location, circuitName} = Circuit;
                            const {country, locality} = Location;
                            const {laps, Driver, Constructor, Time} = Results[0];

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
                                    <td>{linkToDriver(Driver)}</td>
                                    <td>{linkToTeam(Constructor)}</td>
                                    <td>{laps}</td>
                                    <td>{Time.time}</td>
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
