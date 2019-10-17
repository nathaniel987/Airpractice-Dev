import React from 'react';
import { StyleSheet, Text, View, StatusBar, NetInfo } from 'react-native';
import { SplashScreen } from 'expo';
import Constants from 'expo-constants';

// You can import from local files
import AssetExample from './components/AssetExample';
import Offline from './components/offline';
// or any pure javascript modules available in npm


export default class App extends React.Component {

   state = {
    connect: false
  };

  componentDidMount() {
    SplashScreen.preventAutoHide();
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  };

  handleConnectivityChange = isConnected => {
  this.setState({ connect:isConnected });
  console.log(isConnected)
  }

  render() {


    return (
        <View style={{flex:1,paddingTop: Constants.statusBarHeight,}}>
          <StatusBar barStyle={'dark-content'} backgroundColor={'#ffffff'}/>
           <AssetExample/>
          {this.state.connect != true && <Offline/>}
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ffffff',
    padding: 0,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
