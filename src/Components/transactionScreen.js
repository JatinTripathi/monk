import React, { Component } from "react";
import { Text,
  TextInput, 
  View, 
  StyleSheet, 
  TouchableWithoutFeedback,
  KeyboardAvoidingView
   } from "react-native";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo';
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { purchaseNew, purchaseMore, purchaseComplete, 
    redeemCompletely, redeemPartially } from "../Actions/actionCreator";


class PurchaseView extends Component {
    constructor(props) {
        super(props);
        this.state = { value: null,
            fundId: this.props.fundId,
            goalId: this.props.goalId,
            goals: this.props.parentProps.goals,
            funds: this.props.parentProps.funds,
            purchaseMultiple: 0,
            fundPurchaseValue: 0
        };
    }

    purchaseComplete(value) {
        // Search for goal in props.goals
        let goal = this.state.goals.find(goal => {
            return goal.id == this.state.goalId
        })
          
        // Find fundId in goal.funds
        let fund = goal.funds.find(fund => {
            return fund.id == this.state.fundId
        })

        // Check if fund exist in goal
        if (((value - this.state.fundPurchaseValue) % this.state.purchaseMultiple) != 0) {
            this.refs.view.shake(800)
        } else if (fund == null) {
            this.props.parentProps.purchaseNew(this.state.goalId, this.state.fundId, value)
            this.props.parentProps.purchaseComplete()
            this.props.parentProps.navigation.goBack()
        } else {
            this.props.parentProps.purchaseMore(this.state.goalId, this.state.fundId, value)
            this.props.parentProps.purchaseComplete()
            this.props.parentProps.navigation.goBack()
        }
        
    }
    
    render() {
        var fundName = ''

        for (let fund of this.state.funds) {
            if (fund.id == this.state.fundId) {
                this.state.purchaseMultiple = fund.purchaseMultiple
                this.state.fundPurchaseValue = fund.price
                fundName = fund.name
                
                if (this.state.fundPurchaseValue == this.state.purchaseMultiple) {
                    break
                } else {
                    for (let goal of this.state.goals) {
                        for (let fund of goal.funds ) {
                            if (fund.id == this.state.fundId){
                                this.state.fundPurchaseValue = this.state.purchaseMultiple
                                break
                            }
                        }
                        if (this.state.fundPurchaseValue != fund.price) {
                            break
                        }
                    }
                }
            }
        }

        return (
            <View style={{flex: 1, justifyContent: 'space-around',}}>
                <KeyboardAvoidingView behavior="padding">
                    <Text numberOfLines={2} style={styles.fundName}>{fundName}</Text>
                    <TextInput
                        style={styles.additionalPurchaseForm}
                        placeholder="₹0.00"
                        onChangeText={(value) => this.setState({value})}
                        value={this.state.value}
                        keyboardType="numeric"
                        returnKeyType="done"
                        enablesReturnKeyAutomatically={true}
                    />
                    <Animatable.View ref="view">
                        <Text style={styles.extra}>Buy more in ₹{this.state.purchaseMultiple} multiple</Text>
                    </Animatable.View>
                    <Text style={styles.plus}>+</Text>
                    <Text style={styles.fundPrice}>₹{this.state.fundPurchaseValue}</Text>
                </KeyboardAvoidingView>
                <TouchableWithoutFeedback onPress = {() => this.purchaseComplete(Number(this.state.value) + Number(this.state.fundPurchaseValue))}>
                    <View  style={{alignItems: 'center'}}>
                        <Text style={styles.transactionButton}>Place ₹{Number(this.state.value) + Number(this.state.fundPurchaseValue)} order</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}


class RedemptionView extends Component {
    constructor(props) {
        super(props);
        this.state = { value: "",
            fundId: this.props.fundId,
            goalId: this.props.goalId,
            goals: this.props.parentProps.goals,
            funds: this.props.parentProps.funds
        };
    }

    redeem(value) {
        let goal = this.state.goals.find(goal => {
            return goal.id == this.state.goalId
        })

        let fund = goal.funds.find(fund => {
            return fund.id == this.state.fundId
        })

        if (value == fund.value) {
            this.props.parentProps.redeemCompletely(this.state.goalId, this.state.fundId, value)
            this.props.parentProps.navigation.goBack()
        } else if (value < fund.value) {
            this.props.parentProps.redeemPartially(this.state.goalId, this.state.fundId, value)
            this.props.parentProps.navigation.goBack()
        } else {
            this.refs.view.shake(800);
        }
    }

    getTransactionValue (value) {
        if (value.length == 0) {
            return "0"
        } else {
            return value
        }
    }

    render() {
        let goal = this.state.goals.find(goal => {
            return goal.id == this.state.goalId
        })

        let fund = goal.funds.find(fund => {
            return fund.id == this.state.fundId
        })

        let parentFund = this.state.funds.find(fund => {
            return fund.id == this.state.fundId
        })

        var investedSum = fund.value
        var fundName = parentFund.name

        return (
            <View style={{flex: 1, justifyContent: 'space-around',}}>
                <KeyboardAvoidingView behavior="padding">
                    <Text numberOfLines={2} style={styles.fundName}>{fundName}</Text>
                    <TextInput
                        style={styles.redemptionView}
                        onChangeText={(value) => this.setState({value})}
                        value={this.state.value}
                        keyboardType="numeric"
                        returnKeyType="done"
                        enablesReturnKeyAutomatically={true}
                        autoFocus={true}
                        placeholder="₹0.00"
                    />
                    <Animatable.View ref="view">
                        <Text style={styles.extra}>Total invested: ₹ {investedSum}</Text>
                    </Animatable.View>
                </KeyboardAvoidingView>
                <TouchableWithoutFeedback onPress = {() => this.redeem(this.state.value)}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.transactionButton}>
                            Redeem ₹{this.getTransactionValue(this.state.value)}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}


function ScreenSelector(props) {
    const screen = props.screen
    const fundId = props.fundId
    const goalId = props.goalId
    const parentProps = props.parentProps

    if (screen == "purchase") {
      return <PurchaseView parentProps={parentProps} fundId={fundId} goalId={goalId}/>;
    }
    if (screen == "redemption") {
        return <RedemptionView parentProps={parentProps} fundId={fundId} goalId={goalId}/>
    }
}


class TransactionScreenView extends Component {
    constructor(props) {
      super(props);
      this.state = { transactionType: this.props.navigation.state.params.transactionType,
            fundId: this.props.navigation.state.params.fundId,
            goalId: this.props.navigation.state.params.goalId
        };
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'space-around',}}>
                <ScreenSelector 
                    screen={this.state.transactionType} 
                    fundId={this.state.fundId} 
                    goalId={this.state.goalId}
                    parentProps={this.props}
                />
                <TouchableWithoutFeedback onPress = {() => this.props.navigation.goBack()}>
                    <View style={{alignSelf: "center"}}>
                        <Text style={{color: "#0e7afe", fontWeight: '200', fontSize: 25, marginBottom: 20, marginTop: -20}}>Cancel</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
  goals: state.StateReducer.goals,
  funds: state.StateReducer.funds,

});

const mapDispatchToProps = (dispatch) => ({
    purchaseNew: (goalId, fundId, value) => dispatch(purchaseNew(goalId, fundId, value)),
    purchaseMore: (goalId, fundId, value) => dispatch(purchaseMore(goalId, fundId, value)),
    purchaseComplete: () => dispatch(purchaseComplete()),
    redeemCompletely: (goalId, fundId, value) => dispatch(redeemCompletely(goalId, fundId, value)),
    redeemPartially: (goalId, fundId, value) => dispatch(redeemPartially(goalId, fundId, value))
});

const TransactionScreen = connect(mapStateToProps, mapDispatchToProps)(TransactionScreenView);

export default TransactionScreen;


const styles = StyleSheet.create({
    fundName: {
        fontSize: 40,
        fontWeight: '600',
        textAlign: 'center'
    },
    fundPrice: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 7, 
    },
    plus: {
        fontSize: 40,
        color: 'grey',
        textAlign: 'center'
    },
    additionalPurchaseForm: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        borderBottomColor: 'grey',
        borderRadius: 7,
        width: 200,
        alignSelf: 'center',
        marginTop: 40, 
    },
    redemptionView: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 40, 
        textAlign: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        borderBottomColor: 'grey',
        borderRadius: 7,
        width: 200,
        alignSelf: 'center'
    },
    extra: {
        fontSize: 15,
        marginTop: 7, 
        textAlign: 'center',
        color: 'grey'
    },
    transactionButton: {
        fontSize: 30,
        fontWeight: '200',
        textAlign: 'center',
        color: '#0e7afe',
        borderWidth: 2,
        borderColor: '#0e7afe',
        borderRadius: 7,
        padding: 12,
    }
});