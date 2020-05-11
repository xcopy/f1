import React, {useEffect, useState} from 'react';
import API from '../API';
import LinkDriver from './link/driver';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import styled from 'styled-components';

const NameSpan = styled.span`
    &.hl {
        background-color: yellow;
    }
`;

function List({letter, drivers}) {
    return (
        <dl className="uk-margin-remove">
            {letter && (
                <dt className="uk-text-large">{letter}</dt>
            )}
            {drivers.map(driver => {
                const {driverId, familyName, givenName, visible} = driver;

                return (
                    <dd key={driverId} className={visible ? '' : 'uk-hidden'}>
                        <LinkDriver driver={driver}>
                            <NameSpan>{familyName}</NameSpan>,
                            {' '}
                            <NameSpan>{givenName}</NameSpan>
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
        [filter, setFilter] = useState('');

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

                data$[letter] = arr.map((driver, i) => {
                    driver.visible = i < 9;
                    return driver;
                });
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

    function toggleDrivers(drivers, visible = true) {
        drivers.forEach(driver => {
            driver.visible = visible;
        });
    }

    function showAllDrivers(letter) {
        const drivers = _.cloneDeep(data[letter]);

        toggleDrivers(drivers);

        setModalContent([
            letter,
            drivers
        ]);
    }

    function handleSearch(e) {
        const filter$ = (e.target.value || '').trim().toLowerCase();

        setFilter(filter$);

        setData(prevState => {
            const state = {};

            Object.keys(prevState).forEach(letter => {
                const drivers = _.cloneDeep(prevState[letter]);

                toggleDrivers(drivers, false);

                drivers.forEach((driver, i) => {
                    const
                        {givenName, familyName} = driver,
                        str1 = givenName.toLowerCase().includes(filter$),
                        str2 = familyName.toLowerCase().includes(filter$);
                        // , regexp = new RegExp(filter$, 'ig');

                    driver.visible = filter$
                        ? str1 || str2
                        : i < 9;

                    // str1 && (driver.givenName = givenName.replace(regexp, '+'));
                    // str2 && (driver.familyName = familyName.replace(regexp, '-'));
                });

                state[letter] = drivers;
            });

            return state;
        });
    }

    let visibleCards = 0;

    return (
        <div className="uk-padding-small">
            {busy ? <span data-uk-spinner=""/> : (
                <>
                    <div data-uk-grid="" className="uk-grid-small uk-flex uk-flex-middle">
                        <div className="uk-width-3-5">
                            <h1 className="uk-text-uppercase">Drivers</h1>
                        </div>
                        <div className="uk-width-expand">
                            <form
                                onSubmit={(e) => {e.preventDefault()}}
                                className="uk-search uk-search-default uk-width-1-1">
                                <span data-uk-search-icon=""/>
                                <input
                                    onChange={(e) => handleSearch(e)}
                                    value={filter}
                                    type="search"
                                    className="uk-search-input"
                                    placeholder="Search..."/>
                            </form>
                        </div>
                    </div>
                    <div
                        data-uk-grid=""
                        data-uk-height-match="target: > div > .uk-card; row: false"
                        className="uk-grid-small uk-grid-match">
                        {Object.keys(data).map(letter => {
                            const
                                drivers = data[letter],
                                driversCount = drivers.length,
                                visibleDriversCount = drivers.filter(driver => driver.visible).length,
                                showCard = visibleDriversCount > 0;

                            visibleCards += Number(showCard);

                            return showCard > 0 ? (
                                <div key={letter} className="uk-width-1-5">
                                    <div className="uk-card uk-card-default uk-card-body">
                                        <List letter={letter} drivers={drivers}/>
                                        {driversCount > visibleDriversCount && (
                                            <button
                                                onClick={() => showAllDrivers(letter)}
                                                data-uk-toggle="target: #modal"
                                                title={`Show all ${driversCount} drivers`}
                                                className="uk-button uk-button-link">
                                                <FontAwesomeIcon icon={faEllipsisH}/>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>

                    {visibleCards === 0 && (
                        <div className="uk-text-center uk-margin-medium">
                            No matching results found for <b>&laquo;{filter}&raquo;</b>
                        </div>
                    )}

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
