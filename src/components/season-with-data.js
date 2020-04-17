import React, {Component} from 'react';
import axios from 'axios';
import api from '../api';

const seasonWithData = (WrappedComponent, url) => {
    return class extends Component {
        constructor(props) {
            super(props);

            this.state = {
                busy: false,
                data: {}
            };
        }

        cancelSource = axios.CancelToken.source();

        componentDidMount() {
            this.setState({
                busy: true
            }, () =>
                api.get(url, {
                    cancelToken: this.cancelSource.token
                }).then(response => {
                    this.setState({
                        data: response.data,
                        busy: false
                    });
                })
            );
        }

        componentWillUnmount() {
            this.cancelSource.cancel('Request cancelled');
        }

        render() {
            // return table (wrapped) component and pass
            // 1. local state: busy, data
            // 2. route props of the wrapped component: history, location, match
            // as it's props
            return <WrappedComponent {...this.state} {...this.props}/>;
        }
    }
};

export default seasonWithData;
