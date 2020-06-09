import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {remoteApi} from '../../API';
import Card from '../card';
import Wiki from '../wiki';
import Alert from '../alert';
import Spinner from '../spinner';
// import DriverResults from '../driver/results';

export default function CircuitDetails({match}) {
    const
        {params: {circuitId}} = match,
        [busy, setBusy] = useState(true),
        [circuit, setCircuit] = useState();
        // [races, setRaces] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const path = `circuits/${circuitId}`;

        axios.all([
            remoteApi.get(path)
            // remoteApi.get(`${path}/results/1`)
        ]).then(([C/*,R*/]) => {
            const {data: {CircuitTable: {Circuits: [Circuit]}}} = C;
            // const {data: {RaceTable: {Races}}} = R;

            if (isMounted) {
                setCircuit(Circuit);
                // setRaces(Races);
                setBusy(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [circuitId]);

    return (
        <div className="uk-padding-small">
            {busy ? <Spinner text="Loading circuit details"/> : (() => {
                return circuit ? (() => {
                    const {url, circuitName: name} = circuit;

                    return (
                        <>
                            <h1 className="uk-text-uppercase">{name}</h1>
                            <hr className="uk-divider-icon"/>
                            <div
                                data-uk-grid=""
                                data-uk-height-match="target: > div > .uk-card"
                                className="uk-grid-small">
                                <div className="uk-width-1-2">
                                    <Card title="Summary">
                                        <Wiki url={url}/>
                                    </Card>
                                </div>
                                <div className="uk-width-1-2">
                                    +++
                                </div>
                            </div>
                            {/*
                            <hr className="uk-divider-icon"/>
                            <DriverResults races={races}/>
                            */}
                        </>

                    );
                })() : <Alert>Circuit not found.</Alert>;
            })()}
        </div>
    );
}
