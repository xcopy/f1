import React, {useEffect} from 'react';
import Alert from '../alert';
import DriverRecords from '../driver/records';
import Wiki from '../wiki';
import Spinner from '../spinner';
import withStandings from '../with-standings';

function TeamDetails(props) {
    const {
        match: {params: {teamId}},
        Constructor: {busy, data: Constructor},
        Standings,
        Races,
        onReady
    } = props;

    useEffect(() => {
        onReady({
            id: teamId,
            Model: 'Constructor'
        });
        // eslint-disable-next-line
    }, [teamId]);

    return busy ? <Spinner text="Loading team details"/> : (() => {
        return Constructor ? (() => {
            const {url, name} = Constructor;

            return (
                <>
                    <h1 className="uk-text-uppercase">{name}</h1>
                    <hr className="uk-divider-icon"/>
                    <div
                        data-uk-grid=""
                        data-uk-height-match="target: > div > .uk-card"
                        className="uk-grid-small">
                        <div className="uk-width-3-4">
                            <Wiki url={url}/>
                        </div>
                        <div className="uk-width-1-4">
                            <DriverRecords standings={Standings} races={Races}/>
                        </div>
                    </div>
                </>
            );
        })() : <Alert>Team not found.</Alert>
    })();
}

export default withStandings(TeamDetails);
