import React from 'react';
import PropTypes from 'prop-types';
import {yearsToStr} from '../helpers';

ActiveYears.propTypes = {
    standings: PropTypes.array.isRequired
};

export default function ActiveYears({standings}) {
    const years = standings.map(({season}) => season);
    console.log(years);

    return years.length
        ? (
            <>
                {years.length} <span className="uk-text-muted">({yearsToStr(years)})</span>
            </>
        )
        : '-';
}
