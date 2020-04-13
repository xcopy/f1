import React, {Component} from 'react';
import api from '../api';

const currentYear = new Date().getFullYear()

class Season extends Component {
    constructor(props) {
        super(props);

        const {match} = props;
        const {year = currentYear} = match.params;
        console.log('constructor', year);

        this.state = {
            year: year,
            races: []
        };
    }

    componentDidMount() {
        const {year} = this.state;

        this.getRaces(year);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {year} = this.state;

        year === prevState.year || this.getRaces(year);
    }

    handleChangeSeason(e) {
        const {history} = this.props;
        const year = e.target.value;

        history.push(`/${e.target.value}`);

        this.getRaces(year);
    }

    getRaces(year) {
        api.get(year).then(response => {
            this.setState({
                year: year,
                races: response.data.RaceTable.Races
            });
        });
    }

    render() {
        const {year, races} = this.state;
        const seasons = [];

        for (let season = 1950; season <= currentYear; season++) {
            seasons.push(season.toString());
        }

        return (
            <>
                <div className="uk-padding-small">
                    <div className="uk-grid-small" data-uk-grid>
                        <div className="uk-width-1-3">
                            <select
                                className="uk-select"
                                value={year}
                                onChange={this.handleChangeSeason.bind(this)}>
                                {seasons.map(season =>
                                    <option
                                        key={season}
                                        value={season}>
                                        {season}
                                    </option>
                                )}
                            </select>
                        </div>

                        <div className="uk-width-1-3">
                            <select className="uk-select">
                                <option value="races">Races</option>
                                <option value="drivers">Drivers</option>
                                <option value="constructors">Teams</option>
                            </select>
                        </div>

                        {/*
                        <div className="uk-width-1-3">
                            <select className="uk-select"></select>
                        </div>
                        */}
                    </div>
                </div>
                <div className="uk-padding-small">
                    <h1 className="uk-text-uppercase">{year} Race Results</h1>
                    <table className="uk-table uk-table-striped">
                        <thead>
                            <tr>
                                <th>Round</th>
                                <th>Date</th>
                                <th>Grand Prix</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                        {races.map(race => {
                            const {round, date, raceName, Circuit} = race;
                            const {Location} = Circuit;
                            const {country, locality} = Location;

                            return (<tr key={round}>
                                <td>{round}</td>
                                <td>{date}</td>
                                <td>{raceName}</td>
                                <td>{locality}, {country}</td>
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}

export default Season;
