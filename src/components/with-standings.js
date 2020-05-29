import React, {Component} from 'react';
import axios from 'axios';
import _ from 'lodash';
import {localApi, remoteApi} from '../API';
import Alert from './alert';
import Spinner from './spinner';
import DriverResults from './driver/results';
import DriverStandings from './driver/standings';

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
            Races: []
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
                Entity && remoteApi.get(`${key}/${model}Standings`, {
                    cancelToken: this.cancelSource.token
                }).then(async (response) => {
                    const {data: {StandingsTable: {StandingsLists: Standings}}} = response;
                    const length = await remoteApi.cache.length();
                    console.log(length);

                    this.setState(prevState => {
                        return {
                            ...prevState,
                            Standings: {
                                busy: false,
                                data: Standings
                            }
                        };
                    });
                });
            });
        }

        componentWillUnmount() {
            this.cancelSource.cancel('Request cancelled');
        }

        render() {
            const {
                Constructor: {data: team} = {},
                Driver: {data: driver} = {},
                Standings: {busy, data: standings},
                Races
            } = this.state;

            return (
                <div className="uk-padding-small">
                    <WrappedComponent
                        {...this.state}
                        {...this.props}
                        onReady={(input) => this.fetchData(input)}
                    />

                    {team || driver ? (
                        <>
                            <hr className="uk-divider-icon"/>

                            {busy ? <Spinner text="Loading standings..."/> : (standings.length > 0 ? (
                                <div data-uk-grid="" className="uk-grid-small">
                                    <div className="uk-width-1-6">
                                        <div>
                                            <ul className="uk-tab-left" data-uk-tab="connect: #contents; animation: uk-animation-fade">
                                                <li>
                                                    <a href="/">Standings</a>
                                                </li>
                                                {standings.map(({season}) =>
                                                    <li key={`${season}-season`}>
                                                        <a href="/">Season {season}</a>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="uk-width-5-6">
                                        <ul id="contents" className="uk-switcher">
                                            <li>
                                                <DriverStandings standings={standings}/>
                                            </li>
                                            {standings.map(({season}) => {
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
