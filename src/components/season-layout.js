import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {generatePath} from 'react-router';

export const currentYear = new Date().getFullYear();

export default class SeasonLayout extends Component {
    constructor(props) {
        super(props);

        const {match} = props;
        const {year} = match.params;

        this.state = {
            year: year
        };
    }

    handleChange(e) {
        const {match, history} = this.props;
        const {path} = match;
        const year = e.target.value;
        const url = generatePath(path, {year});

        this.setState({
            year
        }, history.push(url));
    }

    render() {
        const {children} = this.props;
        const {year} = this.state;
        const years = [];

        for (let y = currentYear; y >= 1950; y--) {
            years.push(y.toString());
        }

        const links = {
            results: ['table', 'Results'],
            drivers: ['users', 'Drivers'],
            teams: ['nut', 'Teams']
        };

        return (
            <>
                <div className="uk-padding-small">
                    <div className="uk-grid-small" data-uk-grid>
                        <div className="uk-width-1-6">
                            <select
                                className="uk-select"
                                value={year}
                                onChange={this.handleChange.bind(this)}>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>

                        <div className="uk-width-auto">
                            {Object.keys(links).map(key => {
                                const [icon, label] = links[key];

                                return (
                                    <NavLink to={`/${year}/${key}`} key={key}
                                        className="uk-button uk-button-default"
                                        activeClassName="uk-button-primary">
                                        <span data-uk-icon={icon}/>{' '}{label}
                                    </NavLink>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="uk-padding-small">
                    {children}
                </div>
            </>
        );
    }
}