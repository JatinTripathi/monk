import { StackNavigator } from "react-navigation";
import GoalScreen from "../Components/goalScreen";
import HomeScreen from "../Components/homeScreen";
import NewGoalModal from "../Components/newGoalPrompt"
import TransactionScreen from "../Components/transactionScreen"
import FundScreeen from "../Components/fundScreen"
import SearchFund from "../Components/searchFundScreen";
import SelectGoalScreen from "../Components/goalSelectPrompt";
import GoalManagementScreen from "../Components/goalManagement";


// Main Card-Style Navigator
const MainStack = StackNavigator({
    home: { screen: GoalManagementScreen },
    // home: { screen: HomeScreen },
    goal: {screen: GoalScreen},
    fund: {screen: FundScreeen}
  },
  {
    headerMode: 'none',
  });
  
  
const NavigationStack = StackNavigator({
  mainScreens: {screen: MainStack},
  newGoal: {screen: NewGoalModal},
  selectGoal: {screen: SelectGoalScreen},
  searchFund: {screen: SearchFund},
  transaction: {screen: TransactionScreen}
},
{
  mode: 'modal',
  headerMode: 'none',
});


export default NavigationStack;

