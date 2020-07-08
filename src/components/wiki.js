import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWikipediaW} from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import Spinner from './spinner';

export default class Wiki extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired
    };

    state = {
        busy: true,
        summary: null,
        media: null
    };

    // cancelSource = axios.CancelToken.source();

    componentDidMount() {
        const
            {url} = this.props,
            {pathname} = new URL(url),
            [, , path] = pathname.split('/');

        axios.all([
            axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${path}`),
            axios.get(`https://en.wikipedia.org/api/rest_v1/page/media-list/${path}`)
        ]).then(axios.spread((S, M) => {
            const {data: summary} = S, {data: media} = M;

            this.setState({
                busy: false,
                summary,
                media
            });
        }));
    }

    componentWillUnmount() {
        // this.cancelSource.cancel('Request cancelled');
    }

    render() {
        const {url, children} = this.props;
        const {busy, summary, media} = this.state;

        return busy ? <Spinner/> : (() => {
            const
                {title, extract_html: html, thumbnail: {source: src} = {}} = summary,
                {items} = media,
                {srcset: sources = []} = items[0] || {},
                srcset = sources.map(({src, scale}) => `${src} ${scale}`);

            return (
                <div data-uk-grid="" className="uk-grid-small">
                    {src && srcset && (
                        <div className="uk-width-1-4@m">
                            <img
                                data-src={src}
                                data-srcset={srcset}
                                data-uk-img=""
                                alt={title}
                            />
                        </div>
                    )}
                    <div className="uk-width-expand">
                        {html && <div dangerouslySetInnerHTML={{__html: html}}/>}

                        <div>
                            <FontAwesomeIcon icon={faWikipediaW}/>
                            {' '}
                            <a href={url} target="_blank" rel="noopener noreferrer">Read more</a>
                        </div>

                        {children && <div className="uk-margin-top">{children}</div>}
                    </div>
                </div>
            );
        })()
    }
}
