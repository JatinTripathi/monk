import * as actions from "../Actions/actionTypes";

const initialState = { fromScreen: "home", toScreen: "stay", name: null, id: null};

const ScreenReducer = (state = initialState, action) => {
    switch (action.type) {

        case actions.taxGoal:
            return Object.assign({}, state, {toScreen: "goal", name: "Tax savings", id: null});

        case actions.investmentGoal:
            return Object.assign({}, state, {toScreen: "goal", name: "Investment", id: null});

        case actions.somethingElseGoal:
            return Object.assign({}, state, {toScreen: "goal", name: "Something Else", id: null});

        case actions.newGoalScreen:
            return Object.assign({}, state, 
                {fromScreen: action.screen, toScreen: "newGoal", name: null, id: null});

        case actions.purchaseScreen:
            return Object.assign({}, state, 
                {fromScreen: action.screen, toScreen: "purchase", name: null, id: null});

        case actions.purchaseComplete:
            return Object.assign({}, state, {toScreen: "back", name: null, id: null});
            
        case actions.initializeGoal:
            return Object.assign({}, state, initialState);

        default:
            return state;
    }
};

export default ScreenReducer