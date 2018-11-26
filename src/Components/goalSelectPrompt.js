import React, { Component } from "react";
import { Text, 
  View, 
  StyleSheet,  
  TouchableWithoutFeedback,
   } from "react-native";
import { connect } from "react-redux";
import {Ionicons} from "@expo/vector-icons";
import { initializeNewGoal, purchaseScreen, newGoalScreen } from "../Actions/actionCreator";


class SelectGoalModalView extends Component {
    decideGoal(goalId) {
      var screen = this.props.navigation.state.params.screen

      if (goalId == "new") {
        // navigate to new goal prompt
        this.props.newGoalScreen(screen)
      } else if (goalId != null) {
        this.props.initializeNewGoal(goalId)
        this.props.purchaseScreen(screen)
      }

      this.props.navigation.goBack();
    }
  
    render() {
      let goals = []

      for (let [i, goal] of this.props.goals.entries()) {
        goals.push(
          <TouchableWithoutFeedback 
          key={i}
          onPress = {() => this.decideGoal(goal.id)}>
            <View>
              <Text style={styles.goalType}>{goal.name}</Text>
            </View>
          </TouchableWithoutFeedback>
        )
      }

      return (
        <View style = {styles.modal}>
          <Text style={styles.goalTypeHeading}>Add to which goal?</Text>
          {goals}
          <TouchableWithoutFeedback 
          onPress = {() => this.decideGoal("new")}>
            <View>
              <Text style={styles.goalType}>Create new goal...</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress = {() => this.decideGoal(null)}>
              <Ionicons 
                name="ios-close-circle-outline" 
                size={50} 
                color="#3a3b3d" 
                style={{marginTop:40, marginRight:5}}/>
          </TouchableWithoutFeedback>
      </View>
      )
    }
  }

const mapStateToProps = (state) => ({
  goals: state.StateReducer.goals
});

const mapDispatchToProps = (dispatch) => ({
  initializeNewGoal: (id) => dispatch(initializeNewGoal(id)),
  purchaseScreen: (screen) => dispatch(purchaseScreen(screen)),
  newGoalScreen: (screen) => dispatch(newGoalScreen(screen))
});

const SelectGoalScreen = connect(mapStateToProps, mapDispatchToProps)(SelectGoalModalView);


export default SelectGoalScreen;


const styles = StyleSheet.create({
  goalTypeHeading: {
      fontSize: 40,
      marginTop: 30,
      marginBottom: 20,
      textAlign: 'center',
      },
    goalType: {
        fontSize: 35,
        fontWeight: 'bold',
        marginTop: 40,
        textAlign: 'center'
        },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});