import React, {useState, useEffect} from 'react';
import {remoteApi} from '../../API';
import Spinner from '../spinner';
import Wiki from '../wiki';
import Card from '../card';

export default function CircuitList() {
    const
        [busy, setBusy] = useState(true),
        [circuits, setCircuits] = useState([]);

    useEffect(() => {
        let isMounted = true;

        remoteApi.get('circuits').then(response => {
            const {data: {CircuitTable: {Circuits}}} = response;

            if (isMounted) {
                setCircuits(Circuits);
                setBusy(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="uk-padding-small">
            {busy ? <Spinner/> : (
                <>
                    <h1 className="uk-text-uppercase">Circuits</h1>
                    <div
                        data-uk-grid=""
                        data-uk-height-match="target: > div > .uk-card"
                        className="uk-grid-small">
                        {circuits.map(circuit => {
                            const {circuitId: id, circuitName: name, url} = circuit;

                            return (
                                <div key={id} className="uk-width-1-2">
                                    <Card title={name}>
                                        <Wiki url={url}/>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
