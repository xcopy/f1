import React, {Component} from 'react';
import axios from 'axios';
import API from '../../API';

const seasonWithData = (WrappedComponent, url) => {
    return class extends Component {
        constructor(props) {
            super(props);

            this.state = {
                busy: true,
                data: {}
            };
        }

        cancelSource = axios.CancelToken.source();

        componentDidMount() {
            API.get(url, {
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
            return <WrappedComponent {...this.state} {...this.props}/>;
        }
    }
};

export default seasonWithData;
