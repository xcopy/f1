import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Alert({type, children}) {
    return (
        <div data-uk-alert="" className={classNames({
            'uk-alert uk-text-center': true,
            [`uk-alert-${type}`]: type
        })}>
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
