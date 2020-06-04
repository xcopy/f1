import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

Card.propTypes = {
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    title: PropTypes.any
};

export default function Card(props) {
    const {primary, secondary, title, children} = props;

    return (
        <div className={`uk-card uk-card-${primary ? 'primary' : (secondary ? 'secondary' : 'default')}`}>
            {title && (
                <div className="uk-card-header">
                    <h3 className="uk-card-title">
                        {_.isFunction(title) ? title() : title}
                    </h3>
                </div>
            )}
            <div className="uk-card-body">
                {children}
            </div>
        </div>
    );
}
