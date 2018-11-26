import React, { Component } from "react";
import { Text, 
  View, 
  StyleSheet, 
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions
   } from "react-native";
import { connect } from "react-redux";
import { LinearGradient } from 'expo';
import { NavigationActions } from "react-navigation";
import { initialize } from "../Actions/actionCreator";
import { Ionicons } from "@expo/vector-icons";
import Line from './chart';
import ScreenCoreCTAButton from "./screenCoreCTA";
import FundListItem from "./fundListItem";


var graphPortion = 0.9
var graphComponentHeight = 0.4

function ExplainTerm(props) {
  if (props.explainTerm == "EXPENSE_RATIO") {
    var text = "Expense ratio is fee charged by mutual fund company from your invested sum. For eg. 1% of expense ratio will result in, you paying ₹10 per year for an invested sum of ₹1000 in a year"
    return (<Text style={styles.explainTerm}>{text}</Text>)
  }
  else {
    return (<View/>)
  }
}


class Explainer extends Component {
  render() {
    return (
        <View style={{marginTop: 20}}>
          <Text style={styles.explainerHeading}>{this.props.heading}</Text>
          <Text style={styles.explainerText}>{this.props.explainer}</Text>
          <ExplainTerm explainTerm={this.props.explainTerm}/>
          <View style={styles.explainerMidHorizon}/>
        </View>
      )
  }
}


class FundScreenView extends Component {
    constructor(props) {
      super(props);
      this.state = {fundId: this.props.navigation.state.params.fundId,
        goalId: this.props.navigation.state.params.goalId};
    }
    
    navigate = (screen, goalId=this.state.goalId, fundId=null, fromScreen="fund") => {
      const goBack = NavigationActions.back()
      const navigateToTransation = NavigationActions.navigate({
        routeName: "transaction",
        params: {
          transactionType: screen,
          fundId: fundId,
					goalId: goalId
        }
			})
			const navigateToNewGoal = NavigationActions.navigate({
				routeName: "newGoal",
				params: {
					fundId: fundId,
					screen: fromScreen
				}
			})
			const navigateToGoalSelect = NavigationActions.navigate({
				routeName: "selectGoal",
				params: {
					fundId: fundId,
					screen: fromScreen
				}
			})
      const navigateToFund = NavigationActions.navigate({
        routeName: "fund",
        params: {
          fundId: fundId
        }
      })

      if (screen == 'purchase') {
				//  Check if there is any existing goal
				console.log(goalId, screen)
				if (goalId == null) {
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

			if (screen == 'newGoal') {
				this.props.navigation.dispatch(navigateToNewGoal)
			}
    if (screen == 'fund') {
      this.props.navigation.dispatch(navigateToFund)
    }

      if (screen == 'back') {
        this.props.navigation.dispatch(goBack)
      }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.toScreen == "back") {
            this.navigate("back")
        } else if (nextProps.fromScreen == "fund") {
            if (nextProps.toScreen == "purchase") {
                this.navigate("purchase", this.state.fundId, nextProps.newGoal)
            }
            if (nextProps.toScreen == "newGoal") {
                this.navigate('newGoal', this.state.fundId)
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.screen != "stay") {
                this.props.initialize()
            }
    }

    render() {
      var recommendations = [];
      
			for (var j = 0; j < this.props.funds.length; j++) {
                if (this.props.funds[j].id === this.state.fundId) {
                    var fund = this.props.funds[j]
                    break
                }
            }
            
			var id = fund.id
			var name = fund.name
			var growth = fund.annualReturns
			var recommendation = fund.recommendation
			var expenseRation = fund.expenseRation
			var fundPurchaseValue = fund.price
			var purchaseMultiple = fund.purchaseMultiple
      var values = fund.values

			if (fundPurchaseValue != purchaseMultiple) {
				for (let goal of this.props.goals) {
					for (let fund of goal.funds) {
						if (fund.id == this.state.fundId) {
							fundPurchaseValue = purchaseMultiple
							break
						}
					}
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
      
      var ctaText = "BUY FOR ₹" + fundPurchaseValue
            
      return (
        <View style={{flex: 1, alignItems: 'stretch' }}>
          <View style={{flexDirection: 'row', marginTop:25}}>
            <Ionicons name="ios-arrow-back" size={40} color="#0e7afe" style={{alignSelf: "center", marginLeft:10}}/>
            <TouchableWithoutFeedback onPress = {() => this.navigate('back')}>
              <View style={{alignSelf: "center"}}>
                <Text style={{color: "#0e7afe", fontSize: 22, marginLeft:5, marginBottom: 3}}>Back</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View><Text numberOfLines={2} style={styles.heading}>{name}</Text></View>
          <View style={styles.midHorizon}></View>
          <ScrollView>
            <LinearGradient
                colors={['#41e2f4', '#bb41f4']}
                style={{alignItems: 'center', 
                  justifyContent: 'center', 
                  height: Dimensions.get('window').height*graphComponentHeight,
                  width: Dimensions.get('window').width*graphPortion, 
                  alignSelf: "center", 
                  borderRadius: 2,
                  shadowOffset:{width: 0.6, height: 0.6},
                  shadowColor: 'black', shadowOpacity: 0.6,
                  marginTop: 10
                }}>
                  <View style={styles.graph}>
                    <Text style={styles.goalValue}>₹ 245.67</Text>
                    <Line 
                      values={values}
                      fillColor='rgba(255, 255, 255, 0)'
                      strokeColor="white"
                      strokeWidth={3} />
                    <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                        <Text style={styles.duration}>6M</Text>
                        <Text style={styles.selectedDuration}>1Y</Text>
                        <Text style={styles.duration}>3Y</Text>
                        <Text style={styles.duration}>5Y</Text>
                    </View>
                  </View>
              </LinearGradient>
              <Explainer 
                heading="Returns" 
                explainer="45% in 1 year."/>
              <Explainer 
                heading="Expense Ratio" 
                explainer="1.1%"
                explainTerm="EXPENSE_RATIO"
                />
              <Text style={{marginLeft:15, fontSize:20, fontWeight: "bold", marginTop: 25}}>
                Similar to this fund
              </Text>
              <ScrollView 
                style={{marginBottom:15}} 
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // pagingEnabled={true}
              >
                <View style={{flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20}}>
                  {recommendations}
                </View>
              </ScrollView>
            </ScrollView>
            <ScreenCoreCTAButton 
              navigate={this.navigate} 
              ctaText={ctaText} 
              screen="purchase" 
              fundId={id}
              goalId={this.state.goalId} />
        </View>
      )
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
    initialize: () => dispatch(initialize()),
});

const FundScreeen = connect(mapStateToProps, mapDispatchToProps)(FundScreenView);

export default FundScreeen;


const styles = StyleSheet.create({
    heading: {
      fontSize: 30,
      fontWeight: 'bold',
      marginLeft: 15
    },
    explainerHeading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 15,
    },
    explainerText: {
      fontSize: 17,
      marginLeft: 15,
      marginRight: 15,
      marginTop: 10,
      color: "#5c5e5e",
      fontWeight: "600"
    },
    explainTerm: {
      fontSize: 14,
      marginLeft: 15,
      marginRight: 15,
      marginTop: 10,
      color: "#5c5e5e",
      fontStyle: "italic"
    },
    midHorizon: {
      borderBottomColor: '#b3b3cc',
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginLeft: 15,
      marginRight: 15
    },
    explainerMidHorizon: {
      borderBottomColor: '#b3b3cc',
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginLeft: 15,
      marginRight: 15,
      marginTop: 20
    },
    duration: {
      color: "white", 
      fontSize: 15
    },
    selectedDuration: {
      color: "white", 
      fontSize: 15, 
      borderWidth: 1, 
      borderColor: 'white', 
      borderRadius: 3,
      padding: 3
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