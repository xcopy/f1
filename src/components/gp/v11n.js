import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from '@fortawesome/free-regular-svg-icons';
import './v11n.scss';

function Button({onClick, children, ...attrs}) {
    return (
        <button className="uk-button uk-button-primary" onClick={onClick} {...attrs}>
            {children}
        </button>
    );
}

function Lap({lap}) {
    const {number, order} = lap;

    return (
        <div id={`lap-${number}`} className="lap" style={{order: order}}>
            <small>{number === 0 ? 'Grid' : `Lap ${number}`}</small>
        </div>
    );
}

function GPV11n({race}) {
    const
        lapWidth = 100,
        limit = 5,
        driverHeight = 30;

    const
        [delay, setDelay] = useState(500),
        [grid, setGrid] = useState({order: 0, number: 0}),
        [currentLap, setCurrentLap] = useState(1),
        [lapsCount, setLapsCount] = useState(0),
        [lights, setLights] = useState([]),
        [showLights, setShowLights] = useState(false),
        [raceStarted, setRaceStarted] = useState(false),
        [racePaused, setRacePaused] = useState(false),
        [laps, setLaps] = useState([]),
        [drivers, setDrivers] = useState({});

    useEffect(() => {
        const
            {Results, QualifyingResults, Laps: laps$} = race,
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

        QualifyingResults
            .sort((a, b) => a.position - b.position)
            .forEach(result => {
                const
                    {
                        position,
                        Driver: {code},
                        Constructor: {constructorId: team}
                    } = result,
                    css = {
                        width: lapWidth - (position - 1),
                        top: (position - 1) * driverHeight
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

        if (raceStarted && !racePaused) {
            intervalId = setInterval(() => {
                if (currentLap <= lapsCount - limit) {
                    setLaps(prevState => {
                        const lap = prevState[currentLap - 1];

                        lap.order = currentLap + lapsCount + 1;

                        return prevState;
                    });

                    setCurrentLap(prevState => prevState + 1);
                } else {
                    setRaceStarted(false);
                }
            }, delay);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [raceStarted, racePaused, currentLap, lapsCount, delay]);

    return (
        <div data-uk-grid="" className="uk-grid-small">
            <div className="uk-width-auto">
                <div id="visualization">
                    <div id="circuit" style={{
                        width: (lapWidth * limit) + lapWidth,
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
                                        <small className={`time ${time || 'uk-hidden'}`}>{time}</small>
                                        <small className={`pit ${pit || 'uk-hidden'}`}>Pit</small>
                                        <small className={`fastest-lap ${fastestLap || 'uk-hidden'}`}>
                                            <FontAwesomeIcon icon={faClock}/>
                                        </small>
                                        <small className={`team ${team}`}>{code}</small>
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
            <div className="uk-width-expand">
                <div data-uk-grid="" className="uk-grid-small">
                    <div className="uk-width-1-2">
                        <select
                            className="uk-select"
                            value={delay}
                            onChange={(e) => setDelay(parseInt(e.target.value))}>
                            <option value="750">Slower</option>
                            <option value="500">Normal</option>
                            <option value="250">Faster</option>
                        </select>
                    </div>
                    <div className="uk-width-expand">
                        {showLights || (
                            raceStarted ? '' : <Button onClick={() => setShowLights(true)}>Start</Button>
                        )}

                        {raceStarted && (
                            <>
                                {racePaused && <Button onClick={() => setRacePaused(false)}>Resume</Button>}
                                {racePaused || <Button onClick={() => setRacePaused(true)}>Pause</Button>}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

GPV11n.propTypes = {
    race: PropTypes.object.isRequired
};

export default GPV11n;
