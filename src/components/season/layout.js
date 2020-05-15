import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {generatePath} from 'react-router';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faList, faUser, faCar} from '@fortawesome/free-solid-svg-icons';

export const minYear = 2016;
export const currentYear = new Date().getFullYear();

export default class SeasonLayout extends Component {
    handleChange(e) {
        const {match: {
            path,
            params: {round}
        }, history} = this.props;
        const url = generatePath(path, {
            year: e.target.value,
            round
        });

        history.push(url);
    }

    render() {
        const {match, children} = this.props;
        const {params: {year}} = match;
        const years = [];

        for (let y = currentYear; y >= minYear; y--) {
            years.push(y.toString());
        }

        const links = {
            results: [faList, 'Results'],
            drivers: [faUser, 'Drivers'],
            teams: [faCar, 'Teams']
        };

        return (
            <>
                <div className="uk-padding-small">
                    <div className="uk-grid-small" data-uk-grid="">
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
                                        <FontAwesomeIcon icon={icon}/>{' '}{label}
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
