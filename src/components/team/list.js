import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {remoteApi} from '../../API';
import ItemList from '../item-list';

export default function TeamList() {
    const
        history = useHistory(),
        [teams, setTeams] = useState([]);

    useEffect(() => {
        let isMounted = true;

        remoteApi.get('constructors').then(response => {
            const {data: {ConstructorTable: {Constructors: Teams}}} = response;
            isMounted && setTeams(Teams);
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return <ItemList
        heading="Teams"
        items={teams}
        keys={['name']}
        onClick={team => history.push(`/teams/${team.constructorId}`)}
    />;
}
