import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

function List({letter, items, props, onClick, filter = ''}) {
    const
        regexp = new RegExp(`(${filter})`, 'ig'),
        replace = '<span style="background-color: #FFFF33">$1</span>';

    return (
        <dl className="uk-margin-remove">
            {letter && <dt className="uk-text-large">{letter}</dt>}

            {items.map((item, i) => {
                const {visible} = item;
                const obj = {...item};

                filter && props.forEach(prop => {
                    const {[prop]: str} = obj;

                    obj[prop] = regexp.test(str)
                        ? str.replace(regexp, replace)
                        : str;
                });

                return (
                    <dd key={`item-${i}`} className={visible ? '' : 'uk-hidden'}>
                        <a href="/" onClick={(e) => {
                            e.preventDefault();
                            onClick(item);
                        }}>
                            {props.map((prop, j) => {
                                return (
                                    <Fragment key={j}>
                                        <span dangerouslySetInnerHTML={{__html: obj[prop]}}/>
                                        {j === props.length - 1 ? '' : ', '}
                                    </Fragment>
                                );
                            })}
                        </a>
                    </dd>
                );
            })}
        </dl>
    );
}

export default function ItemList({heading, items, props, onClick}) {
    const
        [data, setData] = useState({}),
        [modalData, setModalData] = useState([]),
        [filter, setFilter] = useState('');

    useEffect(() => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        setData(() => {
            const state = {};

            letters.forEach(letter => {
                const array = items.filter(item => {
                    const {[props[0]]: str} = item;
                    return str.charAt(0) === letter;
                });

                array.sort();

                state[letter] = array.map((item, i) => {
                    item.visible = i < 9;
                    return item;
                });
            });

            return state;
        });

        return () => {
            setData({});
            setModalData(null);
        };
    }, [items, props]);

    function toggleItems(array, visible = true) {
        array.forEach(item => {
            item.visible = visible;
        });
    }

    function showAllItems(letter) {
        const array = _.cloneDeep(data[letter]);

        toggleItems(array);

        setModalData([
            letter,
            array
        ]);
    }

    function handleSearch(e) {
        const f = (e.target.value || '').trim().toLowerCase();

        setFilter(f);

        setData(prevState => {
            const state = {};

            Object.keys(prevState).forEach(letter => {
                const array = _.cloneDeep(prevState[letter]);

                toggleItems(array, false);

                array.forEach((item, i) => {
                    let found = 0;

                    props.forEach(prop => {
                        const {[prop]: str} = item;
                        found += Number(str.toLowerCase().includes(f));
                    });

                    item.visible = f ? found > 0 : i < 9;
                });

                state[letter] = array;
            });

            return state;
        });
    }

    let visibleCards = 0;

    return (
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
                        itemsCount = array.length,
                        visibleItemsCount = array.filter(item => item.visible).length,
                        showCard = visibleItemsCount > 0;

                    visibleCards += Number(showCard);

                    return showCard > 0 ? (
                        <div key={letter} className="uk-width-1-5">
                            <div className="uk-card uk-card-default uk-card-body">
                                <List {...{letter, items: array, props, onClick, filter}}/>

                                {itemsCount > visibleItemsCount && (
                                    <button
                                        onClick={() => showAllItems(letter)}
                                        data-uk-toggle="target: #modal"
                                        title={`Show all ${itemsCount}`}
                                        className="uk-button uk-button-link">
                                        <FontAwesomeIcon icon={faEllipsisH}/>
                                    </button>
                                )}
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

            <div id="modal" data-uk-modal="">
                <div data-uk-overflow-auto="" className="uk-modal-dialog">
                    {(() => {
                        const [letter, array] = modalData;

                        return (
                            <>
                                <div className="uk-modal-header">
                                    <h2 className="uk-modal-title">{letter}</h2>
                                </div>
                                <div className="uk-modal-body">
                                    <div className="uk-column-1-3">
                                        <List {...{items: array, props, onClick}}/>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </>
    );
}

ItemList.propTypes = {
    heading: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    props: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
};
