import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import {faMapMarkerAlt, faPlayCircle, faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import {localApi, remoteApi} from '../../API';
import Spinner from '../spinner';
import Alert from '../alert';
import GPRaceResult from './race-result';
import GPQualifying from './qualifying';
import GPFastestLaps from './fastest-laps';
import GPStartingGrid from './starting-grid';
import GPPitStops from './pit-stops';
import GPV11n from './v11n';
// import GPHighlights from './highlights';
import Wiki from '../wiki';
import Card from '../card';

const Nav = ({year, race, next = true}) => {
    const {round, raceName: name} = race || {};

    return race ? (
        <div className={classNames({
            'uk-grid-small': true,
            'uk-flex uk-flex-middle': true,
            'uk-flex-right': next,
            'uk-text-right': next
        })} data-uk-grid="">
            <div className={classNames({
                'uk-text-large': true,
                'uk-flex-last': next
            })}>
                <FontAwesomeIcon icon={next ? faChevronRight : faChevronLeft}/>
            </div>
            <div>
                <div className="uk-text-small">Round {round}</div>
                <Link to={`/${year}/results/${round}`} className="uk-text-bold">{name}</Link>
            </div>
        </div>
    ) : null;
};

const GPDetails = ({match}) => {
    const
        {params: {year, round}} = match,
        [busy, setBusy] = useState(true),
        [races, setRaces] = useState([]),
        [race, setRace] = useState();

    useEffect(() => {
        let isMounted = true;

        const path = `${year}/${round}`;

        setBusy(true);
        setRaces([]);
        setRace();

        axios.all([
            remoteApi.get(`${year}/results/1`),
            // the first 3 are always there
            remoteApi.get(`${path}/results`),
            remoteApi.get(`${path}/qualifying`),
            remoteApi.get(`${path}/pitstops`),
            // except the laps
            localApi.get(`${path}/laps`).catch(() => null)
        ]).then(([results, ...rest]) => {
            const {data: {RaceTable: {Races}}} = results;
            const objects = [];

            rest.forEach(response => {
                const {
                    data: {
                        RaceTable: {
                            Races: [obj] = []
                        } = {}
                    } = {}
                } = response || {};

                obj && objects.push(obj);
            });

            if (isMounted) {
                objects.length && setRace(Object.assign({}, ...objects));
                setRaces(Races);
                setBusy(false);
            }
        }).catch((/*error*/) => {
            // const {response: {status}} = error;
            setBusy(false);
        });

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year, round]);

    function getPrevRace() {
        return races.find(({round: r}) => round - r === 1);
    }

    function getNextRace() {
        return races.find(({round: r}) => r - 1 === parseInt(round));
    }

    return (
        <>
            {busy ? <Spinner/> : (() => {
                if (!race) {
                    return <Alert/>;
                }

                const {
                    url,
                    season,
                    date,
                    raceName,
                    Circuit: {
                        circuitName,
                        Location: {country, locality}
                    },
                    Laps = []
                } = race;

                return (
                    <>
                        <Card>
                            <div className="uk-grid-small uk-flex uk-flex-middle" data-uk-grid="">
                                <div className="uk-width-1-6">
                                    <Nav year={year} race={getPrevRace()} next={false}/>
                                </div>
                                <div className="uk-width-expand uk-text-center">
                                    <h1 className="uk-text-uppercase">{season} {raceName}</h1>
                                    <FontAwesomeIcon icon={faCalendar}/>{' '}
                                    <Moment format="DD MMM YYYY" className="uk-text-bold">{date}</Moment> / Round {round}
                                    <div>
                                        <FontAwesomeIcon icon={faMapMarkerAlt}/>{' '}
                                        {circuitName} / {locality}, {country}
                                    </div>
                                </div>
                                <div className="uk-width-1-6">
                                    <Nav year={year} race={getNextRace()} next={true}/>
                                </div>
                            </div>
                        </Card>
                        <hr className="uk-divider-icon"/>
                        <Card>
                            <Wiki url={url}/>
                        </Card>
                        <hr className="uk-divider-icon"/>
                        <div data-uk-grid="" className="uk-grid-small">
                            <div className="uk-width-1-6">
                                <ul className="uk-tab-left" data-uk-tab="connect: #contents; animation: uk-animation-fade">
                                    <li><a href="/">Race Result</a></li>
                                    <li><a href="/">Qualifying</a></li>
                                    <li><a href="/">Starting Grid</a></li>
                                    <li><a href="/">Fastest Laps</a></li>
                                    <li><a href="/">Pit Stop Summary</a></li>
                                </ul>

                                {Laps.length > 0 && (
                                    <>
                                        <button
                                            data-uk-toggle="target: #modal"
                                            type="button"
                                            className="uk-button uk-button-secondary uk-button-small">
                                            <FontAwesomeIcon icon={faPlayCircle}/>
                                            {' '}Visualization
                                            {' '}<span className="uk-text-lowercase">&beta;</span>
                                        </button>
                                        <div data-uk-modal="" id="modal" className="uk-modal-container">
                                            <div className="uk-modal-dialog uk-modal-body">
                                                <GPV11n race={race}/>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="uk-width-5-6">
                                <ul id="contents" className="uk-switcher">
                                    <li>
                                        <GPRaceResult race={race}/>
                                    </li>
                                    <li>
                                        <GPQualifying race={race}/>
                                    </li>
                                    <li>
                                        <GPStartingGrid race={race}/>
                                    </li>
                                    <li>
                                        <GPFastestLaps race={race}/>
                                    </li>
                                    <li>
                                        <GPPitStops race={race}/>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                )
            })()}
        </>
    );
};

export default GPDetails;
