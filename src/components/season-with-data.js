import React, {Component} from 'react';
import axios from 'axios';
import api from '../api';

const seasonWithData = (WrappedComponent, url) => {
    return class extends Component {
        constructor(props) {
            super(props);

            this.state = {
                busy: false,
                year: props.year,
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
                        busy: false,
                        data: response.data
                    });
                })
            );
        }

        componentWillUnmount() {
            this.cancelSource.cancel('Request cancelled');
        }

        render() {
            /*
            const {busy} = this.state;

            if (busy) {
                return (
                    <div className="uk-position-center">
                        <div data-uk-spinner/>
                    </div>
                );
            }
            */

            return <WrappedComponent {...this.state}/>;
        }
    }
};

export default seasonWithData;
