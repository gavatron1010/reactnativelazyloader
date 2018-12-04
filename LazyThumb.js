import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

export class LazyThumb extends React.Component {

  constructor() {
    super();

    this.state = {
      render: false,
      loaded: false,
    }
  }

  componentWillMount() {
    this._mounted = true
  }

  componentWillUnmount() {
     this._mounted = false
  }

  componentDidMount() {
    var timeout = this.getRandomInt(1500)
    setTimeout(()=>{this.setState({render: true})}, timeout)
  }

  /* let's make the asynchronous loading more dramatic */
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  render() {
    if(!this._mounted) return

    return (
      <View style={{
        width: this.props.width,
        height: this.props.width,
        backgroundColor: '#222',
        marginRight: this.props.margin,
        marginBottom: this.props.margin,
      }}>

      {!this.state.loaded &&
        <View style={{height: this.props.width, justifyContent: 'center',}}>
          <ActivityIndicator size='small' color='#aaa' />
        </View>
      }

      {this.state.render &&
      <TouchableOpacity>
        <Image
          style={{width: this.props.width, height: this.props.width}}
          source={{uri: this.props.thumb}}
          onLoadEnd={()=>{
            this.setState({loaded: true,})
          }}
          />
      </TouchableOpacity>
      }

      </View>
    )

  }

}
