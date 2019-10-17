import * as React from 'react';
import { Text, View, StyleSheet, Image, WebView, NetInfo , Alert} from 'react-native';
import { Expo, SplashScreen,} from 'expo';



export default class Offline extends React.Component {

  state = {
    connect: false,
    url:"https://needshare.bubbleapps.io/version-test"
  };


  componentDidMount() {
      SplashScreen.hide();
  };


  render() {
    return (
          <View style={{display:'flex', height:50, alignItems:'center', justifyContent:'center', backgroundColor:'#b71010'}}>
              <Text style={{color:'#ffffff', fontSize:20}}>Offline</Text>
          </View>
    )

  }
}

const styles = StyleSheet.create({});