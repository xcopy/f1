import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWikipediaW} from '@fortawesome/free-brands-svg-icons';

class Wiki extends Component {
    state = {
        busy: true,
        data: null
    };

    abortCtrl = new AbortController();

    async fetchData() {
        const
            {url} = this.props,
            {pathname} = new URL(url),
            [, , path] = pathname.split('/'),
            input = `https://en.wikipedia.org/api/rest_v1/page/summary/${path}`,
            init = {
                signal: this.abortCtrl.signal
            },
            response = await fetch(input, init);

        return await response.json();
    }

    componentDidMount() {
        this.fetchData().then(data => {
            this.setState({
                busy: false,
                data
            });
        });
    }

    componentWillUnmount() {
        this.abortCtrl.abort();
    }

    render() {
        const {url, children} = this.props;
        const {busy, data} = this.state;

        return (
            <div className="uk-card uk-card-default">
                <div className="uk-card-header">
                    <h3 className="uk-card-title">Summary</h3>
                </div>
                <div className="uk-card-body">
                    {busy ? <span data-uk-spinner=""/> : (() => {
                        const {
                            title,
                            extract_html: html,
                            thumbnail: {source: src} = {}
                        } = data;

                        return (
                            <div data-uk-grid="" className="uk-grid-small">
                                {src && (
                                    <div className="uk-width-auto">
                                        <img data-src={src} data-uk-img="" alt={title}/>
                                    </div>
                                )}
                                <div className="uk-width-expand">
                                    {html && (
                                        <>
                                            <div dangerouslySetInnerHTML={{__html: html}}/>
                                            <FontAwesomeIcon icon={faWikipediaW}/>
                                            {' '}
                                            <a href={url} target="_blank" rel="noopener noreferrer">Read more</a>
                                        </>
                                    )}
                                    {children}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        );
    }
}

Wiki.propTypes = {
    url: PropTypes.string.isRequired
};

export default Wiki;
