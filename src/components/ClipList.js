import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import getColor from '../color';

export default function ClipList({body, content, bab, id}) {
  const color = getColor();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('clipperDetail', {
          text: body,
          id,
        })
      }
      style={{
        padding: 16,
        paddingVertical: 21,
        borderBottomWidth: 1,
        borderColor: color['white-3'],
        backgroundColor: color['white-0'],
      }}>
      <Text
        style={{
          fontFamily: 'Roboto-Regular',
          color: color['black-0'],
          lineHeight: 24,
          fontSize: 16,
        }}
        numberOfLines={2}>
        {body}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginTop: 20,
        }}>
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            color: color['black-0'],
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: color['primary-0'],
            backgroundColor: color['white-1'],
            marginRight: 12,
            maxWidth: '40%',
          }}
          numberOfLines={1}>
          {content}
        </Text>
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            color: color['black-0'],
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: color['primary-0'],
            backgroundColor: color['white-1'],
            maxWidth: '40%',
          }}
          numberOfLines={1}>
          {bab}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
