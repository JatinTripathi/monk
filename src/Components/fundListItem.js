import React, { Component } from "react";
import { Text, 
  View, 
  StyleSheet, 
  TouchableWithoutFeedback,
  Dimensions
   } from "react-native";
import { connect } from "react-redux";
import { LinearGradient } from 'expo';
import Line from './chart';


var graphPortion = 0.35
var fundInfoPortion = 0.5


function TransactionType(props) {
    const screen = props.screen
    const id = props.id
    const goalId = props.goalId
    const price = props.price
    const parentProps = props.parentProps

    if (screen == "purchase") {
      return <TouchableWithoutFeedback onPress = {() => parentProps.navigate(screen, goalId, id)}>
        <View style={{marginTop:11,marginRight:15,alignSelf: "center",position: 'absolute',right: 10}}>
          <Text style={{color: "#0e7afe",fontWeight: '600',fontSize: 18}}>
          ₹ {price}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    }
    if (screen == "redemption") {
        return <TouchableWithoutFeedback onPress = {() => parentProps.navigate(screen, goalId, id)}>
          <View style={{marginTop:11,marginRight:15,alignSelf: "center",position: 'absolute',right: 10}}>
            <Text style={{color: "#0e7afe",fontWeight: '600',fontSize: 18}}>
            SELL
            </Text>
          </View>
        </TouchableWithoutFeedback>
    }
}


function AssetAccount(props) {
  var goalValue = 0
  
  const screen = props.screen
  const goal = props.goal
  const fundId = props.fundId
  
  if (screen == "redemption") {
    let fund = goal.funds.find(fund => {
        return fund.id == fundId
      })
    
    for (let fund of goal.funds) {
      goalValue += fund.value
    }
      
    var fundValue = fund.value
    var fundGrowth = fund.growth
    var goalShare = Math.round((fundValue / goalValue) * 100)

    return <View style={{marginRight: 10}}>
      <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 5}}>
        <Text style={{fontSize: 18, fontWeight: '600'}}>Fund Value: ₹ </Text>
        <Text style={{fontSize: 18, fontWeight: '600'}}>{fundValue}</Text>
        <Text style={{fontSize: 18}}> ({fundGrowth}%)</Text>
      </View>
      <Text style={{fontSize: 17, color: 'grey'}}>This fund constitute {goalShare}% of total goal value</Text>
    </View>
  }
  return <View/>
}


function Recommendation(props) {
  var recommendation = props.recommendation
  var recommendationColor = '#d19c19'

  if (recommendation == null) {
    return <View/>
  }
  return <Text style={{color: recommendationColor, fontSize: 15, 
  fontWeight: '800'}}>{recommendation}</Text>
}


class FundListItem extends Component {
  render() {
    
    let goal = this.props.goals.find(goal => {
      return goal.id == this.props.goalId
    })
        
    let fund = this.props.funds.find(fund => {
      return fund.id == this.props.id
    })
      
    var fundPurchaseValue = fund.price
    var purchaseMultiple = fund.purchaseMultiple

    if (fundPurchaseValue != purchaseMultiple) {
      for (let goal of this.props.goals) {
          for (let goalFund of goal.funds ) {
              if (goalFund.id == fund.id){
                  fundPurchaseValue = purchaseMultiple
                  break
              }
          }
          if (fundPurchaseValue != fund.price) {
              break
          }
      }
    }

    var name = fund.name
    var category = fund.category
    var recommendation = fund.recommendation
    var values = fund.values

    return (
      <View style={{marginLeft: 15, marginTop: 10}}>
        <TouchableWithoutFeedback onPress = {() => this.props.navigate("fund", this.props.goalId, this.props.id)}>
          <View style={{flexDirection: 'column'}}>
            <View style={{flexDirection: 'row'}}>
              <LinearGradient
              colors={['#41e2f4', '#bb41f4']}
              style={{ marginTop:5, alignItems: 'center', 
              justifyContent: 'center', borderRadius: 2
              }}>
                <View style={{height: Dimensions.get('window').width*graphPortion,
                              width: Dimensions.get('window').width*graphPortion}}>
                  <Line 
                    values={values}
                    fillColor='rgba(255, 255, 255, 0)'
                    strokeColor="#ffffff"
                    strokeWidth={2} />
                </View>
              </LinearGradient>
              <View style={{flexDirection: 'column', justifyContent: 'space-between',  marginLeft: 9, 
              // height: Dimensions.get('window').height*componentHeight,
              width: Dimensions.get('window').width*fundInfoPortion}}>
                <Text numberOfLines={2} style={styles.portfolio}>{name}</Text>
                <Recommendation recommendation={recommendation}/>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.category}>{category}</Text>
                  <TransactionType
                    screen={this.props.screen}
                    goalId={this.props.goalId}
                    id={this.props.id}
                    price={fundPurchaseValue}
                    parentProps = {this.props}
                  />
                </View>
              </View>
            </View>
            <AssetAccount screen={this.props.screen} goal={goal} fundId={fund.id}/>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}


const mapStateToProps = (state) => ({
  goals: state.StateReducer.goals,
  funds: state.StateReducer.funds
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FundListItem)


const styles = StyleSheet.create({
  category: {
  fontSize: 17,
  color: 'grey',
  fontWeight: '600',
  marginRight: 6
  },
  portfolio: {
  fontSize: 18,
  fontWeight: 'bold',
  }
});