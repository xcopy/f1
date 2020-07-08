import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {LIMIT, remoteApi} from '../API';
import Alert from './alert';
import Spinner from './spinner';
import DriverResults from './driver/results';
import DriverStandings from './driver/standings';
import {normalizeRaces} from '../helpers';

export default class Standings extends Component {
    static propTypes = {
        input: PropTypes.object.isRequired,
        onReady: PropTypes.func.isRequired
    };

    state = {
        standings: {
            busy: true,
            data: []
        },
        races: {
            busy: true,
            data: []
        },
        season: null
    };

    cancelSource = axios.CancelToken.source();

    componentDidMount() {
        const
            {input: {id, model}} = this.props,
            key = `${model}s/${id}`,
            config = {cancelToken: this.cancelSource.token};

        axios.all([
            remoteApi.get(`${key}/${model}Standings`, config),
            remoteApi.get(`${key}/results`, config)
        ]).then(responses => {
            const
                [S, R] = responses,
                {data: {StandingsTable: {StandingsLists: Standings}}} = S,
                {data: {total, RaceTable: {Races}}} = R, // get first page of races
                pages = Math.ceil(total / LIMIT) - 1; // find rest pages of races

            this.setState(state => {
                return {
                    ...state,
                    standings: {
                        busy: false,
                        data: Standings
                    },
                    races: {
                        busy: pages > 0,
                        data: Races
                    }
                };
            });

            return pages;
        }).then(pages => {
            if (pages > 0) {
                for (let i = 1; i <= pages; i++) {
                    remoteApi.get(`${key}/results`, {
                        ...config,
                        params: {offset: i * LIMIT}
                    }).then(response => {
                        const {data: {RaceTable: {Races}}} = response;

                        this.setState(state => {
                            const {races: {data}} = state;

                            return {
                                ...state,
                                races: {
                                    busy: i < pages,
                                    data: data.concat(Races)
                                }
                            };
                        });
                    });
                }
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {onReady} = this.props;
        onReady(this.state);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const {races: {busy}} = nextState;
        return busy === false;
    }

    componentWillUnmount() {
        this.cancelSource.cancel('Request cancelled');
    }

    setSeason(e, season = null) {
        e.preventDefault();

        this.setState(state => ({
            ...state,
            season
        }));
    }

    render() {
        const {input: {id}} = this.props;
        const {
            standings: {busy: loadingStandings, data: standings},
            races: {busy: loadingRaces},
            season
        } = this.state;

        let {races: {data: races}} = this.state;

        // merge duplicate races with different results
        loadingRaces || (races = normalizeRaces(races));

        return (
            <>
                <hr className="uk-divider-icon"/>

                {loadingStandings
                    ? <Spinner text="Loading standings..."/>
                    : (standings.length > 0 ? (
                        <div data-uk-grid="" className="uk-grid-small">
                            <div className="uk-width-1-6@m">
                                <ul data-uk-tab="" className="uk-tab-left">
                                    <li>
                                        <a
                                            href="/"
                                            onClick={(e) => this.setSeason(e)}>
                                            Standings
                                        </a>
                                    </li>

                                    {standings.map(({season}) =>
                                        <li key={`${id}-${season}-standings`}>
                                            <a
                                                href="/"
                                                onClick={(e) => this.setSeason(e, season)}>
                                                Season {season}
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="uk-width-5-6@m">
                                {season
                                    ? loadingRaces
                                        ? <Spinner/>
                                        : <DriverResults races={races.filter(({season: s}) => s === season)}/>
                                    : <DriverStandings standings={standings}/>
                                }
                            </div>
                        </div>
                ) : <Alert/>)}
            </>
        );
    }
}
