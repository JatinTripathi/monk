import React, { Component } from "react";
import { Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableWithoutFeedback,
   } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { Feather, MaterialIcons} from "@expo/vector-icons";
import { tax, investment, somethingElse, initialize } from "../Actions/actionCreator";
import FundListItem from "./fundListItem";
import ScreenCoreCTAButton from "./screenCoreCTA";
import constants from "../Constants"


class GoalListItem extends Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress = {() => this.props.navigate('goal', this.props.id)}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', marginLeft: 15, width: 140}}>
              <Text numberOfLines={2} style={styles.portfolio}>{this.props.name}</Text>
              <Text style={styles.goalValue}>₹ {this.props.goalValue}</Text>
            </View>
            <MaterialIcons name="navigate-next" size={36} color="#b3bdce" style={{marginTop:11, marginRight:5, alignSelf: "center", position: 'absolute', right: 10}}/>
          </View>
          <View style={styles.portfolioHorizon}/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}


class HomeScreenView extends Component {
  constructor(props) {
    super(props);
    this.state = {fundId: null};
  }

  navigate = (screen, goalId=null, fundId=null, name=null, 
    autoFocus=false, required_action="edit", fromScreen="home") => {
    const navigateToGoal = NavigationActions.navigate({
      routeName: "goal",
      params: { id: goalId, name: name, autoFocus: autoFocus, action: required_action }
    })
    const navigateToFund = NavigationActions.navigate({
      routeName: "fund",
      params: {
        fundId: fundId
      }
    })
    const navigateToTransation = NavigationActions.navigate({
      routeName: "transaction",
      params: {
        transactionType: screen,
        fundId: fundId,
        goalId: goalId
      }
    })
    const navigateToNewGoal = NavigationActions.navigate({
      routeName: "searchFund",
      params: {
        fundId: fundId,
        screen: fromScreen,
        searchType: constants.GOAL_SEARCH_TYPE
      }
    })
    const navigateToGoalSelect = NavigationActions.navigate({
      routeName: "selectGoal",
      params: {
        fundId: fundId,
        screen: fromScreen
      }
    })

    if (screen == "newGoal") {
      this.props.navigation.dispatch(navigateToNewGoal);
    }
    if (screen == "goal") {
      this.props.navigation.dispatch(navigateToGoal);
    }
    if (screen == 'fund') {
      this.props.navigation.dispatch(navigateToFund)
    }
    if (screen == 'purchase') {
      //  Check if there is any existing goal
      if (goalId == null) {
        // Initialize fundId otherwise null will be passed
        // in componentWillUpdate
        this.state.fundId = fundId
        if (this.props.goals.length == 0) {
          // Navigate to newGoalPrompt
          this.props.navigation.dispatch(navigateToNewGoal)
        } else {
          // Navigate to goalSelectPromt
          this.props.navigation.dispatch(navigateToGoalSelect)
        }
      } else {
        this.props.navigation.dispatch(navigateToTransation)
      }
    }
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.toScreen == "goal") {
      this.navigate("goal", null, null, nextProps.name, true, "create")
    } else if (nextProps.fromScreen == "home") {
      if (nextProps.toScreen == "purchase") {
        this.navigate("purchase", nextProps.newGoal, this.state.fundId)
      }
      if (nextProps.toScreen == "newGoal") {
        this.navigate('newGoal', null, this.state.fundId)
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.screen != "stay") {
        this.props.initialize()
      }
  };

  render() {    
    var goals = [];
    var recommendations = [];
    var totalInvestment = 0.0;

    if (this.props.goals.length > 0) {
      for(let i = 0; i < this.props.goals.length; i++) {
        var goalValue = 0
        var goalName = this.props.goals[i].name
        var id = this.props.goals[i].id
        
        for(let j = 0; j < this.props.goals[i].funds.length; j++) {
          goalValue = goalValue + this.props.goals[i].funds[j].value
        }

        totalInvestment = totalInvestment + goalValue

        goals.push(
          <GoalListItem key={id} id={id} name={goalName} goalValue={goalValue} navigate={this.navigate}/>
        )
      }
    }

    for(let i = 0; i < this.props.recommendations.length; i++) {
      
      recommendations.push(
        <FundListItem 
          key={i} 
          id={this.props.recommendations[i]}
          screen={"purchase"} 
          navigate={this.navigate}/>
      )
    }

    return (
      <View style={{flex: 1, alignItems: 'stretch' }}>
        <View style={{marginTop: 40, marginBottom: 20, marginLeft: 15, flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Feather name="menu" size={30} style={{marginTop: 7, fontWeight: '400'}}/>
          <Text style={styles.heading}>Portfolios</Text>
        </View>
        <ScrollView>
          <Text style={{marginLeft:15, fontSize:20, color: 'grey'}}>Recommended to your portfolio</Text>
          <ScrollView 
            style={{marginBottom:15}} 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            // pagingEnabled={true}
          >
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              {recommendations}
            </View>
          </ScrollView>
          <View style={styles.midHorizon}></View>
          {goals}
        </ScrollView>
        <ScreenCoreCTAButton navigate={this.navigate} ctaText="ADD NEW GOAL" screen="newGoal"/>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  toScreen: state.ScreenReducer.toScreen,
  fromScreen: state.ScreenReducer.fromScreen,
  name: state.ScreenReducer.name,
  id: state.ScreenReducer.id,
  goals: state.StateReducer.goals,
  funds: state.StateReducer.funds,
  recommendations: state.StateReducer.recommendations,
  newGoal: state.StateReducer.newGoal
});

const mapDispatchToProps = (dispatch) => ({
  tax: () => dispatch(tax),
  investment: () => dispatch(investment),
  something: () => dispatch(somethingElse),
  initialize: () => dispatch(initialize()),
});

const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(HomeScreenView);

export default HomeScreen;


const styles = StyleSheet.create({
    heading: {
      fontSize: 40,
      fontWeight: 'bold',
      marginLeft: 10
    },
    goalValue: {
      fontSize: 17,
      color: '#2c9b0a',
      fontWeight: '600',
      marginRight: 6,
      marginTop: 6
    },
    midHorizon: {
      borderBottomColor: '#b3b3cc',
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginLeft: 15,
      marginRight: 15
    },
    portfolio: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 7,
    },
    portfolioHorizon: {
      borderBottomColor: '#b3b3cc',
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginTop: 10,
      marginLeft: 15,
      marginRight: 15
    }
});