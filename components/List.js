import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Text, Image } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';

import Card_ from './Card'
export default class FlatListBasics extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: this.props.name,
      pos: this.props.pos,
      time: this.props.time,
      address: this.props.address,
      phrase: ''
    }

  }
  render() {

    if(1 != 1){
      var p = "Número: " + this.state.pos + " - Tiempo estimado espera: " + this.state.time
      return (
        <Card style={styles.bigblue}>
          <CardTitle
            title={this.state.name}
            subtitle={this.state.address}
          />
          <CardContent text={p}/>
          <CardAction
            separator={true}
            inColumn={false}>
            <CardButton
              onPress={() => {}}
              title="Salir"
              color="#FEB557"
            />
          </CardAction>
        </Card>
      )
    }else{
      return(
        <Card_/>
      )
    }
  }
}
const styles = StyleSheet.create({
  bigblue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
    backgroundColor: '#fff'
  },
  red: {
    color: 'red',
  },
});
// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => FlatListBasics);
