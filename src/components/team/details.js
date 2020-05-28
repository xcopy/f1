import React, {useEffect} from 'react';
import Alert from '../alert';
import Spinner from '../spinner';
import withStandings from '../with-standings';

function TeamDetails({match, Constructor: {busy, data}, onReady}) {
    useEffect(() => {
        const {params: {teamId}} = match;

        onReady({
            id: teamId,
            Model: 'Constructor'
        });
        // eslint-disable-next-line
    }, [match]);

    return (
        <>
            {busy ? <Spinner text="Loading team details"/> : (() => {
                return data ? (() => {
                    const {name} = data;

                    return (
                        <h1 className="uk-text-uppercase">{name}</h1>
                    );
                })() : <Alert>Team not found.</Alert>
            })()}
        </>
    );
}

export default withStandings(TeamDetails);
