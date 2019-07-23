import {combineReducers} from 'redux';
import courseReducer from './course';
import utilReducer from './utils';

const rootReducer = combineReducers({
    courseState: courseReducer,
    utilState: utilReducer
});

export default rootReducer;
