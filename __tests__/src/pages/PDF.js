import React from 'react';
import {Dimensions, View} from 'react-native';
import Pdf from 'react-native-pdf';

export default function PDF({route}) {
  return (
    <View style={{flex: 1}}>
      <Pdf
        source={{uri: route.params.uri, cache: true}}
        style={{
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
      />
    </View>
  );
}
