import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

export default function ItemList({heading, items, keys, onClick}) {
    const
        [data, setData] = useState(null),
        [filter, setFilter] = useState(''),
        regexp = new RegExp(`(${filter})`, 'ig'),
        replace = '<span style="background-color: #FFFF33">$1</span>';

    useEffect(() => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        setData(() => {
            const state = {};

            letters.forEach(letter => {
                state[letter] = items.filter(item => {
                    const {[keys[0]]: str} = item;

                    item.visible = true;

                    return str.charAt(0) === letter;
                });
            });

            return state;
        });
    }, [items, keys]);

    function handleSearch(e) {
        const f = (e.target.value || '').trim().toLowerCase();

        setFilter(f);

        setData(prevState => {
            const state = {};

            Object.keys(prevState).forEach(letter => {
                const array = prevState[letter];

                array.forEach(item => {
                    let found = 0;

                    keys.forEach(key => {
                        const {[key]: str} = item;
                        found += Number(str.toLowerCase().includes(f));
                    });

                    item.visible = f ? found > 0 : true;
                });

                state[letter] = array;
            });

            return state;
        });
    }

    let visibleCards = 0;

    return data ? (
        <>
            <div data-uk-grid="" className="uk-grid-small uk-flex uk-flex-middle">
                <div className="uk-width-3-5">
                    <h1 className="uk-text-uppercase">{heading}</h1>
                </div>
                <div className="uk-width-expand">
                    <form
                        onSubmit={(e) => {e.preventDefault()}}
                        className="uk-search uk-search-default uk-width-1-1">
                        <span data-uk-search-icon=""/>
                        <input
                            onChange={(e) => handleSearch(e)}
                            value={filter}
                            type="search"
                            className="uk-search-input"
                            placeholder="Search..."/>
                    </form>
                </div>
            </div>
            <div
                data-uk-grid=""
                data-uk-height-match="target: > div > .uk-card; row: false"
                className="uk-grid-small uk-grid-match">
                {Object.keys(data).map(letter => {
                    const
                        array = data[letter],
                        visibleItemsCount = array.filter(item => item.visible).length,
                        showCard = visibleItemsCount > 0;

                    visibleCards += Number(showCard);

                    return showCard > 0 ? (
                        <div key={letter} className="uk-width-1-5">
                            <div className="uk-card uk-card-default">
                                <div className="uk-card-header">
                                    <span className="uk-text-large">{letter}</span>
                                    <small>({array.length})</small>
                                </div>
                                <div className="uk-card-body">
                                    <dl className="uk-margin-remove uk-overflow-auto" style={{maxHeight: 240}}>
                                        {array.map((item, i) => {
                                            const {visible} = item;
                                            const item$ = {...item};

                                            filter && keys.forEach(key => {
                                                const {[key]: str} = item$;

                                                // just replace string value(s)
                                                // equivalent to:
                                                // item.prop = test ? item.prop.replace(...) : item.prop
                                                item$[key] = regexp.test(str)
                                                    ? str.replace(regexp, replace)
                                                    : str;
                                            });

                                            return (
                                                <dd
                                                    key={`item-${i}`}
                                                    className={`uk-text-truncate${visible ? '' : ' uk-hidden'}`}>
                                                    <a
                                                        href="/"
                                                        title={keys.map(key => item[key]).join(', ')}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            onClick(item);
                                                        }}
                                                    >
                                                        {keys.map((key, j) => {
                                                            return (
                                                                <Fragment key={j}>
                                                                    <span dangerouslySetInnerHTML={{__html: item$[key]}}/>
                                                                    {j === keys.length - 1 ? '' : ', '}
                                                                </Fragment>
                                                            );
                                                        })}
                                                    </a>
                                                </dd>
                                            );
                                        })}
                                    </dl>
                                </div>
                            </div>
                        </div>
                    ) : null;
                })}
            </div>

            {visibleCards === 0 ? (
                <div className="uk-text-center uk-margin-medium">
                    No matching results found for <b>&laquo;{filter}&raquo;</b>
                </div>
            ) : null}
        </>
    ) : null;
}

ItemList.propTypes = {
    heading: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    keys: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
};
