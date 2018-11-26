import * as action from "./actionTypes";

export const tax = () => ({
  type: action.taxGoal,
});

export const investment = () => ({
  type: action.investmentGoal,
});

export const newGoalScreen = (screen) => ({
  type: action.newGoalScreen,
  screen
});

export const purchaseScreen = (screen) => ({
  type: action.purchaseScreen,
  screen
});

export const somethingElse = () => ({
  type: action.somethingElseGoal,
});

export const initialize = () => ({
  type: action.initializeGoal,
});

export const addGoal = (name) => ({
  type: action.addGoal,
  name,
});

export const initializeNewGoal = (id) => ({
  type: action.initializeNewGoal,
  id,
});

export const editGoal = (name, id) => ({
  type: action.editGoal,
  name,
  id,
});

export const purchaseComplete = () => ({
  type: action.purchaseComplete
})

export const purchaseNew = (goalId, fundId, value) => ({
  type: action.purchaseNew,
  goalId,
  fundId,
  value
})

export const purchaseMore = (goalId, fundId, value) => ({
  type: action.purchaseMore,
  goalId,
  fundId,
  value
})

export const newGoalInitialized = () => ({
  type: action.newGoalInitialized
})

export const redeemCompletely = (goalId, fundId, value) => ({
  type: action.redeemCompletely, 
  goalId, 
  fundId, 
  value
})

export const redeemPartially = (goalId, fundId, value) => ({
  type: action.redeemPartially, 
  goalId, 
  fundId, 
  value
})