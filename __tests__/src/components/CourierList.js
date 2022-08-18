import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NumberFormat from 'react-number-format';
import getColor from '../color';

export default function CourierList({
  name,
  code,
  selected,
  costs = [],
  value,
  onChangeCourier = () => {},
  onChangeService = () => {},
}) {
  const color = getColor();
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: color['white-4'],
        marginHorizontal: 21,
        marginBottom: 16,
      }}>
      {name ? (
        <TouchableOpacity
          onPress={() => onChangeCourier(code)}
          style={{
            borderBottomWidth: 1,
            borderColor: color['white-4'],
            padding: 12,
            marginBottom: -1,
          }}>
          <Text
            style={{
              fontFamily: 'Roboto-Bold',
              fontSize: 16,
              color: color['black-0'],
            }}>
            {name}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{padding: 12}}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width="100%"
              height={16}
              borderRadius={6}
            />
          </SkeletonPlaceholder>
        </View>
      )}
      {selected ? (
        <View style={{paddingBottom: 12}}>
          {costs.map((item, index) => (
            <TouchableOpacity
              key={`${index}`}
              onPress={() => {
                onChangeService(item.service, item.cost[0].value);
              }}
              style={{
                margin: 12,
                marginBottom: 0,
                padding: 12,
                borderWidth: 1,
                borderColor:
                  value === `${code} - ${item.service}`
                    ? color['secondary-0']
                    : color['white-4'],
                flexDirection: 'row',
              }}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Bold',
                    fontSize: 16,
                    color: color['black-0'],
                  }}>
                  {item.service}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    color: color['black-1'],
                  }}>
                  {item.cost[0].etd
                    ? item.cost[0].etd + ' Hari'
                    : 'Estimasi tidak tersedia'}
                </Text>
              </View>
              <NumberFormat
                displayType="text"
                thousandSeparator={true}
                prefix="Rp"
                value={item.cost[0].value}
                renderText={text => (
                  <Text
                    style={{
                      fontFamily: 'Roboto-Regular',
                      color: color['black-1'],
                    }}>
                    {text}
                  </Text>
                )}
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}
