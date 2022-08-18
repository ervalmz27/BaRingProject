import React from 'react';
import {View, Text} from 'react-native';
import getColor from '../../color';

export default function Heading({title, subtitle}) {
  const color = getColor();
  return (
    <View
      style={{
        paddingHorizontal: 21,
        paddingVertical: 18,
        backgroundColor: color['primary-0'],
      }}>
      <Text
        style={{
          color: color['secondary-0'],
          fontSize: 24,
          fontFamily: 'Poppins-Bold',
        }}>
        {title}
      </Text>
      <Text
        style={{
          color: color['white-3'],
          fontFamily: 'Roboto-Regular',
          fontSize: 16,
          marginBottom: 28,
        }}>
        {subtitle}
      </Text>
    </View>
  );
}
