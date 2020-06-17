import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {remoteApi, localApi} from '../API';
// import {timeToMs} from '../helpers';
import Spinner from './spinner';

// const lapWidth = 100;
const driverHeight = 30;

const Circuit = styled.div`
overflow: auto;
position: relative;
width: 1500px;
// height: ${driverHeight * 20}px;
margin: 10px auto;
border: 1px solid;
`;

const Laps = styled.div`
display: flex;
flex-direction: row;
height: inherit;
`;

const Lap = styled.div`
flex: none;
position: relative;
box-shadow: -1px 0 1px -1px #666;
text-transform: uppercase;
width: ${({width}) => width}px;
order: 0;

&>small {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 5px;
}
`;

const Drivers = styled.div`
position: absolute;
width: 100%;
height: inherit;
z-index: 1;
`;

const Driver = styled.div`
position: absolute;
z-index: 1;
line-height: 1;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-end;
height: ${driverHeight}px;

&>small {
  padding: 5px;
  text-align: center;
  font-weight: bold;
  color: #fff;
  background-color: #000;
  min-width: 30px;
}
`;

export default function Race() {
    const [drivers, setDrivers] = useState({});
    const [laps, setLaps] = useState([]);
    const [busy, setBusy] = useState(true);
    const lapWidth = (5303 / 100) * 2; // 5303 m

    useEffect(() => {
        axios.all([
            remoteApi.get('2019/1/results'),
            localApi.get('2019/1/laps')
        ]).then(([R, L]) => {
            const {data: {RaceTable: {Races: [{Results}]}}} = R;
            const {data: {RaceTable: {Races: [{Laps}]}}} = L;

            Results.forEach(result => {
                const {
                    grid,
                    Driver: {code},
                    Constructor: {constructorId: team}
                } = result, css = {
                    width: lapWidth - (grid - 1),
                    top: (grid - 1) * driverHeight
                };

                setDrivers(prevState => {
                    return {
                        ...prevState,
                        [code]: {
                            team,
                            css
                        }
                    };
                });
            });

            setLaps(Laps);
            setBusy(false);
        });
        // eslint-disable-next-line
    }, []);

    return busy ? <Spinner/> : (
        <>
            <button>Start</button>
            <Circuit style={{height: (Object.keys(drivers).length * driverHeight) + driverHeight}}>
                <Drivers>
                    {Object.keys(drivers).map(code => {
                        const {css} = drivers[code];
                        return (
                            <Driver key={code} id={code} style={css}>
                                <small>{code}</small>
                            </Driver>
                        );
                    })}
                </Drivers>
                <Laps>
                    <Lap width={lapWidth}>
                        <small>Grid</small>
                    </Lap>
                    {laps.map(({number}) =>
                        <Lap
                            key={`lap-${number}`}
                            id={`lap-${number}`}
                            style={{order: number}}
                            width={lapWidth}>
                            <small>Lap {number}</small>
                        </Lap>
                    )}
                </Laps>
            </Circuit>
        </>
    );
}
