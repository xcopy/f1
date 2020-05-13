import React from 'react';
import PropTypes from 'prop-types';

export default function Alert({type, children}) {
    return (
        <div data-uk-alert="" className={`uk-text-center${type ? ' uk-alert-'+type : ''}`}>
            {children || 'There are no results to display.'}
        </div>
    );
}

Alert.propTypes = {
    type: PropTypes.oneOf([
        'primary',
        'success',
        'warning',
        'danger'
    ])
};
