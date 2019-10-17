import * as React from 'react';
import { Text, View, StyleSheet, Image, WebView, NetInfo , Alert, Platform} from 'react-native';
import {Expo, SplashScreen, Notifications} from 'expo';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';
import ShortcutBadge from 'react-native-shortcut-badge';

async function register(){
  const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS)
  const token = await Notifications.getExpoPushTokenAsync();
  console.log(status,token)
  }





export default class AssetExample extends React.Component {

setBadgeNumber = async (number) => {
  const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS)

  Notifications.setBadgeNumberAsync(number);

  if (Platform.OS === 'android') {

    await Notifications.presentLocalNotificationAsync({
      title: 'Upstarters',
      body: 'Badge is set',
      android: {
        channelId: 'badge_notification',
      }
    });
    let num = parseInt(number);
    if (num > 0)
      ShortcutBadge.setCount(num);
    else {

      ShortcutBadge.setCount(0);
      Notifications.dismissAllNotificationsAsync();
    }
  }
};

checkPush = async () => {
  const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS)


  const token = await Notifications.getExpoPushTokenAsync();
  this.webView.postMessage('PUSH'+token);
  console.log(token)
};


checkCamera = async (identifier) => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
     if (status !== 'granted') {
      alert('Hey! You have not enabled selected permissions');
      }
     else  {
      let result = await ImagePicker.launchImageLibraryAsync({allowsEditing: true, base64: true,});
      let obj = {
        event: 'image',
        elementid: identifier,
        photo: result
      };
      let message = JSON.stringify(obj);
      this.webView.postMessage(message);
      this.logToBubble(identifier, message);
  }
};

checkContacts = async () => {
  const {status} = await Permissions.askAsync(Permissions.CONTACTS)
  if (status !== 'granted') {
    alert('Hey! You have not enabled selected permissions');
  }
  else  {
    let result = await Contacts.getContactsAsync();
    let sendstring = JSON.stringify(result)
    this.webView.postMessage(result)
  }
};
sendSMS = async (phonenumber) => {
  const status = await SMS.isAvailableAsync();
  console.log(phonenumber);
  if (status !== true) {
    alert('Woah... NO SMS features available');
  }
  else  {
    let obj = JSON.parse(phonenumber);
    SMS.sendSMSAsync(obj.number,obj.message);
  }
};
logToBubble = async (elementid, message) => {

  let obj = {
    event: 'debug',
    elementid: elementid,
    log: {}
  };

  //Get Date/Time
  let d = new Date();
  obj.log.event = d.toISOString();
  obj.log.msg = message;

  let m = JSON.stringify(obj);
  this.webView.postMessage(m);
};

  state = {
    connect: false,
    url:"https://airpractice.co/version-test/mobile"
  };
  handleLoadEnd = () => {
    SplashScreen.hide();

  };

  handleMessage = (data) => {
    let message = data.nativeEvent.data;
    if(message === "Alert"){
      Alert.alert("New Alert","This is Nice")
    }
    else if(message.includes("Photos_")){
       this.checkCamera(message);
    }
    else if(message === "Contacts"){
       this.checkContacts();
    }
    else if(message === "Push"){
       this.checkPush();
    }
    else if(message.substring(0,3) === "SMS"){
       this.sendSMS(message.substring(3));
    }
    else if(message.startsWith("SetBadgeNumber")){
       this.setBadgeNumber(message.substring(15, message.length));
    }
  };

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({connect: isConnected});
    })

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('expo_push', {
        name: 'Expo Push',
        priority: 'max',
        badge: false,
        sound: true
      });


      Notifications.createChannelAndroidAsync('badge_notification', {
        name: 'Badge Notification',
        priority: 'min',
        badge: true,
      });
    }
  };


  render() {
    return (

      <WebView
        source={{
          uri: this.state.url,
        }}
        onLoadEnd={this.handleLoadEnd}
        useWebKit={true}
        onMessage={this.handleMessage}
        ref={(view) => this.webView = view}
      />
          )

  }
}

const styles = StyleSheet.create({});