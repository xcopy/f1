import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWikipediaW} from '@fortawesome/free-brands-svg-icons';
import Spinner from './spinner';

export default class Wiki extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired
    };

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

        return busy ? <Spinner/> : (() => {
            const {
                title,
                extract_html: html,
                originalimage: {source: imageSrc} = {},
                thumbnail: {source: thumbSrc} = {}
            } = data;

            return (
                <div data-uk-grid="" className="uk-grid-small">
                    {imageSrc && (
                        <div className="uk-width-auto">
                            <a href={`#wiki-thumb-modal`} data-uk-toggle="">
                                <img data-src={thumbSrc} data-uk-img="" alt={title}/>
                            </a>
                            <div id="wiki-thumb-modal" className="uk-flex-top" data-uk-modal="">
                                <div className="uk-modal-dialog uk-width-auto uk-margin-auto-vertical">
                                    <img data-src={imageSrc} data-uk-img="" alt={title}/>
                                </div>
                            </div>
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
                        <div className="uk-margin-top">
                            {children}
                        </div>
                    </div>
                </div>
            );
        })()
    }
}
