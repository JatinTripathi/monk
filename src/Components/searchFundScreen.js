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
import {Ionicons} from "@expo/vector-icons";
import { connect } from "react-redux";
import FundListItem from "./fundListItem";
import constants from "../Constants"


class SearchFundView extends Component {
  constructor(props) {
    super(props);
    this.state = {searchKeyword: '',
      goalId: this.props.navigation.state.params.goalId,
      searchType: this.props.navigation.state.params.searchType
    };
  }

  navigate = (screen, goalId, fundId) => {
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

    if (screen == 'fund') {
      this.props.navigation.dispatch(navigateToFund)
    }
    if (screen == 'purchase') {
      this.props.navigation.dispatch(navigateToTransation)
    }
  }

  render() {
    var searchResult = [] 
    var resultList = [] 
    var createButton = ""
    
    if (this.state.searchType == constants.GOAL_SEARCH_TYPE) {
      if (this.state.searchKeyword.length == 0) {
        createButton = ""
      } else {
        createButton = "CREATE"
      }
    } else {
      createButton = "FILTER"
      resultList = this.props.funds.filter(fund => {
        if (this.state.searchKeyword.length == 0) {
          createButton = ""
          return this.props.recommendations.includes(fund.id)
        }
        createButton = "FILTER"
        return fund.name.toLowerCase().includes(this.state.searchKeyword.toLowerCase())
      })
    }

    for (var [i, fund] of resultList.entries()) {
      searchResult.push(
        <FundListItem 
          key={i} 
          navigate={this.navigate} 
          id={fund.id} 
          goalId={this.state.goalId}
          screen={"purchase"}/>        
      )
    }

    return (
      <View>
        <TextInput
          style={styles.heading}
          // autoFocus={true}
          placeholder="Type fund name..."
          returnKeyType="done"
          onChangeText={(searchKeyword) => this.setState({searchKeyword})}
          value={this.state.searchKeyword}
          />   
        <View style={{flexDirection: "row", height: Dimensions.get('window').height*0.05, justifyContent: 'space-between'}}>
          <Text></Text>
          <Text style={{marginRight: 15, fontSize: 20, fontWeight: '600', color:constants.BLUE_COLOR}}>
            {createButton}
          </Text>
        </View>
        <ScrollView style={{height: Dimensions.get('window').height*0.7, marginTop: 10}}>
          {searchResult}
        </ScrollView>
        <View style={styles.midHorizon}></View>
        <View style={{alignItems  : "center", height: Dimensions.get('window').height*0.125}}>
          <TouchableWithoutFeedback onPress = {() => this.props.navigation.goBack()}>
            <Ionicons 
            name="ios-close-circle-outline" 
            size={50} 
            color="#3a3b3d" 
            style={{alignSelf: 'center', marginTop: 5}}/>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  funds: state.StateReducer.funds,
  goals: state.StateReducer.goals,
  recommendations: state.StateReducer.recommendations,
});

const mapDispatchToProps = (dispatch) => ({});

const SearchFund = connect(mapStateToProps, mapDispatchToProps)(SearchFundView);

export default SearchFund


const styles = StyleSheet.create({
    heading: {
      fontSize: 35,
      fontWeight: 'bold',
      height: Dimensions.get('window').height*0.1,
      marginTop: Dimensions.get('window').height*0.025,
      marginLeft: 15,
      color: '#3a3b3d'
    },
    midHorizon: {
      borderBottomColor: '#b3b3cc',
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginLeft: 15,
      marginRight: 15
    },
})