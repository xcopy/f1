import React, {Component} from 'react';
import localforage from 'localforage';
import axios from 'axios';
import _ from 'lodash';
import {localApi, remoteApi} from '../API';

export default function withStandings(WrappedComponent) {
    return class extends Component {
        state = {
            busy: true,
            data: {}
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

                        this.setState({
                            data: {
                                [Model]: Entity
                            },
                            busy: false
                        });

                        return Entity;
                    }).then(Entity => {
                        Entity && axios.all([
                            remoteApi.get(`${key}/${model}Standings`),
                            remoteApi.get(`${key}/results`)
                        ]).then(axios.spread((S, R) => {
                            const
                                {data: {StandingsTable: {StandingsLists: Standings}}} = S,
                                {data: {RaceTable: {Races}}} = R;

                            this.setState(prevState => {
                                const data = Object.assign({}, prevState.data, {
                                    Standings,
                                    Races
                                });

                                localforage.setItem(key, data).then(null);

                                return {
                                    ...prevState,
                                    data
                                };
                            });
                        }));
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
            return (
                <WrappedComponent
                    {...this.state}
                    {...this.props}
                    onReady={(input) => this.fetchData(input)}
                />
            );
        }
    }
}
