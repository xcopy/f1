import React, {useEffect, useState} from 'react';
// import {useHistory} from 'react-router-dom';
import {localApi} from '../../API';
import ItemList from '../item-list';
import Spinner from '../spinner';

export default function TeamList() {
    const
        // history = useHistory(),
        [busy, setBusy] = useState(true),
        [teams, setTeams] = useState([]);

    useEffect(() => {
        let isMounted = true;

        localApi.get('constructors').then(response => {
            const {data: {ConstructorTable: {Constructors: Teams}}} = response;

            if (isMounted) {
                setTeams(Teams);
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
                <ItemList
                    heading="Teams"
                    items={teams}
                    props={['name']}
                    // todo
                    onClick={(team) => console.log(team)}
                />
            )}
        </div>
    );
}
