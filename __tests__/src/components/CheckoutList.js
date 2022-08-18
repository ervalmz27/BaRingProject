import React from 'react';
import {Text, View, Image} from 'react-native';
import NumberFormat from 'react-number-format';
import getColor from '../color';
import {baseURL} from '../config';

export default function CheckoutList({title, price, qty, image}) {
  const color = getColor();
  return (
    <View
      style={{
        backgroundColor: color['white-0'],
        padding: 18,
        paddingHorizontal: 21,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: color['white-3'],
      }}>
      <Image
        source={{uri: baseURL + image}}
        resizeMode="cover"
        style={{width: 64, height: 64, marginRight: 16}}
      />
      <View style={{flex: 1}}>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'Roboto-Bold',
            fontSize: 16,
            color: color['black-0'],
          }}>
          {title}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <NumberFormat
            displayType="text"
            thousandSeparator={true}
            prefix="Rp"
            value={price}
            renderText={text => (
              <Text
                style={{
                  color: color['black-1'],
                  flex: 1,
                  fontFamily: 'Roboto-Regular',
                }}>
                {text}
              </Text>
            )}
          />
          <Text style={{color: color['black-1'], fontFamily: 'Roboto-Regular'}}>
            x{qty}
          </Text>
        </View>
      </View>
    </View>
  );
}
