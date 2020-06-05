import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {remoteApi} from '../../API';
import ItemList from '../item-list';

export default function DriverList() {
    const
        history = useHistory(),
        [drivers, setDrivers] = useState([]);

    useEffect(() => {
        let isMounted = true;

        remoteApi.get('drivers').then(response => {
            const {data: {DriverTable: {Drivers}}} = response;
            isMounted && setDrivers(Drivers);
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return <ItemList
        heading="Drivers"
        items={drivers}
        keys={['familyName', 'givenName']}
        onClick={(driver) => history.push(`/drivers/${driver.driverId}`)}
    />;
}
