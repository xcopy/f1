import React, {useEffect, useState} from 'react';
import API from '../API';
import LinkDriver from './link/driver';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

function List({letter, drivers}) {
    return (
        <dl className="uk-margin-remove">
            {letter && (
                <dt>
                    <span className="uk-text-large">{letter}</span>
                    {' '}
                    <small className="uk-text-muted">({drivers.length})</small>
                </dt>
            )}
            {drivers.map(driver => {
                const {driverId, familyName, givenName, hidden} = driver;

                return (
                    <dd key={driverId} className={hidden ? 'uk-hidden' : ''}>
                        <LinkDriver driver={driver}>
                            {familyName}, {givenName}
                        </LinkDriver>
                    </dd>
                );
            })}
        </dl>
    );
}

export default function Drivers() {
    const
        [busy, setBusy] = useState(true),
        [data, setData] = useState({}),
        [modalContent, setModalContent] = useState([]),
        [filterText, setFilterText] = useState('');

    useEffect(() => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        let isMounted = true;

        API.get('drivers').then(response => {
            const
                data$ = {},
                {data: {DriverTable: {Drivers}}} = response;

            letters.forEach(letter => {
                const arr = Drivers.filter(driver => {
                    const {familyName} = driver;
                    return familyName.charAt(0) === letter;
                });

                arr.sort();

                data$[letter] = {
                    hidden: false,
                    drivers: arr.map((driver, i) => {
                        driver.hidden = i > 9;
                        return driver;
                    })
                };
            });

            if (isMounted) {
                setData(data$);
                setBusy(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    function showAllDrivers(letter) {
        const {drivers} = _.cloneDeep(data[letter]);

        setModalContent([
            letter,
            drivers.map(driver => {
                driver.hidden = false;
                return driver;
            })
        ]);
    }

    function handleSearch(e) {
        const filter = e.target.value;
        // todo
        setFilterText(filter);
    }

    return (
        <div className="uk-padding-small">
            {busy ? <span data-uk-spinner=""/> : (
                <>
                    <div data-uk-grid="" className="uk-grid-small uk-flex uk-flex-middle">
                        <div className="uk-width-1-4">
                            <h1 className="uk-text-uppercase">Drivers</h1>
                        </div>
                        <div className="uk-width-1-2">
                            <form
                                onSubmit={(e) => {e.preventDefault()}}
                                className="uk-search uk-search-default uk-width-1-1">
                                <span data-uk-search-icon=""/>
                                <input
                                    onChange={(e) => handleSearch(e)}
                                    value={filterText}
                                    type="search"
                                    className="uk-search-input"
                                    placeholder="Search..."/>
                            </form>
                        </div>
                    </div>
                    <div
                        data-uk-grid=""
                        data-uk-height-match="target: > div > .uk-card; row: false"
                        className="uk-grid-small">
                        {Object.keys(data).map(letter => {
                            const {hidden, drivers} = data[letter];

                            return drivers.length > 0 ? (
                                <div
                                    key={`drivers-${letter}`}
                                    className={`uk-width-1-5${hidden ? ' uk-hidden' : ''}`}>
                                    <div className="uk-card uk-card-default uk-card-body">
                                        <List letter={letter} drivers={drivers}/>
                                        {drivers.length > 10 && (
                                            <button
                                                onClick={() => showAllDrivers(letter)}
                                                data-uk-toggle="target: #modal"
                                                title="Show all"
                                                className="uk-button uk-button-link">
                                                <FontAwesomeIcon icon={faEllipsisH}/>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>

                    <div id="modal" data-uk-modal="">
                        <div data-uk-overflow-auto="" className="uk-modal-dialog">
                            {(() => {
                                const [letter, drivers = []] = modalContent;

                                return (
                                    <>
                                        <div className="uk-modal-header">
                                            <h2 className="uk-modal-title">{letter}</h2>
                                        </div>
                                        <div className="uk-modal-body">
                                            <div className="uk-column-1-3">
                                                <List drivers={drivers}/>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
