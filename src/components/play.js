import React, {useState, useEffect} from 'react';
import axios from 'axios';
import $ from 'jquery';
import moment from 'moment';
import '../play.scss';

export default function Play() {
    const lapWidth = 100;
    const limit = 5;
    const containerWidth = (lapWidth * limit) + lapWidth;
    const driverHeight = 30;

    let lapsCount = 0;
    let circuitHeight = 0;
    let timer;

    const [busy, setBusy] = useState(true);
    const [results, setResults] = useState({});
    const [laps, setLaps] = useState([]);
    const [pits, setPits] = useState([]);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const cancelTokenSource = axios.CancelToken.source();
        const config = {cancelToken: cancelTokenSource.token};

        setBusy(true);

        axios.all([
            axios.get('/data/2019/1/results.json', config),
            axios.get('/data/2019/1/laps.json', config),
            axios.get('/data/2019/1/pits.json', config)
        ]).then(axios.spread((R, L, P) => {
            const {data: $results} = R;
            const {data: $laps} = L;
            const {data: $pits} = P;

            setResults($results);
            setLaps($laps);
            setPits($pits);
            setBusy(false)
        })).then(() => {
            setBusy(false);
        });

        return () => {
            cancelTokenSource.cancel();
        };
    }, []);

    function renderLaps() {
        const laps = [];

        for (let i = 1; i <= lapsCount; i++) {
            laps.push(
                <div key={`lap-${i}`}
                    id={`lap-${i}`}
                    className="lap"
                    data-order={i}
                    style={{order: i}}>
                    <small>Lap {i}</small>
                </div>
            );
        }

        return laps;
    }

    function start() {
        const timeout = 500;
        const xLapsExp = /\+(\d+)/;
        // pxs to increase driver width on each lap
        const step = Math.round(lapWidth * (limit - 1) / lapsCount);
        const retiredDrivers = [];

        const timeoutHandler = (i) => {
            let lapNumber = i + 1;

            const isFinalLap = lapNumber === lapsCount;
            const {Timings} = laps.find(l => {
                const {number} = l;
                return lapNumber === parseInt(number);
            });
            // get all actual times
            const times = Timings.map(t => {
                const {time} = t;
                return moment.duration(`0:${time}`).as('ms');
            });
            // sort that times to calc fastest time per lap
            times.sort((a, b) => a - b);

            // console.log(`--- LAP ${lapNumber} ---`);

            results.forEach(r => {
                const {
                    position: pos,
                    status,
                    Driver: {code, driverId},
                    FastestLap: {lap}
                } = r;
                const {
                    time = null,
                    position = 0
                } = {...Timings.find(t => code === t.code)};
                const $driver = $(`#${code}`);
                const inPit = pits.find(p => {
                    const {lap, driverId: $driverId} = p;
                    return lapNumber === parseInt(lap) && driverId === $driverId;
                });
                const xLaps = status.match(xLapsExp);
                // driver is:
                const order = position
                    // fighting
                    ? position
                    // behind +X laps OR retired
                    : (xLaps ? pos : -1);
                // calc time gap
                const ms = moment.duration(`0:${time}`).as('ms');
                const timeGap = ms
                    ? Math.ceil((ms / (times[0]) * 100) - 100) // still active
                    : -1; // retired
                // calc the range gap between drivers based on the time gap
                const offset = timeGap === -1
                    ? lapWidth
                    : timeGap === 0 ? 0 : (timeGap * lapWidth) / 100;
                const width = isFinalLap
                    ? (limit - (xLaps ? xLaps[1] : 0)) * lapWidth
                    : $driver.width() + step - offset;
                const css = {width};

                if (order > 0) {
                    css.top = (order - 1) * driverHeight;
                } else {
                    retiredDrivers.indexOf(code) < 0 && retiredDrivers.push(code);
                }

                $driver.css(css);

                if (lapNumber === parseInt(lap)) {
                    $('.clock').addClass('uk-hidden');
                    $driver.find('.clock').removeClass('uk-hidden');
                }

                if (inPit) {
                    $('.pit').addClass('uk-hidden');
                    $driver.find('.pit').removeClass('uk-hidden');
                }
            });

            if (isFinalLap) {
                $('.clock, .pit').addClass('uk-hidden');
                $('.time').removeClass('uk-hidden');

                retiredDrivers.length && retiredDrivers.forEach((code, i) => {
                    $(`#${code}`).css({
                        top: 'auto',
                        bottom: i * driverHeight,
                        width: lapWidth
                    }).addClass('dnf');
                });
            }
        };

        setStarted(true);

        timer || reset();

        $('.starting-grid').css('order', lapsCount + 1);

        for (let i = 0; i < lapsCount; i++) {
            setTimeout(() => {
                timeoutHandler(i);
            }, i * timeout);
        }

        timer = setInterval(() => {
            const orders = $('.lap').map(function () {
                return $(this).css('order');
            }).toArray();
            const minOrder = Math.min(...orders);
            const $lap = $(`.lap[data-order="${minOrder}"]`);

            if (minOrder <= lapsCount - limit) {
                $lap.css('order', minOrder + lapsCount + 1);
            } else {
                stop();
            }
        }, timeout);
    }

    function stop() {
        timer || reset();
        timer && clearInterval(timer);
        timer = 0;
    }

    function reset() {
        $('.starting-grid').css('order', 0);

        $('.lap').each(function (i, e) {
            $(e).css('order', i + 1);
        });
    }

    if (busy) {
        return 'loading...';
    }

    lapsCount = parseInt(results[0].laps);
    circuitHeight = results.length * driverHeight + driverHeight;

    laps.forEach(lap => {
        const {Timings} = lap;

        Timings.forEach(t => {
            const {driverId: $driverId} = t;
            const {number, Driver: {code}} = results.find(r => {
                const {Driver} = r, {driverId} = Driver;
                return $driverId === driverId;
            });

            t.code = code;
            t.number = number;
        });
    });

    return (
        <>
            <div className="container" style={{width: containerWidth}}>
                <div className="uk-inline uk-dark uk-position-relative">
                    <div className={`uk-overlay-default uk-position-cover ${started ? 'uk-hidden' : ''}`}
                        style={{zIndex: 2}}>
                        <div className="uk-position-center">
                            <button type="button" className="uk-button uk-button-primary" onClick={start}>
                                <span data-uk-icon="play"/>{' '}Start
                            </button>
                        </div>
                    </div>
                    <div className="drivers" style={{height: circuitHeight}}>
                    {results
                        .sort((a, b) => a.grid - b.grid)
                        .map(r => {
                            const {
                                grid,
                                status,
                                Driver: {code},
                                Constructor: {constructorId},
                                Time
                            } = r;
                            const styles = {
                                width: lapWidth - (grid - 1),
                                height: driverHeight,
                                top: (grid - 1) * driverHeight
                            };

                            return (
                                <div key={code}
                                    id={code}
                                    className="driver"
                                    style={styles}>
                                    <small className="pit uk-hidden">In Pit</small>
                                    <small className="clock uk-hidden">
                                        <span data-uk-icon="icon: clock; ratio: 0.6"/>
                                    </small>
                                    <small className="time uk-hidden">
                                        {Time?.time || status}
                                    </small>
                                    <small className={`car ${constructorId}`}>{code}</small>
                                </div>
                            );
                    })}
                    </div>
                    <div className="circuit" style={{height: circuitHeight}}>
                        <div className="starting-grid">
                            <small>Grid</small>
                        </div>
                        {renderLaps()}
                    </div>
                </div>
            </div>
        </>
    );
}
