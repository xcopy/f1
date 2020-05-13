import React, {useEffect, useState} from 'react';
import API from '../../API';
import Alert from '../alert';
import withWikiData from '../with-wiki-data';

const DriverDetails = ({match, onReady, wiki}) => {
    const
        [busy, setBusy] = useState(true),
        [driver, setDriver] = useState();

    useEffect(() => {
        let isMounted = true;
        const {params: {id}} = match;

        API.get('drivers').then(response => {
            const
                {data: {DriverTable: {Drivers}}} = response,
                Driver = Drivers.find(driver => {
                    const {driverId} = driver;
                    return driverId === id;
                });

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
                const {url, familyName, givenName} = driver;

                return (
                    <>
                        <h1 className="uk-text-uppercase">{givenName} {familyName}</h1>
                        <hr className="uk-divider-icon"/>
                        {wiki && (() => {
                            const {title, extract_html: html, thumbnail: {source: src} = {}} = wiki;

                            return (
                                <>
                                    <div data-uk-grid="" className="uk-grid-small">
                                        {src && (
                                            <div className="uk-width-auto">
                                                <a href={url} title={title}>
                                                    <img data-src={src} data-uk-img="" alt={title}/>
                                                </a>
                                            </div>
                                        )}

                                        {html && (
                                            <div
                                                className="uk-width-expand"
                                                dangerouslySetInnerHTML={{__html: html}}
                                            />
                                        )}

                                        <div className={`uk-width-${html && src ? '1-3' : 'expand'}`}>
                                            todo
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
