import React, {Component} from 'react';
import api from '../api';

const currentYear = new Date().getFullYear()

class Season extends Component {
    constructor(props) {
        super(props);

        const {match} = props;
        const {year = currentYear} = match.params;

        this.state = {
            tab: 'results',
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

        history.push(`/${e.target.value}`);

        this.getResults(year);
    }

    handleChangeTab(e) {
        this.setState({
            tab: e.target.value
        });
    }

    getResults(year) {
        api.get(year).then(response => {
            this.setState({
                year: year,
                results: response.data.RaceTable.Races
            });
        });
    }

    render() {
        const {tab, year, results} = this.state;
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
                            <select
                                className="uk-select"
                                value={tab}
                                onChange={this.handleChangeTab.bind(this)}>
                                <option value="results">Results</option>
                                <option value="drivers">Drivers</option>
                                <option value="constructors">Constructors</option>
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
                    <h1 className="uk-text-uppercase">
                        {year} {{
                            'results': 'Race Results',
                            'drivers': 'Driver Standings',
                            'constructors': 'Constructor Standings',
                        }[tab]}
                    </h1>

                    {tab === 'results' && (
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
                            {results.map(race => {
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
                    )}

                    {tab === 'drivers' && 'Drivers'}
                    {tab === 'constructors' && 'Constructors'}
                </div>
            </>
        );
    }
}

export default Season;
