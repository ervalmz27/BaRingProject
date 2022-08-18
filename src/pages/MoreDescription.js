import React from 'react';
import {ScrollView, Text} from 'react-native';
import getColor from '../color';

export default function MoreDescription({route}) {
  const color = getColor();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: color['white-0'], flex: 1}}
      contentContainerStyle={{padding: 21}}>
      <Text
        style={{
          textAlign: 'justify',
          fontFamily: 'Roboto-Regular',
          lineHeight: 24,
        }}>
        {route.params.text}
      </Text>
    </ScrollView>
  );
}
