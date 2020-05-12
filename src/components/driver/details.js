import React, {useEffect, useState} from 'react';
import API from '../../API';

export default function DriverDetails({match}) {
    const
        {params: {id}} = match,
        [busy, setBusy] = useState(true),
        [driver, setDriver] = useState();

    useEffect(() => {
        API.get('drivers').then(response => {
            const {data: {DriverTable: {Drivers}}} = response;

            setDriver(Drivers.find(driver => {
                const {driverId} = driver;
                return driverId === id;
            }));
            setBusy(false);
        });
    }, [id]);

    return (
        <div className="uk-padding-small">
            {busy ? <span data-uk-spinner=""/> : driver ? (() => {
                const {familyName, givenName} = driver;

                return (
                    <>
                        <h1 className="uk-text-uppercase">{givenName} {familyName}</h1>
                        <div data-uk-grid="" className="uk-grid-small">
                            <div>
                                <div className="uk-card uk-card-default uk-card-body">
                                    <h3>Championships</h3>
                                </div>
                            </div>
                            <div>
                                <div className="uk-card uk-card-default uk-card-body">
                                    <h3>Wins</h3>
                                </div>
                            </div>
                            <div>
                                <div className="uk-card uk-card-default uk-card-body">
                                    <h3>Podiums</h3>
                                </div>
                            </div>
                        </div>
                    </>
                );
            })() : <div className="uk-text-center">Driver not found</div>}
        </div>
    );
}
