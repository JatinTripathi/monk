import React, { Component } from 'react';
import { Provider } from 'react-redux'
import store from './src/Store'
import NavigationStack from './src/Navigation'


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigationStack />
      </Provider>
    );
  }
}
