import React from 'react';
import Orientation from 'react-native-orientation';
import VideoPlayer from 'react-native-video-controls';

export default function Video({route, navigation}) {
  React.useEffect(() => {
    Orientation.lockToLandscape();
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  React.useEffect(() => {
    console.log(route.params.uri);
  }, [route]);
  return (
    <VideoPlayer
      source={{uri: route.params.uri}}
      onBack={() => {
        navigation.goBack();
      }}
    />
  );
}
