import React, {Component} from 'react';
import axios from 'axios';
import _ from 'lodash';
import {LIMIT, localApi, remoteApi} from '../API';
import Alert from './alert';
import Spinner from './spinner';
import DriverResults from './driver/results';
import DriverStandings from './driver/standings';
import {normalizeRaces} from '../helpers';

export default function withStandings(WrappedComponent) {
    return class extends Component {
        state = {
            Constructor: {
                busy: true
                // data: null
            },
            Driver: {
                busy: true
                // data: null
            },
            Standings: {
                busy: true,
                data: []
            },
            Races: {
                busy: true,
                data: []
            }
        };

        cancelSource = axios.CancelToken.source();

        fetchData(input) {
            const
                {id, Model} = input,
                model = Model.toLowerCase(),
                key = `${model}s/${id}`;

            localApi.get(`${model}s`).then(({data}) => {
                const
                    // get array of Drivers/Constructors
                    Array = _.get(data, `${Model}Table.${Model}s`),
                    // and find Driver/Constructor by id
                    Entity = Array.find(e => e[`${model}Id`] === id);

                this.setState({
                    [Model]: {
                        busy: false,
                        data: Entity
                    }
                });

                return Entity;
            }).then(Entity => {
                const config = {
                    cancelToken: this.cancelSource.token
                };

                Entity && axios.all([
                    remoteApi.get(`${key}/${model}Standings`, config),
                    remoteApi.get(`${key}/results`, config)
                ]).then(responses => {
                    const
                        [S, R] = responses,
                        {data: {StandingsTable: {StandingsLists: Standings}}} = S,
                        {data: {total, RaceTable: {Races}}} = R, // get first page of races
                        pages = Math.ceil(total / LIMIT) - 1; // find rest pages of races

                    this.setState(prevState => {
                        return {
                            ...prevState,
                            Standings: {
                                busy: false,
                                data: Standings
                            },
                            Races: {
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
                                const {data: {RaceTable: {Races: races}}} = response;

                                this.setState(prevState => {
                                    const {Races: {data}} = prevState;

                                    return {
                                        ...prevState,
                                        Races: {
                                            busy: i < pages,
                                            data: data.concat(races)
                                        }
                                    };
                                });
                            });
                        }
                    }
                });
            });
        }

        componentWillUnmount() {
            this.cancelSource.cancel('Request cancelled');
        }

        render() {
            const {
                Constructor: {data: Constructor} = {},
                Driver: {data: Driver} = {},
                Standings: {busy: loadingStandings, data: Standings},
                Races: {busy: loadingRaces}
            } = this.state;

            let {Races: {data: Races}} = this.state;

            // merge duplicate races with different results
            loadingRaces || (Races = normalizeRaces(Races));

            return (
                <div className="uk-padding-small">
                    <WrappedComponent
                        {...this.state}
                        {...this.props}
                        onReady={(input) => this.fetchData(input)}
                    />

                    {Constructor || Driver ? (
                        <>
                            <hr className="uk-divider-icon"/>

                            {loadingStandings ? <Spinner text="Loading standings..."/> : (Standings.length > 0 ? (
                                <div data-uk-grid="" className="uk-grid-small">
                                    <div className="uk-width-1-6">
                                        <ul className="uk-tab-left" data-uk-tab="connect: #contents; animation: uk-animation-fade">
                                            <li>
                                                <a href="/">Standings</a>
                                            </li>
                                            {Standings.map(({season}) =>
                                                <li key={`${season}-season`}>
                                                    <a href="/">Season {season}</a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="uk-width-5-6">
                                        <ul id="contents" className="uk-switcher">
                                            <li>
                                                <DriverStandings standings={Standings}/>
                                            </li>
                                            {loadingRaces || Standings.map(({season}) => {
                                                const races = Races.filter(({season: s}) => s === season);

                                                return (
                                                    <li key={`${season}-races`}>
                                                        {races.length ? (
                                                            <DriverResults races={races}/>
                                                        ) : <Spinner/>}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            ) : <Alert/>)}
                        </>
                    ) : null}
                </div>
            );
        }
    }
}
