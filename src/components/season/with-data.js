import React, {Component} from 'react';
import axios from 'axios';
import {remoteApi} from '../../API';

export default function seasonWithData(WrappedComponent) {
    return class extends Component {
        state = {
            busy: true,
            data: {}
        }

        cancelSource = axios.CancelToken.source();

        fetchData(url) {
            this.setState({
                busy: true
            });

            remoteApi.get(url, {
                cancelToken: this.cancelSource.token
            }).then(response => {
                this.setState({
                    busy: false,
                    data: response.data
                });
            });
        }

        componentWillUnmount() {
            this.cancelSource.cancel('Request cancelled');
        }

        render() {
            // return table (wrapped) component and pass
            // 1. local state: busy, data
            // 2. route props of the wrapped component: history, location, match
            // as it's props
            return (
                <WrappedComponent
                    {...this.state}
                    {...this.props}
                    onReady={(url) => this.fetchData(url)}
                />
            );
        }
    }
}
