import React, { Component } from "react";
import { Text, 
  View, 
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
   } from "react-native";
import { LinearGradient } from 'expo';
import { connect } from "react-redux";


var buttonHeight = 0.08
var buttonWidth = 0.8


export default class ScreenCoreCTAButton extends Component {
    render() {
      return (
        <TouchableWithoutFeedback onPress = {() => this.props.navigate(this.props.screen, this.props.goalId, this.props.fundId)}>
            <View>
                <View style={{backgroundColor: 'rgba(0,0,0,0.5)', borderBottomColor: '#b3b3cc', borderBottomWidth: StyleSheet.hairlineWidth}}></View>
                <LinearGradient
                colors={['#1b2128', 'black']}
                style={{ 
                    alignSelf: 'center', 
                    alignItems:'center', 
                    justifyContent: 'center',  
                    marginTop: 10, 
                    marginBottom: 10, 
                    borderRadius: 3, 
                    height: Dimensions.get('window').height*buttonHeight, 
                    width: Dimensions.get('window').width*buttonWidth}}>
                    <View>
                    <Text style={{
                        fontSize:21, 
                        fontWeight: '600', 
                        color: 'white', 
                        backgroundColor: 'rgba(0,0,0,0)'}}>
                        {this.props.ctaText}
                    </Text>
                    </View>
                </LinearGradient>
            </View>
        </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state) => ({
    funds: state.StateReducer.funds,
    goals: state.StateReducer.goals,
    toScreen: state.ScreenReducer.toScreen,
    fromScreen: state.ScreenReducer.fromScreen,
    newGoal: state.StateReducer.newGoal,
    recommendations: state.StateReducer.recommendations,
});

const mapDispatchToProps = (dispatch) => ({
});

connect(mapStateToProps, mapDispatchToProps)(ScreenCoreCTAButton);