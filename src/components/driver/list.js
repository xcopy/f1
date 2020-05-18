import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {localApi} from '../../API';
import ItemList from '../item-list';

export default function DriverList() {
    const
        history = useHistory(),
        [busy, setBusy] = useState(true),
        [drivers, setDrivers] = useState([]);

    useEffect(() => {
        let isMounted = true;

        localApi.get('drivers').then(response => {
            const {data: {DriverTable: {Drivers}}} = response;

            if (isMounted) {
                setDrivers(Drivers);
                setBusy(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="uk-padding-small">
            {busy ? <span data-uk-spinner=""/> : (
                <ItemList
                    heading="Drivers"
                    items={drivers}
                    props={['familyName', 'givenName']}
                    onClick={(driver) => history.push(`/drivers/${driver.driverId}`)}
                />
            )}
        </div>
    );
}
