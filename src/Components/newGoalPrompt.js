import React, { Component } from "react";
import { Text, 
  View, 
  StyleSheet,  
  TouchableWithoutFeedback,
   } from "react-native";
import { LinearGradient } from 'expo';
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import {Ionicons} from "@expo/vector-icons";
import { tax, investment, somethingElse, addGoal, purchaseScreen } from "../Actions/actionCreator";


class NewGoalModalView extends Component {
    decideGoal(goal) {
      if (this.props.navigation.state.params.fundId != null && goal != null) {
        // add goal to goals array
        this.props.addGoal(goal)
        // set screenreducer state for navigating to transaction screen
        this.props.purchaseScreen(this.props.navigation.state.params.screen)
      } else {
        if (goal == "Tax Saving") {
          this.props.tax();
        }
        if (goal == "Investment") {
          this.props.investment();
        }
        if (goal == "Something Else") {
          this.props.something();
        }
      }

      this.props.navigation.goBack();
    };
  
    render() {
      return (
        <View style = {styles.modal}>
        <Text style={styles.goalTypeHeading}>What is your goal?</Text>
        <TouchableWithoutFeedback 
        onPress = {() => this.decideGoal("Tax Saving")}>
          <View>
            <Text style={styles.goalType}>Tax Saving</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback 
        onPress = {() => this.decideGoal("Investment")}>
          <View>
          <Text style={styles.goalType}>Investment</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback 
        onPress = {() => this.decideGoal("Something Else")}>
          <View>
          <Text style={styles.goalType}>Something else...</Text>
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
  screen: state.ScreenReducer.screen,
  name: state.ScreenReducer.name
});

const mapDispatchToProps = (dispatch) => ({
  tax: () => dispatch(tax()),
  investment: () => dispatch(investment()),
  something: () => dispatch(somethingElse()),
  addGoal: (name) => dispatch(addGoal(name)),
  purchaseScreen: (screen) => dispatch(purchaseScreen(screen))
});

const NewGoalScreen = connect(mapStateToProps, mapDispatchToProps)(NewGoalModalView);


export default NewGoalScreen;


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