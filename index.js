/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {AuthProvider} from './src/contexts/auth';
import TrackPlayer from 'react-native-track-player';
import messaging from '@react-native-firebase/messaging';

const AppContainer = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

messaging().setBackgroundMessageHandler(async remoteMessage => {});

AppRegistry.registerComponent(appName, () => AppContainer);

TrackPlayer.registerPlaybackService(() => require('./src/player-service'));
