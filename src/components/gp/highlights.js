import React from 'react';
import PropTypes from 'prop-types';
import Alert from '../alert';

const highlightsArr = [
    {s: 2019, r: 1, id: 'NdD8gEGj0to'}
];

export default function GPHighlights({race}) {
    const {season, round, raceName} = race;
    const {id: ytVideoId} = highlightsArr.find(({s, r}) => parseInt(season) === s && parseInt(round) === r) || {};

    if (!ytVideoId) {
        return (
            <div style={{minHeight: 500}}>
                <Alert>There are no highlights to display.</Alert>
            </div>
        );
    }

    return (
        <iframe
            data-uk-responsive="" data-uk-video=""
            title={`${season} ${raceName}`}
            src={`https://www.youtube.com/embed/${ytVideoId}`}
            width="1920"
            height="1080"
            frameBorder="0"
            allowFullScreen=""/>
    );
}

GPHighlights.propTypes = {
    race: PropTypes.object.isRequired
};
