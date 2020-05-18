import React, {useEffect, useState} from 'react';
import {localApi} from '../../API';
import Alert from '../alert';
import Moment from 'react-moment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWikipediaW} from '@fortawesome/free-brands-svg-icons';
import withWikiData from '../with-wiki-data';
import DriverAchievements from './achievements';

const DriverDetails = ({match, onReady, wiki}) => {
    const
        [busy, setBusy] = useState(true),
        [driver, setDriver] = useState();

    useEffect(() => {
        let isMounted = true;
        const {params: {id}} = match;

        localApi.get('drivers').then(response => {
            const
                {data: {DriverTable: {Drivers}}} = response,
                Driver = Drivers.find(({driverId}) => driverId === id);

            if (isMounted) {
                if (Driver) {
                    setDriver(Driver);
                    onReady(Driver.url).then(() => setBusy(false));
                } else {
                    setBusy(false);
                }
            }
        });

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="uk-padding-small">
            {busy ? <span data-uk-spinner=""/> : driver ? (() => {
                const {url, familyName, givenName, nationality, dateOfBirth} = driver;

                return (
                    <>
                        <h1 className="uk-text-uppercase">{givenName} {familyName}</h1>
                        <hr className="uk-divider-icon"/>
                        {wiki && (() => {
                            const {title, extract_html: html, thumbnail: {source: src} = {}} = wiki;

                            return (
                                <>
                                    <div
                                        data-uk-grid=""
                                        data-uk-height-match="target: > div > .uk-card"
                                        className="uk-grid-small">
                                        {src && (
                                            <div className="uk-width-auto">
                                                <div className="uk-card uk-card-default uk-card-body">
                                                    <a href={url} title={title}>
                                                        <img data-src={src} data-uk-img="" alt={title}/>
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        <div className="uk-width-expand">
                                            <div className="uk-card uk-card-default uk-card-body">
                                                <div>
                                                    <b>Born:</b>
                                                    {' '}
                                                    <Moment format="DD MMMM YYYY">{dateOfBirth}</Moment>
                                                </div>
                                                <div className="uk-margin-bottom">
                                                    <b>Nationality:</b>
                                                    {' '}
                                                    {nationality}
                                                </div>
                                                {html && (
                                                    <>
                                                        <div dangerouslySetInnerHTML={{__html: html}}/>
                                                        <FontAwesomeIcon icon={faWikipediaW}/>
                                                        {' '}
                                                        <a href={url} target="_blank" rel="noopener noreferrer">Read more</a>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className={`uk-width-${html && src ? '1-3' : 'expand'}`}>
                                            <div className="uk-card uk-card-default uk-card-body">
                                                <DriverAchievements/>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="uk-divider-icon"/>
                                </>
                            );
                        })()}
                    </>
                );
            })() : <Alert>Driver not found.</Alert>}
        </div>
    );
}

export default withWikiData(DriverDetails);
