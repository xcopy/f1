import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from '@fortawesome/free-regular-svg-icons';
import
    {faPlay, faPause, faForward, faFastForward, faFastBackward, faTrafficLight, faFlagCheckered}
from '@fortawesome/free-solid-svg-icons';
import './v11n.scss';
import moment from 'moment';
import {normalizeResults} from '../../helpers';

function Button({title, onClick, children, ...attrs}) {
    return (
        <button
            data-uk-tooltip={`title: ${title}; pos: bottom; delay: 100`}
            className="uk-button uk-button-primary"
            onClick={onClick}
            {...attrs}>
            {children}
        </button>
    );
}

function Lap({lap}) {
    const {number, order} = lap;

    return (
        <div id={`lap-${number}`} className="lap" style={{order: order}}>
            <small>
                {number === 0
                    ? <FontAwesomeIcon icon={order === 0 ? faTrafficLight : faFlagCheckered}/>
                    : `Lap ${number}`
                }
            </small>
        </div>
    );
}

function GPV11n({race}) {
    const
        lapWidth = 100,
        driverHeight = 30,
        defaultDelay = 500,
        speeds = [
            ['Slower', defaultDelay + 250, faFastBackward],
            ['Normal', defaultDelay, faForward],
            ['Faster', defaultDelay - 250, faFastForward]
        ];

    const
        [delay, setDelay] = useState(defaultDelay),
        [grid, setGrid] = useState({order: 0, number: 0}),
        [currentLap, setCurrentLap] = useState(1),
        [lapsCount, setLapsCount] = useState(0),
        [limit, setLimit] = useState(0),
        [lights, setLights] = useState([]),
        [showLights, setShowLights] = useState(false),
        [raceStarted, setRaceStarted] = useState(false),
        [racePaused, setRacePaused] = useState(false),
        [laps, setLaps] = useState([]),
        [drivers, setDrivers] = useState({});

    const circuitEl = useRef(null);

    useEffect(() => {
        const
            modalEl = document.getElementById('modal'),
            listener = () => {
                setLimit(Math.floor(circuitEl.current['offsetWidth'] / lapWidth));
            };

        modalEl.addEventListener('shown', listener);

        return () => {
            modalEl.removeEventListener('shown', listener);
        };
    });

    useEffect(() => {
        const
            {Results, Laps: laps$} = race,
            results = normalizeResults(race),
            drivers$ = {};

        laps$.forEach((lap, i) => {
            const {Timings} = lap;

            lap.order = i + 1;

            Timings.forEach(timing => {
                const
                    {driverId: $driverId} = timing,
                    {number, Driver: {code}} = Results.find(result => {
                        const {Driver: {driverId}} = result;
                        return $driverId === driverId;
                    });

                timing.code = code;
                timing.number = number;
            });
        });

        results
            .forEach(result => {
                const
                    {
                        grid,
                        Driver: {code},
                        Constructor: {constructorId: team}
                    } = result,
                    css = {
                        width: lapWidth - (grid - 1),
                        top: (grid - 1) * driverHeight
                    };

                drivers$[code] = {
                    team,
                    css,
                    fastestLap: false,
                    pit: false,
                    time: false
                };
            });

        setLapsCount(laps$.length);
        setLaps(laps$);
        setDrivers(drivers$);
    }, [race]);

    useEffect(() => {
        let intervalId = null;

        if (showLights) {
            intervalId = setInterval(() => {
                if (lights.length < 5) {
                    setLights(prevState => {
                        return [
                            ...prevState,
                            prevState.length + 1
                        ];
                    });
                } else {
                    setShowLights(false);
                    setLights([]);
                    setGrid(prevState => {
                        prevState.order = lapsCount + 1;
                        return prevState;
                    });
                    setRaceStarted(true);
                }
            }, delay);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [showLights, lapsCount, lights, delay]);

    useEffect(() => {
        let intervalId = null;

        const
            {Results, PitStops} = race,
            step = Math.round(lapWidth * (limit - 1) / lapsCount),
            retiredDrivers = [];

        if (raceStarted && !racePaused) {
            intervalId = setInterval(() => {
                if (currentLap <= lapsCount) {
                    const
                        isFinalLap = currentLap === lapsCount,
                        {Timings} = laps.find(lap => {
                            const {number} = lap;
                            return currentLap === parseInt(number);
                        }),
                        // get all actual times (ms)
                        times = Timings.map(t => {
                            const {time} = t;
                            return moment.duration(`0:${time}`).as('ms');
                        }),
                        fastestTime = Math.min(...times); // ms

                    // console.log(`--- LAP ${currentLap} ---`);

                    if (currentLap <= lapsCount - limit) {
                        setLaps(prevState => {
                            const lap = prevState[currentLap - 1];

                            lap.order = currentLap + lapsCount + 1;

                            return prevState;
                        });
                    }

                    Results.forEach(r => {
                        const
                            {
                                position: pos,
                                status,
                                Driver: {code, driverId},
                                FastestLap: {lap} = {},
                                Time
                            } = r,
                            {
                                time = null,
                                position = 0
                            } = {...Timings.find(t => code === t.code)},
                            ps = PitStops.find(p => {
                                const {lap, driverId: driverId$} = p;
                                return currentLap === parseInt(lap) && driverId === driverId$;
                            }),
                            xLaps = status.match(/\+(\d+)/),
                            // driver is:
                            order = position
                                // fighting
                                ? position
                                // behind +X laps OR retired
                                : (xLaps ? pos : -1),
                            // calc time gap
                            retired = order === -1,
                            ms = retired
                                ? 0
                                : moment.duration(`0:${time}`).as('ms'),
                            timeDiff = ms - fastestTime,
                            // calc the range gap between drivers based on the time gap
                            offset = timeDiff === 0
                                ? 0
                                : (ms / fastestTime) * 100 - lapWidth;

                        retired && retiredDrivers.indexOf(code) < 0 && retiredDrivers.push(code);

                        setDrivers(prevState => {
                            const
                                drivers = {...prevState},
                                driver = drivers[code],
                                {css: {width: prevWidth}} = driver,
                                width = retired
                                    ? isFinalLap ? lapWidth : 0
                                    : isFinalLap
                                        ? (limit - (xLaps ? xLaps[1] : 0)) * lapWidth
                                        : prevWidth + step - offset,
                                top = retired
                                    ? 'auto'
                                    : (order - 1) * driverHeight,
                                bottom = retired
                                    ? retiredDrivers.indexOf(code) * driverHeight
                                    : 'auto',
                                css = {width, top, bottom},
                                fastestLap = lap && currentLap === parseInt(lap),
                                pit = ps ? `Pit${ps.stop}` : false,
                                time = isFinalLap ? (Time?.time || status) : false;

                            return {
                                ...drivers,
                                ...{
                                    [code]: {
                                        ...driver,
                                        css,
                                        fastestLap,
                                        pit,
                                        time
                                    }
                                }
                            };
                        });
                    });

                    setCurrentLap(currentLap + 1);
                } else {
                    setCurrentLap(lapsCount);
                    setRaceStarted(false);
                }
            }, delay);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [race, raceStarted, racePaused, currentLap, limit, lapsCount, laps, delay]);

    return (
        <div data-uk-grid="" className="uk-grid-small">
            <div className="uk-width-expand">
                <div id="visualization">
                    <div ref={circuitEl} id="circuit" style={{
                        // width: (lapWidth * limit) + lapWidth,
                        height: (Object.keys(drivers).length * driverHeight) + driverHeight
                    }}>
                        <div id="lights" className={showLights ? '' : 'uk-hidden'}>
                            {[...Array(5).keys()].map(i => {
                                const key = i + 1;

                                return (
                                    <div key={key} className={`light ${lights.includes(key) ? 'on' : ''}`}/>
                                );
                            })}
                            <div/>
                        </div>

                        <div id="drivers">
                            {Object.keys(drivers).map(code => {
                                const
                                    driver = drivers[code],
                                    {team, css, fastestLap, pit, time} = driver;

                                return (
                                    <div key={code}
                                        id={code}
                                        className="driver"
                                        style={css}>
                                        <small className={`time uk-text-truncate${time ? '' : ' uk-hidden'}`}>
                                            {time}
                                        </small>
                                        <small className={`pit${pit ? '' : ' uk-hidden'}`}>
                                            {pit}
                                        </small>
                                        <small className={`fastest-lap${fastestLap || ' uk-hidden'}`}>
                                            <FontAwesomeIcon icon={faClock}/>
                                        </small>
                                        <small className={`team ${team}`}>
                                            {code}
                                        </small>
                                    </div>
                                );
                            })}
                        </div>

                        <div id="laps">
                            <Lap lap={grid}/>
                            {laps.map(lap => <Lap key={lap.number} lap={lap}/>)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="uk-width-auto uk-text-center">
                {speeds.map((speed, key) => {
                    const [t, d, i] = speed;

                    return (
                        <Button
                            key={key}
                            title={t}
                            onClick={() => setDelay(d)}
                            className="uk-button uk-button-secondary"
                            disabled={!raceStarted}>
                            <FontAwesomeIcon icon={i}/>
                        </Button>
                    )
                })}

                <div className="uk-margin-top">
                    {showLights || (
                        raceStarted || (
                            <Button
                                title="Start"
                                onClick={() => setShowLights(true)}>
                                <FontAwesomeIcon icon={faPlay}/>
                            </Button>
                        )
                    )}

                    {raceStarted && (
                        <>
                            {racePaused && (
                                <Button
                                    title="Resume"
                                    onClick={() => setRacePaused(false)}>
                                    <FontAwesomeIcon icon={faPlay}/>
                                </Button>
                            )}

                            {racePaused || (
                                <Button
                                    title="Pause"
                                    onClick={() => setRacePaused(true)}>
                                    <FontAwesomeIcon icon={faPause}/>
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

GPV11n.propTypes = {
    race: PropTypes.object.isRequired
};

export default GPV11n;
