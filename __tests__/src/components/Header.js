import React from 'react';
import {View} from 'react-native';
import getColor from '../color';

export default function Header({children, style}) {
  const color = getColor();
  return (
    <View
      style={[
        {
          padding: 21,
          backgroundColor: color['primary-0'],
          position: 'relative',
        },
        style,
      ]}>
      {children}
    </View>
  );
}
