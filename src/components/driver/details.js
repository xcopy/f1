import React, {useEffect} from 'react';
import Spinner from '../spinner';
import Alert from '../alert';
import withStandings from '../with-standings';

function DriverDetails({match, Driver: {busy, data}, onReady}) {
    useEffect(() => {
        const {params: {driverId}} = match;

        onReady({
            id: driverId,
            Model: 'Driver'
        });
        // eslint-disable-next-line
    }, [match]);

    return (
        <>
            {busy ? <Spinner text="Loading driver details"/> : (() => {
                return data ? (() => {
                    const {familyName, givenName} = data;

                    return (
                        <h1 className="uk-text-uppercase">{givenName} {familyName}</h1>
                    );
                })() : <Alert>Driver not found.</Alert>
            })()}
        </>
    );
}

export default withStandings(DriverDetails);
