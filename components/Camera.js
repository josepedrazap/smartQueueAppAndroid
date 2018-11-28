import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native';
import axios from 'react-native-axios'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { AsyncStorage } from "react-native"
import Camera from 'react-native-camera';

export default class BarcodeScan extends Component {

    constructor(props) {
        super(props);
        this.state = {
            qrcode: '',
            status: 1,
            data: [],
            todos: []
        }
    }
    onBarCodeRead = (e) => {

      if(this.state.status !== 2){
        this.setState({
          status: 2
        })
        axios.get('http://186.64.120.140:3001/run/queue/enqueue?id=' + e.data)
        .then((response) => {
          if(response.data === "NO"){
            this.setState({
              status: 1
            })
            return;
          }else{
            this.setState({
              data: response.data
            })
          let todos = [];
          AsyncStorage.getItem('todos', (err, result) => {
            if(result){
                todos = JSON.parse(result)
            }
            todos.push({
              name: response.data.nombre_queue,
              pos: response.data.numero,
              time: response.data.tiempo_estimado,
              address: response.data.direccion,
              lat: response.data.lat,
              long: response.data.long,
              id_queue: response.data.id_queue,
              id_pos: response.data.id_posicion
            })
            AsyncStorage.setItem('todos', JSON.stringify(todos), () => {
            });
          });

          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }

    render () {
          if(this.state.status === 1){
            return (
              <View  style={styles.container}>
                  <Camera
                      style={styles.preview}
                      onBarCodeRead={this.onBarCodeRead}
                      ref={cam => this.camera = cam}
                      aspect={Camera.constants.Aspect.fill}
                      >
                      </Camera>
              </View>
            )
          }else{
            var p = "Número: " + this.state.data.numero + " - Tiempo estimado espera: " + this.state.data.tiempo_estimado
            return(
              <View  style={styles.container}>
                  <Camera
                      style={styles.preview}
                      onBarCodeRead={this.onBarCodeRead}
                      ref={cam => this.camera = cam}
                      aspect={Camera.constants.Aspect.fill}
                      >
                        <Card style={styles.bigblue}>
                          <CardTitle
                            title={this.state.data.nombre_queue}
                            subtitle={this.state.data.direccion}
                          />
                          <CardContent text={p}/>
                          <CardAction
                            separator={true}
                            inColumn={false}>
                            <CardButton
                              onPress={this.props.onPushChanges}
                              title="Ok"
                              color="#FEB557"
                            />
                          </CardAction>
                        </Card>
                      </Camera>
              </View>
            )
          }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  bigblue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
    backgroundColor: '#fff'
  }
});
