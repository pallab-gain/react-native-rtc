/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import {
   SafeAreaView,
   StyleSheet,
   useColorScheme,
   View,
   Button
 } from 'react-native';
 import { BenzingaListenerIntegration } from './listener'
 import {RTCView, registerGlobals } from 'react-native-webrtc';
 
 const sdkClient = new BenzingaListenerIntegration()
 const sdkCallback = (setRemoteStream) => ({
   onMediaOverride() {
     console.log('same listener is joined from another session')
   },
   onRemoteStream(e) {
     console.log('we got remote stream - -  > ', e)
     if(e) {
       setRemoteStream(e)
     }
   },
   onRTCStateChange(rtcState, channelId) {
     console.log('rtc state has changed', rtcState, channelId)
   },
   onTransportStateChange(transportState) {
     console.log('transport state has changed', transportState)
   },
   onPresenterStateChange(presenterState, channelId) {
     console.log('presenter state has changed', presenterState, channelId)
   },
 });
 
 const App = () => {
   const isDarkMode = useColorScheme() === 'dark';
   const [remoteStream, setRemoteStream] = React.useState();
 
   const initializeSDK = () => {
     registerGlobals()
     const onSuccess = () => console.log('SDK initialized')
     const onError = (e) => console.log('SDK initialization failed', e)
     sdkClient.initializeSDK('session', 'your-session-key', sdkCallback(setRemoteStream)).then(onSuccess).catch(onError)
   }
 
   const startListening = () => {
     const onSuccess = () => console.log('Start listening')
     const onError = (e) => console.log('Start listening failed', e)
     sdkClient
        .startListening(parseInt(1, 10), undefined)
        .then(onSuccess)
        .catch(onError)
   }
 
   const stopListening = () => {
     const onSuccess = () => console.log('Stop listening')
     const onError = (e) => console.log('Stop listening failed', e)
     sdkClient.stopListening(parseInt(1, 10)).then(onSuccess).catch(onError)
   }
 
   const getAvailableStream = () => {
     const onSuccess = (e) => {
       console.log('Available stream', e)
     }
     const onError = (e) => console.log('Available stream failed', e)
     sdkClient.getAvailableStreams().then(onSuccess).catch(onError)
   }
 
   const disposeSDK = () => {
     const onSuccess = () => console.log('SDK disposed')
     const onError = (e) => console.log('SDK disposed failed', e)
     const misc = () => {}
     sdkClient.dispose().then(onSuccess).catch(onError).finally(misc)
   }
 
   return (
     <SafeAreaView style={styles.container}>
       <View style={styles.rtcview}>
          {remoteStream && <RTCView style={styles.rtc} streamURL={remoteStream.toURL()} />}
        </View>
        <Button style={styles.buttons} title="Initialize SDK" onPress={initializeSDK} />
        <Button style={styles.buttons} title="Start Listening" onPress={startListening} />
        <Button style={styles.buttons} title="Stop Listening" onPress={stopListening} />
        <Button style={styles.buttons} title="Dispose SDK" onPress={disposeSDK} />
        <Button style={styles.buttons} title="Available Stream" onPress={getAvailableStream} />
 
     </SafeAreaView>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
     backgroundColor: '#313131',
     alignItems: 'center',
     height: '100%',
     display: 'flex',
     marginBottom: '1%'
   },
   text: {
     fontSize: 30,
   },
   buttons: {
     margin: '10'
   },
   rtcview: {
     justifyContent: 'center',
     alignItems: 'center',
     height: '10%',
     width: '80%',
     backgroundColor: 'black',
   }
 });
 
 export default App;