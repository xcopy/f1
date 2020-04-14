import React, {Component} from 'react';
import api from '../api';
import Moment from 'react-moment';

export default class SeasonResults extends Component {
    constructor(props) {
        super(props);

        this.state = {
            busy: false,
            results: []
        };
    }

    componentDidMount() {
        this.getResults();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.props.year === prevProps.year || this.getResults();
    }

    getResults() {
        const {year} = this.props;

        this.setState({
            busy: true
        }, () =>
            api.get(`${year}/results/1`).then(response => {
                this.setState({
                    busy: false,
                    results: response.data.RaceTable.Races
                });
            })
        );
    }

    render() {
        const {year} = this.props;
        const {busy, results} = this.state;

        return (
            <>
                <h1 className="uk-text-uppercase">{year} Race Results</h1>
                <div className="uk-inline uk-dark uk-width-1-1">
                    <div className={busy ? 'uk-overlay-default uk-position-cover' : ''}/>
                    <table className="uk-table uk-table-striped">
                        <thead>
                            <tr>
                                <th className="uk-table-shrink">Round</th>
                                <th>Date</th>
                                <th>Grand Prix</th>
                                <th>Location</th>
                                <th>Winner</th>
                                <th>Laps</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(race => {
                                const {round, date, raceName, Circuit, Results} = race;
                                const {Location, circuitName} = Circuit;
                                const {country, locality, lat, long} = Location;
                                const {laps, Driver, Constructor, Time} = Results[0];
                                const {givenName, familyName} = Driver;

                                return (
                                    <tr key={round}>
                                        <td className="uk-text-center">{round}</td>
                                        <td>
                                            <Moment format="DD MMM YYYY">{date}</Moment>
                                        </td>
                                        <td>{raceName}</td>
                                        <td>
                                            <div>
                                                <a href={`https://google.com/maps/?q=${lat},${long}`}>{circuitName}</a>
                                            </div>
                                            {locality}, {country}
                                        </td>
                                        <td>
                                            <div>{givenName} {familyName}</div>
                                            <b>{Constructor.name}</b>
                                        </td>
                                        <td>{laps}</td>
                                        <td>{Time.time}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}
