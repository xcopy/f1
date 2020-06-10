// import {GET_SEASON_RESULTS} from './action-types';
import {combineReducers} from 'redux';

function results(state = [], action) {
    /*
    switch (action.type) {
        case GET_SEASON_RESULTS:
            return action.payload;
        default:
            return state;
    }
    */
    return state;
}

export default combineReducers({results});
