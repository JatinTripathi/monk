import React, { Component } from "react";
import { Text,
  TextInput, 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableWithoutFeedback,
  Dimensions
   } from "react-native";
import { LinearGradient } from 'expo';
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import {Ionicons} from "@expo/vector-icons";
import { addGoal, editGoal, newGoalInitialized } from "../Actions/actionCreator";
import FundListItem from "./fundListItem";
import ScreenCoreCTAButton from "./screenCoreCTA";
import Line from "./chart"


var graphPortion = 0.9
var graphComponentHeight = 0.35


class GoalScreenView extends Component {
  constructor(props) {
    
    super(props);
    this.state = { goalId: this.props.navigation.state.params.id,
      goalName: this.props.navigation.state.params.name,
      action: this.props.navigation.state.params.action,
      autoFocus: this.props.navigation.state.params.autoFocus};
  }

  getGoalName = () => {
    if (this.state.goalName == null) {
      for (var i = 0; i < this.props.goals.length; i++) {
        if (this.props.goals[i].id === this.state.goalId) {
          this.state.goalName = this.props.goals[i].name
        }
      }
    }
    return this.state.goalName
  }

  navigate = (screen, goalId=this.state.goalId, fundId=null) => {
    const navigateToTransation = NavigationActions.navigate({
      routeName: "transaction",
      params: {
        transactionType: screen,
        fundId: fundId,
        goalId: goalId
      }
    });
    const navigateToFund = NavigationActions.navigate({
      routeName: "fund",
      params: {
        fundId: fundId,
        goalId: goalId
      }
    })
    const goBack = NavigationActions.back()
    const searchFund = NavigationActions.navigate({
      routeName: "searchFund",
      params: {
        goalId: goalId
      }
    })

    if (screen == 'fund') {
      this.props.navigation.dispatch(navigateToFund)
    }
    if (screen == 'purchase') {
      this.props.navigation.dispatch(navigateToTransation)
    }
    if (screen == 'redemption') {
      this.props.navigation.dispatch(navigateToTransation)
    }
    if (screen == 'back') {
      this.props.navigation.dispatch(goBack)
    }
    if (screen == 'searchFund') {
      this.props.navigation.dispatch(searchFund)
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.goalId == null && nextProps.newGoal != null) {
      this.state.goalId = nextProps.newGoal
    }
    this.props.newGoalInitialized()
  };

  saveGoal = () => {
    this.props.editGoal(this.state.goalName, this.state.goalId)
  }

  componentWillMount() {
    if (this.state.action == "create") {
      this.props.addGoal(this.getGoalName())
      this.state.action = "edit"
    }     
  }

  render() {

    var funds = [];
    var goalId = null
    var goalValue = 0

    let goal = this.props.goals.find(goal => {
      return goal.id == this.state.goalId
    })

    if (goal != undefined) {
      goalId = goal.id
    }

    if (goal != undefined && goal.funds.length > 0) {
      for (let j = 0; j < goal.funds.length; j++) {
        var fundId = goal.funds[j].id
        goalValue += goal.funds[j].value
        
        funds.push(
          <View key={fundId}>
            <FundListItem 
              navigate={this.navigate} 
              id={fundId} 
              goalId={goalId} 
              screen={"redemption"}/>
            <View style={{
              borderBottomColor: '#b3b3cc',
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginLeft: 15,
              marginRight: 15,
              marginTop: 5}}/>
          </View>
        )
      }
    }


    return (
      <View style={{flex: 1, alignItems: 'stretch' }}>
        <View style={{flexDirection: 'row', marginTop:25}}>
          <Ionicons name="ios-arrow-back" size={40} color="#0e7afe" style={{alignSelf: "center", marginLeft:10}}/>
          <TouchableWithoutFeedback onPress = {() => this.navigate('back')}>
            <View style={{alignSelf: "center"}}>
              <Text style={{color: "#0e7afe", fontSize: 22, marginLeft:5, marginBottom: 3}}>Portfolios</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TextInput
          style={styles.heading}
          autoFocus={this.state.autoFocus}
          onChangeText={(goalName) => this.setState({goalName})}
          value={this.getGoalName()}
          returnKeyType="done"
          onSubmitEditing={this.saveGoal}
        />
        <View style={styles.midHorizon}></View>
        
        <ScrollView>
          <LinearGradient
              colors={['#04d870', '#048747']}
              style={{alignItems: 'center', justifyContent: 'center', 
              height: Dimensions.get('window').height*graphComponentHeight,
              width: Dimensions.get('window').width*graphPortion, 
              alignSelf: "center", borderRadius: 2,
              shadowOffset:{width: 0.6, height: 0.6},
              shadowColor: 'black', shadowOpacity: 0.6,
              marginTop: 10
              }}>
                <View style={styles.graph}>
                  <Text style={styles.goalValue}>₹ {goalValue}</Text>
                  <Line 
                    values={[0, 30, 31, 32, 35, 62, 62, 63, 72, 40, 42, 43, 85, 87]}
                    fillColor='rgba(255, 255, 255, 0.2)'
                    strokeColor="white"
                    strokeWidth={3} />
                </View>
            </LinearGradient>
          {funds}
        </ScrollView>
        <ScreenCoreCTAButton navigate={this.navigate} ctaText="BUY MUTUAL FUND" screen="searchFund"/>
      </View>
    )
  }
}


const mapStateToProps = (state) => ({
  screen: state.ScreenReducer.screen,
  name: state.ScreenReducer.name,
  goals: state.StateReducer.goals,
  funds: state.StateReducer.funds,
  recommendations: state.StateReducer.recommendations,
  newGoal: state.StateReducer.newGoal
});

const mapDispatchToProps = (dispatch) => ({
  addGoal: (name) => dispatch(addGoal(name)),
  editGoal: (name, init_name) => dispatch(editGoal(name, init_name)),
  newGoalInitialized: () => dispatch(newGoalInitialized())
});


connect(mapStateToProps, mapDispatchToProps)(FundListItem)

export default connect(mapStateToProps, mapDispatchToProps)(GoalScreenView);


const styles = StyleSheet.create({
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 7,
    marginLeft: 15,
  },
  midHorizon: {
    borderBottomColor: '#b3b3cc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 15,
    marginRight: 15
  },
  graph: {
    height: Dimensions.get('window').height*graphComponentHeight,
    width: Dimensions.get('window').width*graphPortion, 
    alignSelf: "center"
  },
  goalValue:{
    fontSize: 45,
    alignSelf: "center",
    fontWeight: "400",
    color: "white"
  }
});