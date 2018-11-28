import React from 'react';
import { StyleSheet, View , FlatList, TouchableOpacity } from 'react-native';
import { AsyncStorage, Alert } from "react-native"
import TimerCountdown from 'react-native-timer-countdown';

import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Badge, Left, Body, Right, Title } from 'native-base';
import List_ from './List';
import Map from './Map';
import Cam from './Camera';
import Card from './Card';
export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isReady: false,
      status: 1,
      todos: [],
      cont_queues: 0
    }

    this.handleLoad = this.handleLoad.bind(this);
    this.handleViewMaps = this.handleViewMaps.bind(this);
    this.handleViewCamera = this.handleViewCamera.bind(this);
    this.handleViewQueues = this.handleViewQueues.bind(this);
    this.handlePushChanges = this.handlePushChanges.bind(this);
    this.handleOnCall = this.handleOnCall.bind(this);
  }
  componentDidMount(){
    this.handleLoad();
  }
  handleOnCall(nom){
    Alert.alert(
      'Tu turno!!',
      'Ha llegado tu turno en la fila ' + nom,
      [
        {text: 'OK', onPress: () => console.log('Cancel Pressed')},
      ]
    )
  }
  handleLoad(){
    AsyncStorage.getItem('todos', (err, result) => {
      if(result){
        let aux = JSON.parse(result);
        this.setState({
          todos: aux,
          cont_queues: Object.keys(aux).length
        })

      }
    });
  }
  handlePushChanges(){
    this.setState({
      status: 1
    })
    this.handleLoad();
  }

  handleViewQueues(){
    console.log('Me apretaron')
    this.setState({
      status: 1
    })
  }
  handleViewMaps(){
    this.setState({
      status: 2
    })
  }
  handleViewCamera(){
    this.setState({
      status: 3
    })
  }

  async componentWillMount() {
  this.setState({isReady:true})
}

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }

    if(this.state.status === 1){
      return (
        <Container style={styles.container}>
              <Header >
                <Left/>
                  <Body>
                    <Title>SmartQueue</Title>
                  </Body>
                <Right />
              </Header>
              <FlatList
                data={this.state.todos}
                renderItem={({ item }) => (
                  <Card
                    name={item.name}
                    pos={item.pos}
                    time={item.time}
                    address={item.address}
                    id_queue={item.id_queue}
                    onCall={this.handleOnCall}
                    id_pos={item.id_pos}
                    onPushChanges={this.handlePushChanges}
                  />
                )}
              />
            <Footer style={{ backgroundColor: '#000', opacity: 0.8}}>
              <FooterTab>
                <Button  vertical onPress={this.handleViewMaps}>
                  <Icon active name="map" />
                  <Text>Mapas</Text>
                </Button>
                <Button vertical onPress={this.handleViewCamera}>
                  <Icon name="camera" />
                  <Text>Qr</Text>
                </Button>
                <Button active badge vertical onPress={this.handleViewQueues}>
                  <Badge><Text>{this.state.cont_queues}</Text></Badge>
                  <Icon name="person" />
                  <Text>Queues</Text>
                </Button>
              </FooterTab>
            </Footer>
          </Container>
      );
    } //list
    if(this.state.status === 2){
      return(
      <Container>
            <Header brandDark>
              <Left/>
                <Body>
                  <Title>SmartQueue</Title>
                </Body>
              <Right />
            </Header>
          <Map />
          <Footer brandDark>
            <FooterTab>
              <Button vertical active onPress={this.handleViewMaps}>
                <Icon active name="map" />
                <Text>Mapas</Text>
              </Button>
              <Button vertical onPress={this.handleViewCamera}>
                <Icon name="camera" />
                <Text>Qr</Text>
              </Button>
              <Button  badge vertical onPress={this.handleViewQueues}>
                <Badge><Text>{this.state.cont_queues}</Text></Badge>
                <Icon name="person" />
                <Text>Queues</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      )
    } //map
    if(this.state.status === 3){
      return(
      <Container>
          <Header brandDark>
              <Left/>
                <Body>
                  <Title>SmartQueue</Title>
                </Body>
              <Right />
          </Header>
          <Cam onPushChanges={this.handlePushChanges}/>
          <Footer brandDark>
            <FooterTab>
              <Button vertical onPress={this.handleViewMaps}>
                <Icon active name="map" />
                <Text>Mapas</Text>
              </Button>
              <Button vertical active onPress={this.handleViewCamera}>
                <Icon name="camera" />
                <Text>Qr</Text>
              </Button>
              <Button badge vertical onPress={this.handleViewQueues}>
                <Badge><Text>{this.state.cont_queues}</Text></Badge>
                <Icon name="person" />
                <Text>Queues</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      )
    } //camera
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3F3631'
  }
})
