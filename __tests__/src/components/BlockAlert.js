import React from 'react';
import {View, Text} from 'react-native';
import getColor from '../color';

export default function BlockAlert({style, textStyle, children}) {
  const color = getColor();
  return (
    <View style={[{backgroundColor: color['red-0'], padding: 12}, style]}>
      <Text
        style={[
          {fontSize: 16, color: color['white-0'], fontFamily: 'Roboto-Regular'},
          textStyle,
        ]}>
        {children}
      </Text>
    </View>
  );
}
