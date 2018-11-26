import { combineReducers } from "redux";
// import NavigationReducer from "./navigationReducer";
import ScreenReducer from "./screenReducer"
import StateReducer from "./stateReducer"

const AppReducer = combineReducers({
  ScreenReducer,
  StateReducer
});

export default AppReducer;