import React from 'react';
import PropTypes from 'prop-types';

const highlightsArr = [
    {s: 2019, r: 1, id: 'NdD8gEGj0to'}
];

export default function GPHighlights({race}) {
    const {season, round, raceName} = race;
    const {id: ytVideoId} = highlightsArr.find(h => {
        const {s, r} = h;
        return parseInt(season) === s && parseInt(round) === r;
    }) || {};

    if (!ytVideoId) {
        return <div className="uk-text-center">There are no highlights to display</div>;
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
