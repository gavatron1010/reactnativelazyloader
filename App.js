import React, { Component } from 'react';
import { View } from 'react-native';
import { LazyLoader } from './LazyLoader';

export default class App extends Component<Props> {

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'black',
        paddingTop: 40,
      }}>
        <LazyLoader />
      </View>
    )
  }

}
