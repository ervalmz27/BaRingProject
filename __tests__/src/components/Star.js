import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import getColor from '../color';

export default function Star({count = 0, onChange = () => {}}) {
  const color = getColor();
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onChange(1)}
        style={{
          width: 16,
          height: 16,
          borderWidth: 2,
          borderColor: count >= 1 ? color['secondary-0'] : color['black-2'],
          borderRadius: 16 / 2,
          marginRight: 12,
        }}
      />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onChange(2)}
        style={{
          width: 16,
          height: 16,
          borderWidth: 2,
          borderColor: count >= 2 ? color['secondary-0'] : color['black-2'],
          borderRadius: 16 / 2,
          marginRight: 12,
        }}
      />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onChange(3)}
        style={{
          width: 16,
          height: 16,
          borderWidth: 2,
          borderColor: count >= 3 ? color['secondary-0'] : color['black-2'],
          borderRadius: 16 / 2,
          marginRight: 12,
        }}
      />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onChange(4)}
        style={{
          width: 16,
          height: 16,
          borderWidth: 2,
          borderColor: count >= 4 ? color['secondary-0'] : color['black-2'],
          borderRadius: 16 / 2,
          marginRight: 12,
        }}
      />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onChange(5)}
        style={{
          width: 16,
          height: 16,
          borderWidth: 2,
          borderColor: count >= 5 ? color['secondary-0'] : color['black-2'],
          borderRadius: 16 / 2,
          marginRight: 12,
        }}
      />
    </View>
  );
}
