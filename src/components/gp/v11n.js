import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from '@fortawesome/free-regular-svg-icons';
import {
    faPlay, faPause, faRedo,
    faForward, faFastForward, faFastBackward,
    faTrafficLight, faFlagCheckered
} from '@fortawesome/free-solid-svg-icons';
import './v11n.scss';
import {normalizeResults, timeToMs} from '../../helpers';
import LinkDriver from '../link/driver';
import LinkTeam from '../link/team';

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

    const circuitEl = useRef(null);

    const
        [busy, setBusy] = useState(true),
        [delay, setDelay] = useState(defaultDelay),
        [grid, setGrid] = useState({
            order: 0,
            number: 0
        }),
        [drivers, setDrivers] = useState({}),

        [laps, setLaps] = useState([]),
        [currentLap, setCurrentLap] = useState(1),
        [lapsCount, setLapsCount] = useState(0),
        [lapsShown, setLapsShown] = useState(0),

        [lights, setLights] = useState([]),
        [showLights, setShowLights] = useState(false),

        [raceStarted, setRaceStarted] = useState(false),
        [racePaused, setRacePaused] = useState(false),
        [raceFinished, setRaceFinished] = useState(false),

        [winner, setWinner] = useState(),
        [fastestLap, setFastestLap] = useState(),
        [fastestPitStop, setFastestPitStop] = useState();

    function init() {
        let {Results, PitStops = [], Laps} = race;

        Results = normalizeResults(race);

        Laps.forEach((lap, i) => {
            const {Timings} = lap;

            Timings.forEach(timing => {
                const
                    {driverId: id} = timing,
                    {number, Driver: {code}} = Results.find(({Driver: {driverId}}) => id === driverId);

                timing.code = code;
                timing.number = number;
            });

            lap.order = i + 1;

            setLaps(prevState => {
                prevState[i] = lap;
                return prevState;
            });
        });

        Results.forEach(result => {
            const {
                grid,
                Driver: {code},
                Constructor: {constructorId: team}
            } = result, css = {
                width: lapWidth - (grid - 1),
                top: (grid - 1) * driverHeight
                // transition duration goes after start
            };

            setDrivers(prevState => {
                return {
                    ...prevState,
                    [code]: {
                        team,
                        css,
                        fastestLap: false,
                        pit: false,
                        time: false
                    }
                };
            });
        });

        setDelay(defaultDelay);
        setGrid({
            order: 0,
            number: 0
        });
        setCurrentLap(1);
        setLapsCount(Laps.length);
        setRaceStarted(false);
        setRacePaused(false);
        setRaceFinished(false);
        setWinner(Results.find(({position}) => parseInt(position) === 1));
        setFastestLap(Results.find(({FastestLap: {rank} = {}}) => parseInt(rank) === 1));
        setFastestPitStop(() => {
            const pitStop = PitStops.find((el, i, arr) => {
                const times = arr.map(({duration}) => timeToMs(duration));
                return timeToMs(el.duration) === Math.min(...times);
            });

            if (pitStop) {
                const {driverId, lap, duration} = pitStop;
                const {Driver, Constructor} = Results.find(({Driver: {driverId: id}}) => id === driverId);

                return {
                    lap,
                    duration,
                    Driver,
                    Constructor
                };
            }
        });
        setBusy(false);
    }

    // INIT
    useEffect(init, [race]);

    // LAPS SHOWN
    useEffect(() => {
        const
            modalEl = document.getElementById('modal'),
            listener = () => {
                setLapsShown(Math.floor(circuitEl.current['offsetWidth'] / lapWidth));
            };

        modalEl.addEventListener('shown', listener);

        return () => {
            modalEl.removeEventListener('shown', listener);
        };
    });

    // LIGHTS
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

    // RACE
    useEffect(() => {
        let intervalId = null;

        const
            {Results, PitStops = []} = race,
            step = Math.round(lapWidth * (lapsShown - 2) / lapsCount),
            retiredDrivers = [];

        if (raceStarted && !racePaused) {
            intervalId = setInterval(() => {
                if (currentLap <= lapsCount) {
                    const
                        isFinalLap = currentLap === lapsCount,
                        {Timings} = laps.find(({number}) => currentLap === parseInt(number)),
                        // get all actual times (ms)
                        times = Timings.map(({time}) => timeToMs(time)),
                        fastestTime = Math.min(...times); // ms

                    // console.log(`--- LAP ${currentLap} ---`);

                    if (currentLap <= lapsCount - lapsShown + 1) {
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
                                time = '',
                                position = 0
                            } = {...Timings.find(t => code === t.code)},
                            ps = PitStops.find(({lap, driverId: id}) => currentLap === parseInt(lap) && driverId === id),
                            xLaps = status.match(/\+(\d+)/),
                            // driver is:
                            order = position
                                // fighting
                                ? position
                                // behind +X laps OR retired
                                : (xLaps ? pos : -1),
                            // calc time gap
                            retired = order === -1,
                            ms = retired ? 0 : timeToMs(time),
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
                                        ? (lapsShown - (xLaps ? xLaps[1] : 0) - 1) * lapWidth
                                        : prevWidth + step - offset,
                                top = retired
                                    ? 'auto'
                                    : (order - 1) * driverHeight,
                                bottom = retired
                                    ? retiredDrivers.indexOf(code) * driverHeight
                                    : 'auto',
                                transitionDuration = `${delay}ms`,
                                css = {
                                    width,
                                    top,
                                    bottom,
                                    transitionDuration
                                },
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
                    setRaceFinished(currentLap === lapsCount);
                } else {
                    setCurrentLap(lapsCount);
                    setRaceStarted(false);
                }
            }, delay);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [
        race,
        raceStarted,
        racePaused,
        laps,
        currentLap,
        lapsShown,
        lapsCount,
        delay
    ]);

    if (busy) {
        return null;
    }

    return (
        <div data-uk-grid="" className="uk-grid-small">
            <div className="uk-width-expand">
                <div id="visualization">
                    <div ref={circuitEl} id="circuit" style={{
                        // width: (lapWidth * lapsShown) + lapWidth,
                        height: (Object.keys(drivers).length * driverHeight) + driverHeight
                    }}>
                        <div id="lights" className={showLights ? '' : 'uk-hidden'}>
                            {_.range(5).map(i => {
                                const key = i + 1;

                                return (
                                    <div key={key} className={classNames({
                                        'light': true,
                                        'on': lights.includes(key)
                                    })}/>
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
                                        <small className={classNames({'pit': true, 'uk-hidden': !pit})}>
                                            {pit}
                                        </small>
                                        <small className={classNames({'fastest-lap': true, 'uk-hidden': !fastestLap})}>
                                            <FontAwesomeIcon icon={faClock}/>
                                        </small>
                                        <small className={classNames({'time uk-text-truncate': true, 'uk-hidden': !time})}>
                                            {time}
                                        </small>
                                        <small className={classNames({'team': true, [team]: true})}>
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
            <div className="uk-width-auto">
                <div className="uk-button-group uk-text-center">
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
                </div>

                <div className="uk-margin-top uk-text-center">
                    {showLights || (
                        raceStarted || raceFinished || (
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

                    {raceFinished && (
                        <Button
                            title="Reset"
                            onClick={() => init()}>
                            <FontAwesomeIcon icon={faRedo}/>
                        </Button>
                    )}
                </div>

                {raceFinished && (() => {
                    const {Driver: D1, Constructor: C1} = winner;
                    const {Driver: D2, Constructor: C2, FastestLap: {lap, Time: {time}}} = fastestLap;

                    return (
                        <dl className="uk-description-list uk-description-list-divider">
                            <dt>Winner:</dt>
                            <dd>
                                <LinkDriver driver={D1}/>, <LinkTeam team={C1}/>
                            </dd>
                            <dt>Fastest Lap:</dt>
                            <dd>
                                <LinkDriver driver={D2}/>, <LinkTeam team={C2}/>
                                <div>{time}, Lap #{lap}</div>
                            </dd>
                            {fastestPitStop && (() => {
                                const {Driver, Constructor, lap, duration} = fastestPitStop;

                                return (
                                    <>
                                        <dt>Fastest Pit Stop:</dt>
                                        <dd>
                                            <LinkDriver driver={Driver}/>, <LinkTeam team={Constructor}/>
                                            <div>{duration}s, Lap #{lap}</div>
                                        </dd>
                                    </>
                                );
                            })()}
                        </dl>
                    );
                })()}
            </div>
        </div>
    );
}

GPV11n.propTypes = {
    race: PropTypes.object.isRequired
};

export default GPV11n;
