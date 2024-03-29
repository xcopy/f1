import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {generatePath} from 'react-router';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faList, faUser, faCar} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

export const minYear = 1950;
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
        const {match: {params: {year}}, children} = this.props;
        const years = _.range(currentYear, minYear - 1, -1);
        const links = [
            ['results', faList],
            ['drivers', faUser],
            ['teams', faCar]
        ];

        return (
            <>
                <div className="uk-padding-small">
                    <div className="uk-grid-small" data-uk-grid="">
                        <div className="uk-width-1-6@m">
                            <select
                                className="uk-select"
                                value={year}
                                onChange={this.handleChange.bind(this)}>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className="uk-width-1-2@m uk-width-1-3@l">
                            <div className="uk-button-group uk-width-expand">
                                {links.map(([label, icon]) =>
                                    <NavLink
                                        to={`/${year}/${label}`} key={label}
                                        className="uk-button uk-button-default uk-text-capitalize uk-width-1-3"
                                        activeClassName="uk-button-primary">
                                        <span className="uk-visible@m">
                                            <FontAwesomeIcon icon={icon}/>
                                            {' '}
                                        </span>
                                        {label}
                                    </NavLink>
                                )}
                            </div>
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
