import React from 'react';
import {Text} from 'react-native';
import getColor from '../color';

export default function SectionTitle({children, onPress, style}) {
  const color = getColor();
  return (
    <Text
    onPress={onPress}
      style={[
        {
          paddingHorizontal: 21,
          paddingTop: 22,
          paddingBottom: 12,
          color: color['black-0'],
          fontSize: 18,
          fontFamily: 'Poppins-Bold',
        },
        style,
      ]}>
      {children}
    </Text>
  );
}
