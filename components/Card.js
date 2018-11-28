import React from 'react';
import { StyleSheet, View , Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AsyncStorage } from "react-native"
import TimerMachine from 'react-timer-machine'
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import SocketIOClient from 'socket.io-client';
import axios from 'react-native-axios'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: this.props.name,
      pos: this.props.pos,
      time: this.props.time,
      address: this.props.address,
      phrase: '',
      id_queue: this.props.id_queue,
      id_pos: this.props.id_pos,
      pos_actual: ''
    }
    this.socket = SocketIOClient('http://186.64.120.140:3001');
    this.handleDestroy = this.handleDestroy.bind(this);
    this.handleCall = this.handleCall.bind(this);

    fetch('http://186.64.120.140:3001/run/queue/data_queue?id=' + this.state.id_queue)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
        this.setState({
            pos_actual: data[2]
        })
    });
  }
  handleDestroy(){
    AsyncStorage.getItem('todos', (err, result) => {
      if(result){
          let todos = JSON.parse(result)
          for(var i = 0; i < Object.keys(todos).length; i++){
            if(todos[i].id_pos === this.state.id_pos){
              delete todos[i];
              break;
            }
          }
          AsyncStorage.setItem('todos', JSON.stringify(todos), () => {
            this.props.onPushChanges;
          });
      }
    });
  }
  handleCall(nom){
    this.props.onCall(nom)
  }
  componentDidMount(){
    var channel = 'screen' + this.state.id_queue;
    this.socket.on(channel, (message) => {
      if(message != 'call'){
        if(message === this.state.pos){
          this.handleCall(this.state.name)
        }
        if(message > this.state.pos){
          this.handleDestroy()
        }
        this.setState({
          pos_actual: message
        })
      }

    });
  }
  alert_(){
    Alert.alert(
      'Salir',
      '¿Estás seguro de que deseas salir de la cola? Ésta acción es irreversible.',
      [
        {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Sí, salir', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }
  render(){
    return(

      <TouchableOpacity underlayColor="red" style={styles.content} onLongPress={this.alert_}>
        <Text style={styles.text_titulo}>{this.state.name}</Text>
        <Text style={styles.text_subtitulo}>{this.state.address}</Text>
        <Text style={styles.text_numero}>Tu número: {this.state.pos} / Número actual: {this.state.pos_actual} </Text>
        <Text style={styles.text_tiempo}>Tiempo estimado restante: {this.state.time}</Text>
      </TouchableOpacity>

    )
  }
}
  const styles = StyleSheet.create({
    content: {
      borderRadius: 10,
      borderColor: '#fff',
      marginTop: 10,
      backgroundColor: '#fff',
      marginLeft: 5,
      marginRight: 5,
      opacity: 0.8
    },
    text_titulo: {
      fontSize: 21,
      marginTop: 10,
      textAlign: 'center',
      //color: '#fff'
    },
    text_subtitulo: {
      textAlign: 'center',
      fontSize: 14,
      marginTop: 5,
      //color: '#fff'
    },
    text_numero: {
      textAlign: 'center',
      fontSize: 16,
      marginTop: 5,
      marginLeft: 10,
      //color: '#fff'
    },
    text_tiempo: {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 5,
      marginLeft: 10,
      marginBottom: 10,
      //color: '#fff'

    }
  });
