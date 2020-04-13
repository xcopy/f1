import React, {Component} from 'react';
import Moment from 'react-moment';
import api from '../api';

export const currentYear = new Date().getFullYear()

export default class Season extends Component {
    constructor(props) {
        super(props);

        const {match} = props;
        const {year} = match.params;

        this.state = {
            busy: false,
            year: year,
            results: [],
            drivers: [],
            constructors: []
        };
    }

    componentDidMount() {
        const {year} = this.state;

        this.getResults(year);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {year} = this.state;

        year === prevState.year || this.getResults(year);
    }

    handleChangeSeason(e) {
        const {history} = this.props;
        const year = e.target.value;

        this.setState({
            busy: true,
            year,
        }, () => history.push(`/${year}`));
    }

    getResults(year) {
        api.get(year).then(response => {
            this.setState({
                busy: false,
                year: year,
                results: response.data.RaceTable.Races
            });
        });
    }

    render() {
        const {busy, year, results} = this.state;
        const seasons = [];

        for (let season = 1950; season <= currentYear; season++) {
            seasons.push(season.toString());
        }

        return (
            <>
                <div className="uk-padding-small">
                    <div className="uk-grid-small" data-uk-grid>
                        <div className="uk-width-1-6">
                            <select
                                className="uk-select"
                                value={year}
                                onChange={this.handleChangeSeason.bind(this)}
                                disabled={busy}>
                                {seasons.map(season =>
                                    <option
                                        key={season}
                                        value={season}>
                                        {season}
                                    </option>
                                )}
                            </select>
                        </div>

                        <div className="uk-width-auto">
                            <div data-uk-switcher="toggle: > *; connect: #switcher; animation: uk-animation-fade">
                                <button className="uk-button uk-button-default">
                                    <span data-uk-icon="table"/>{' '}Results
                                </button>
                                <button className="uk-button uk-button-default">
                                    <span data-uk-icon="users"/>{' '}Drivers
                                </button>
                                <button className="uk-button uk-button-default">
                                    <span data-uk-icon="nut"/>{' '}Constructors
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="uk-padding-small">
                    <ul id="switcher" className="uk-switcher">
                        <li className="uk-active">
                            <h1 className="uk-text-uppercase">{year} Race Results</h1>
                            <table className="uk-table uk-table-striped">
                                <thead>
                                    <tr>
                                        <th className="uk-table-shrink">Round</th>
                                        <th>Date</th>
                                        <th>Grand Prix</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map(race => {
                                        const {round, date, raceName, Circuit} = race;
                                        const {Location, circuitName} = Circuit;
                                        const {country, locality, lat, long} = Location;

                                        return (<tr key={round}>
                                            <td className="uk-text-center">{round}</td>
                                            <td>
                                                <Moment format="DD MMM YYYY">{date}</Moment>
                                            </td>
                                            <td>{raceName}</td>
                                            <td>
                                                <div>
                                                    <a href={`https://google.com/maps/?q=${lat},${long}`} target="_blank">{circuitName}</a>
                                                </div>
                                                {locality}, {country}
                                            </td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        </li>
                        <li>Drivers</li>
                        <li>Constructors</li>
                    </ul>
                </div>
            </>
        );
    }
}
