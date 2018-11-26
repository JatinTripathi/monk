import { createStore } from 'redux';
import AppReducer from '../Reducers'

const store = createStore(AppReducer);

export default store;