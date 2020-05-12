import React, {useEffect, useState} from 'react';
import API from '../../API';
import ItemList from '../item-list';

export default function DriverList() {
    const
        [busy, setBusy] = useState(true),
        [drivers, setDrivers] = useState([]);

    useEffect(() => {
        let isMounted = true;

        API.get('drivers').then(response => {
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
        <>
            {busy ? <span data-uk-spinner=""/> : (
                <ItemList
                    heading="Drivers"
                    items={drivers}
                    props={['familyName', 'givenName']}
                />
            )}
        </>
    );
}
