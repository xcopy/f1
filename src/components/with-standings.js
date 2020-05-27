import React, {Component} from 'react';
import localforage from 'localforage';
import _ from 'lodash';
import {localApi, remoteApi} from '../API';
import DriverResults from './driver/results';
import DriverStandings from './driver/standings';
import Spinner from './spinner';

export default function withStandings(WrappedComponent) {
    return class extends Component {
        state = {
            busy: true,
            data: {
                Standings: [],
                Races: {}
            }
        };

        fetchData(input) {
            const
                {id, Model} = input,
                model = Model.toLowerCase(),
                key = `${model}s/${id}`;

            localforage.keys().then(keys => {
                if (keys.indexOf(key) < 0) {
                    localApi.get(`${model}s`).then(response => {
                        const
                            Collection = _.get(response.data, `${Model}Table.${Model}s`),
                            Entity = Collection.find(e => e[`${model}Id`] === id);

                        this.setState(prevState => {
                            const {data} = prevState;

                            return {
                                data: {
                                    ...data,
                                    [Model]: Entity
                                },
                                busy: false
                            };
                        });

                        return Entity;
                    }).then(Entity => {
                        if (Entity) {
                            remoteApi.get(`${key}/${model}Standings`).then(response => {
                                const {data: {StandingsTable: {StandingsLists: Standings}}} = response;

                                this.setState(prevState => {
                                    let {data} = prevState;

                                    data = {
                                        ...data,
                                        Standings
                                    };

                                    localforage.setItem(key, data).then(null);

                                    return {
                                        ...prevState,
                                        data
                                    };
                                });
                            });
                        }
                    });
                } else {
                    localforage.getItem(key).then(data => {
                        this.setState({
                            data,
                            busy: false
                        });
                    });
                }
            });
        }

        render() {
            const {data: {Standings, Races}} = this.state;

            return (
                <div className="uk-padding-small">
                    <WrappedComponent
                        {...this.state}
                        {...this.props}
                        onReady={(input) => this.fetchData(input)}
                    />

                    <hr className="uk-divider-icon"/>

                    {Standings.length ? (
                        <div data-uk-grid="" className="uk-grid-small">
                            <div className="uk-width-1-6">
                                <div>
                                    <ul className="uk-tab-left" data-uk-tab="connect: #contents; animation: uk-animation-fade">
                                        <li>
                                            <a href="/">Standings</a>
                                        </li>
                                        {Standings.map(({season}) =>
                                            <li key={season}>
                                                <a href="/">Season {season}</a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className="uk-width-5-6">
                                <ul id="contents" className="uk-switcher">
                                    <li>
                                        <DriverStandings standings={Standings}/>
                                    </li>
                                    {Standings.map(({season}) => {
                                        return (
                                            <li key={season}>
                                                {Races[season] ? (
                                                    <DriverResults races={Races[season]}/>
                                                ) : <Spinner/>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    ) : <Spinner/>}
                </div>
            );
        }
    }
}
