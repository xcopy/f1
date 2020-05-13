import React, {Component} from 'react';

const withWikiData = (WrappedComponent) => {
    return class extends Component {
        state = {
            wiki: null
        };

        abortController = new AbortController();

        componentWillUnmount() {
            this.abortController.abort();
        }

        async fetchData(url) {
            const
                {pathname} = new URL(url),
                [, , path] = pathname.split('/'),
                request = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${path}`, {
                    signal: this.abortController.signal
                }),
                response = await request.json();

            this.setState({
                wiki: response
            });

            return response;
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    {...this.state}
                    onReady={(url) => this.fetchData(url)}
                />
            );
        }
    }
};

export default withWikiData;
