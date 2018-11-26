import * as actions from "../Actions/actionTypes";

const initialState = { 
    newGoal: null,
    goals: [], 
    recommendations: [1, 2, 2],
    funds: [
        {
            "id": 1,
            "recommendation": "TOP PERFORMER",
            "name": "Axis Long Term Equity Fund",
            "price": "200",
            "category": "Growth",
            "purchaseMultiple": "1000",
            "expenseRation": "1.2",
            "annualReturns": "11.1",
            "values": [40, 30, 70, 60, 70, 40, 70, 50, 85, 100]
        },
        {
            "id": 2,
            "recommendation": "TOP PERFORMER",
            "name": "Axis Equity Fund",
            "price": "200",
            "category": "Growth",
            "purchaseMultiple": "1000",
            "expenseRation": "1.2",
            "annualReturns": "8.88",
            "values": [40, 30, 70, 60, 90, 40, 20, 50, 55, 100]
        }
    ] };

const StateReducer = (state = initialState, action) => {
    switch (action.type) {  

        case actions.addGoal:
            var id = state.goals.length + 1
            return Object.assign({}, 
                state, 
                { newGoal: id, goals: [ ...state.goals, { "id": id, "name": action.name, funds: [] }]}
            )

        case actions.initializeNewGoal:
            return Object.assign({}, state, { newGoal: action.id })

        case actions.newGoalInitialized:
            return Object.assign({}, state, { newGoal: null })

        case actions.editGoal:
            return Object.assign({}, state, {
                goals: state.goals.map((goal, index) => {
                    if (goal.id === action.id) {
                        return Object.assign({}, goal, {
                        name: action.name
                        })
                    }
                    return goal
                })
            })

        case actions.purchaseNew:
            return Object.assign({}, state, {
                goals: state.goals.map((goal, index) => {
                    if (goal.id === action.goalId) {                     
                        return Object.assign({}, goal, {
                            funds: [ 
                              ...goal.funds, 
                              { 
                                "id": action.fundId, 
                                "value": action.value,
                                "growth": 0,
                              } ]
                        })
                    }
                    return goal
                })
            })

        case actions.purchaseMore:
            return Object.assign({}, state, {
                goals: state.goals.map((goal, index) => {
                    if (goal.id === action.goalId) {                     
                        return Object.assign({}, goal, {
                            funds: goal.funds.map((fund, index) => {
                                if (fund.id === action.fundId) {
                                    var currentValue = fund.value
                                    return Object.assign({}, fund, {
                                        value: currentValue + action.value
                                    })
                                }
                                return fund
                            })
                        })
                    }
                    return goal
                })
            })

        case actions.redeemCompletely:
            return Object.assign({}, state, {
                goals: state.goals.map((goal, index) => {
                    if (goal.id === action.goalId) {                     
                        return Object.assign({}, goal, {
                            funds: [
                                ...goal.funds.slice(0, index),
                                ...goal.funds.slice(index + 1)
                            ]
                        })
                    }
                    return goal
                })
            })

        case actions.redeemPartially:
            return Object.assign({}, state, {
                goals: state.goals.map((goal, index) => {
                    if (goal.id === action.goalId) {                     
                        return Object.assign({}, goal, {
                            funds: goal.funds.map((fund, index) => {
                                if (fund.id === action.fundId) {
                                    var currentValue = fund.value
                                    return Object.assign({}, fund, {
                                        value: currentValue - action.value
                                    })
                                }
                                return fund
                            })
                        })
                    }
                    return goal
                })
            })

        default:
            return state
    }
};

export default StateReducer 