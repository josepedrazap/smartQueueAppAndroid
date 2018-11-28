import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { AsyncStorage } from "react-native"

Mapbox.setAccessToken('sk.eyJ1Ijoiam9zZXBlZHJhemEiLCJhIjoiY2pvaG81ejBsMDBjeTNwbXIwdXBoNnU0byJ9.9ImY6ZqN2Ja_LIsrTdR9qA');

export default class App extends Component<{}> {
  constructor(props){
    super(props);
    this.state = {
      data : [],
      error: null,
      status: 0,
      cont_queues: 0,
      latitude: 0,
      longitude: 0,
      error: null
    }
  }
  componentDidMount() {
    AsyncStorage.getItem('todos', (err, result) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
      if(result){
        let aux = JSON.parse(result)
        this.setState({
          data: JSON.parse(result),
          cont_queues: Object.keys(aux).length,
          status: 1
        })
      }else{
        this.setState({
          status: 2
        })
      }

    });
  }

  renderAnnotation (i) {
    if(i == -1){
      const coordinate = [this.state.longitude, this.state.latitude];

      return (
        <Mapbox.PointAnnotation
          key='pointAnnotation_me'
          id='pointAnnotation_me'
          title="Tú"
          coordinate={coordinate}>
          <View style={styles.annotationContainer2}>
            <View style={styles.annotationFill2} />
          </View>
          <Mapbox.Callout title='Estás aquí!' />
        </Mapbox.PointAnnotation>
      );
    }else{
      const coordinate = [this.state.data[i].long, this.state.data[i].lat];
      var util = `pointAnnotation${i}`
      return (
        <Mapbox.PointAnnotation
          key={util}
          id={util}
          title={this.state.data[i].name}
          coordinate={coordinate}>
          <View style={styles.annotationContainer}>
            <View style={styles.annotationFill} />
          </View>
          <Mapbox.Callout title={this.state.data[i].name} />
        </Mapbox.PointAnnotation>
      );
    }
  }

  renderAnnotations () {
    const items = [];
    for (let i = 0; i < this.state.cont_queues; i++) {
      items.push(this.renderAnnotation(i));
    }
    items.push(this.renderAnnotation(-1));
    return items;
  }
  render() {
    if(this.state.status === 1){
      return (
        <View style={styles.container}>
          <Mapbox.MapView
              styleURL={Mapbox.StyleURL.Dark}
              zoomLevel={13}
              centerCoordinate={[this.state.longitude, this.state.latitude]}
              style={styles.container}>
              {this.renderAnnotations()}
          </Mapbox.MapView>
        </View>
      );
    }else{
      return(
        <View style={styles.container}>

        </View>
      )
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'orange',
    transform: [{ scale: 0.6 }],
  },
  annotationContainer2: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderRadius: 15,
  },
  annotationFill2: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    transform: [{ scale: 0.6 }],
  }
});
