import React, { Component } from "react";
import { Text,
  TextInput, 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableWithoutFeedback,
  Dimensions,
  DatePickerIOS
   } from "react-native";
// import moment from 'moment';


export default class GoalManagementScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      DateText: '',
      DateHolder: null,
    }
  }

  DatePickerMainFunctionCall = () => {
    console.log("svsdvsdvsD");
    let DateHolder = this.state.DateHolder;
    if(!DateHolder || DateHolder == null){
      DateHolder = new Date();
      this.setState({
        DateHolder: DateHolder
      });
    }

    //To open the dialog
    this.onDatePickedFunction({
      date: DateHolder,
    });
  }

  onDatePickedFunction = (date) => {
    this.setState({
      DateText: date
    });
  }

  render() {
    return (
      <View>
        <TextInput
          style={styles.heading}
          placeholder="Goal Name"
          returnKeyType="next"
          onSubmitEditing={() => { this.secondTextInput.focus(); }}
          blurOnSubmit={false}
          // onChangeText={(searchKeyword) => this.setState({searchKeyword})}
          // value={this.state.searchKeyword}
        />  
        <TextInput 
          onFocus = {this.DatePickerMainFunctionCall.bind(this)}
          placeholder="Target Date"
          value={this.state.DateText}
        />
        <TextInput
          style={styles.heading}
          placeholder="Amount"
          returnKeyType="done"
          ref={(input) => { this.secondTextInput = input; }}
          // onChangeText={(searchKeyword) => this.setState({searchKeyword})}
          // value={this.state.searchKeyword}
        /> 
      </View>
    )
  }
}


const styles = StyleSheet.create({
    heading: {
      fontSize: 35,
      fontWeight: 'bold',
      height: Dimensions.get('window').height*0.1,
      marginTop: Dimensions.get('window').height*0.025,
      marginLeft: 15,
      color: '#3a3b3d'
    }
})