import React, {Fragment, useEffect, useState} from 'react';
import {renderToString} from 'react-dom/server';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import Spinner from './spinner';
import Card from './card';

const Highlight = styled.span`
    background-color: #FFFF33;
    font-weight: bold;
`;

export default function ItemList({heading, items, keys, onClick}) {
    const
        [data, setData] = useState(null),
        [filter, setFilter] = useState(''),
        regexp = new RegExp(`(${filter})`, 'ig');

    useEffect(() => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        items.length && setData(() => {
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
        const f = (e?.target.value || '').trim().toLowerCase();

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

    return (
        <div className="uk-padding-small">
            {data ? (
                <>
                    <div data-uk-grid="" className="uk-grid-small uk-flex uk-flex-middle">
                        <div className="uk-width-1-2 uk-width-3-5@m">
                            <h1 className="uk-text-uppercase">{heading}</h1>
                        </div>
                        <div className="uk-width-1-2 uk-width-expand@m">
                            <form
                                onSubmit={(e) => {e.preventDefault()}}
                                className="uk-search uk-search-default uk-width-1-1">
                                <div>
                                    <span className="uk-form-icon" data-uk-icon="icon: search"/>
                                    <input
                                        onChange={(e) => handleSearch(e)}
                                        value={filter}
                                        type="search"
                                        className="uk-input"
                                        placeholder="Search..."
                                    />
                                    {filter && (
                                        <a
                                            href="/"
                                            className="uk-form-icon uk-form-icon-flip"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSearch()
                                            }}>
                                            <span data-uk-icon="icon: close"/>
                                        </a>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                    <div
                        data-uk-grid=""
                        data-uk-height-match="target: > div > .uk-card"
                        className="uk-grid-small uk-grid-match">
                        {Object.keys(data).map(letter => {
                            const
                                itemsArray = data[letter],
                                visibleItemsCount = itemsArray.filter(item => item.visible).length,
                                showCard = visibleItemsCount > 0;

                            visibleCards += Number(showCard);

                            return showCard > 0 ? (
                                <div key={letter} className="uk-width-1-5@m">
                                    <Card title={() => {
                                        return (
                                            <>
                                                <span className="uk-text-large">{letter}</span>
                                                <small>({itemsArray.length})</small>
                                            </>
                                        );
                                    }}>
                                        <dl className="uk-margin-remove uk-overflow-auto" style={{maxHeight: 240}}>
                                            {itemsArray.map(item => {
                                                const {driverId, constructorId, visible} = item;
                                                const item$ = {...item};
                                                const id = driverId || constructorId;

                                                filter && keys.forEach(key => {
                                                    const {[key]: str} = item$;

                                                    // just replace string value(s)
                                                    // equivalent to:
                                                    // item.prop = test ? item.prop.replace(...) : item.prop
                                                    item$[key] = regexp.test(str)
                                                        ? str.replace(
                                                            regexp,
                                                            renderToString(<Highlight>$1</Highlight>)
                                                        )
                                                        : str;
                                                });

                                                return (
                                                    <dd
                                                        key={`item-${id}`}
                                                        className={classNames({'uk-text-truncate': true, 'uk-hidden': !visible})}>
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
                                                                    <Fragment key={`${key}-${id}`}>
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
                                    </Card>
                                </div>
                            ) : null;
                        })}
                    </div>

                    {visibleCards === 0 && (
                        <div className="uk-text-center uk-margin-medium">
                            No matching results found for <b>&laquo;{filter}&raquo;</b>
                        </div>
                    )}
                </>
            ) : <Spinner/>}
        </div>
    );
}

ItemList.propTypes = {
    heading: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    keys: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
};
