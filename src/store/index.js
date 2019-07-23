import {createLogger} from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';

const logger = createLogger();

const store = createStore(rootReducer, undefined, applyMiddleware(logger));

export default store;
