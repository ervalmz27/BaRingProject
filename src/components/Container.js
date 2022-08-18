import React from 'react';
import {View} from 'react-native';
import getColor from '../color';

export default function Container({children}) {
  const color = getColor();
  return (
    <View style={{flex: 1, backgroundColor: color['white-1']}}>{children}</View>
  );
}
