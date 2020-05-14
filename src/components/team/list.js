import React, {useEffect, useState} from 'react';
// import {useHistory} from 'react-router-dom';
import API from '../../API';
import ItemList from '../item-list';

export default function TeamList() {
    const
        // history = useHistory(),
        [busy, setBusy] = useState(true),
        [teams, setTeams] = useState([]);

    useEffect(() => {
        let isMounted = true;

        API.get('constructors').then(response => {
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
            {busy ? <span data-uk-spinner=""/> : (
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
