import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import getColor from '../color';

export default function BlockButton({children, style, textStyle, ...props}) {
  const color = getColor();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: color['secondary-0'],
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      {...props}>
      <Text
        style={[
          {
            color: color['black-0'],
            fontFamily: 'Poppins-Bold',
            fontSize: 16,
          },
          textStyle,
        ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
