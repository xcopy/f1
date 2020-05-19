import React from 'react';
import PropTypes from 'prop-types';

export default function Spinner({text}) {
    return (
        <div className="uk-flex uk-flex-middle">
            <span data-uk-spinner=""/>
            <span className="uk-text-muted uk-padding-small uk-padding-remove-vertical">
                {text || 'Loading...'}
            </span>
        </div>
    );
}

Spinner.propTypes = {
    text: PropTypes.string
};
