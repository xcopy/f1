import React, {useState, useEffect} from 'react';
import axios from 'axios';
import $ from 'jquery';
import moment from 'moment';
import '../play.scss';

export default function Play() {
    const
        lapWidth = 100,
        limit = 5,
        containerWidth = (lapWidth * limit) + lapWidth,
        driverHeight = 30,
        interval = 500;

    let
        currentLap = 1,
        lapsCount = 0,
        circuitHeight = 0,
        timer;

    const
        [busy, setBusy] = useState(true),
        [results, setResults] = useState({}),
        [laps, setLaps] = useState([]),
        [pits, setPits] = useState([]),
        [started, setStarted] = useState(false);

    useEffect(() => {
        const
            cancelTokenSource = axios.CancelToken.source(),
            config = {cancelToken: cancelTokenSource.token};

        setBusy(true);

        axios.all([
            axios.get('/data/2019/1/results.json', config),
            axios.get('/data/2019/1/laps.json', config),
            axios.get('/data/2019/1/pits.json', config)
        ]).then(axios.spread((R, L, P) => {
            const
                {data: $results} = R,
                {data: $laps} = L,
                {data: $pits} = P;

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
                    className="lap"
                    data-order={i}
                    style={{order: i}}>
                    <small>Lap {i}</small>
                </div>
            );
        }

        return laps;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function start() {
        const
            $lights = $('#lights div'),
            xLapsExp = /\+(\d+)/,
            // pxs to increase driver width on each lap
            step = Math.round(lapWidth * (limit - 1) / lapsCount),
            retiredDrivers = [],
            driversProgress = (lapNumber) => {
                const
                    isFinalLap = lapNumber === lapsCount,
                    {Timings} = laps.find(l => {
                        const {number} = l;
                        return lapNumber === parseInt(number);
                    }),
                    // get all actual times
                    times = Timings.map(t => {
                        const {time} = t;
                        return moment.duration(`0:${time}`).as('ms');
                    });

                // sort that times to calc fastest time per lap
                times.sort((a, b) => a - b);

                // console.log(`--- LAP ${lapNumber} ---`);

                results.forEach(r => {
                    const
                        {
                            position: pos,
                            status,
                            Driver: {code, driverId},
                            FastestLap: {lap}
                        } = r,
                        {
                            time = null,
                            position = 0
                        } = {...Timings.find(t => code === t.code)},
                        $driver = $(`#${code}`),
                        pit = pits.find(p => {
                            const {lap, driverId: $driverId} = p;
                            return lapNumber === parseInt(lap) && driverId === $driverId;
                        }),
                        xLaps = status.match(xLapsExp),
                        // driver is:
                        order = position
                            // fighting
                            ? position
                            // behind +X laps OR retired
                            : (xLaps ? pos : -1),
                        // calc time gap
                        ms = moment.duration(`0:${time}`).as('ms'),
                        timeGap = ms
                            ? Math.ceil((ms / (times[0]) * 100) - 100) // still active
                            : -1, // retired
                        // calc the range gap between drivers based on the time gap
                        offset = timeGap === -1
                            ? lapWidth
                            : timeGap === 0 ? 0 : (timeGap * lapWidth) / 100,
                        width = isFinalLap
                            ? (limit - (xLaps ? xLaps[1] : 0)) * lapWidth
                            : $driver.width() + step - offset,
                        css = {width};

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

                    $driver.find('.pit')
                        .text(pit ? `Pit${pit.stop}` : '')
                        .toggleClass('uk-hidden', !pit);
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
            },
            timerHandler = () => {
                const
                    orders = $('.lap').map(function () {
                        return parseInt($(this).css('order'));
                    }).toArray(),
                    minOrder = Math.min(...orders),
                    $lap = $(`.lap[data-order="${minOrder}"]`);

                if (currentLap <= lapsCount) {
                    (minOrder <= lapsCount - limit) && $lap.css('order', minOrder + lapsCount + 1);

                    driversProgress(currentLap);

                    currentLap++;
                } else {
                    stop();
                }
            };

        timer || reset();

        setStarted(true);

        $lights.each((i, e) => {
            delay(i * interval).then(() => {
                $(e).addClass('on');

                (i === $lights.length - 1) && $lights.removeClass('on');
            });
        });

        delay(interval * 6).then(() => {
            $('#lights div').removeClass('on');

            $('#lights').addClass('uk-hidden');

            timer = setInterval(timerHandler, interval);
        });
    }

    function stop() {
        timer && clearInterval(timer);
    }

    function reset() {
        $('#lights').removeClass('uk-hidden');

        $('.lap').each(function (i, e) {
            $(e).css('order', i);
        });

        setStarted(false);
    }

    if (busy) {
        return 'loading...';
    }

    lapsCount = parseInt(results[0].laps);
    circuitHeight = results.length * driverHeight + driverHeight;

    laps.forEach(lap => {
        const {Timings} = lap;

        Timings.forEach(t => {
            const
                {driverId: $driverId} = t,
                {number, Driver: {code}} = results.find(r => {
                    const {Driver} = r, {driverId} = Driver;
                    return $driverId === driverId;
                });

            t.code = code;
            t.number = number;
        });
    });

    return (
        <>
            <div id="container" style={{width: containerWidth}}>
                {results
                    .sort((a, b) => a.grid - b.grid)
                    .map(r => {
                        const
                            {
                                grid,
                                status,
                                Driver: {code},
                                Constructor: {constructorId},
                                Time
                            } = r,
                            styles = {
                                width: lapWidth - (grid - 1),
                                top: (grid - 1) * driverHeight,
                                transitionDuration: `${interval}ms`
                            };

                        return (
                            <div key={code}
                                id={code}
                                className="driver"
                                style={styles}>
                                <small className="pit uk-hidden"/>
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
                <div id="lights" className="uk-hidden">
                    {[...Array(5).keys()].map(l =>
                        <div key={l} className="light"/>
                    )}
                    <div/>
                </div>
                <div id="circuit" style={{height: circuitHeight}}>
                    <div className="starting-grid lap" data-order="0">
                        <small>Grid</small>
                    </div>
                    {renderLaps()}
                </div>
            </div>
            <div className="uk-margin uk-text-center">
                {started ? '' : (<button className="uk-button uk-button-primary"
                    onClick={start}>
                    Start
                </button>)}
            </div>
        </>
    );
}
