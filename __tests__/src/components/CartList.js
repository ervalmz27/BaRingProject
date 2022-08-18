import React, {Fragment} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NumberFormat from 'react-number-format';
import getColor from '../color';
import Add from '../assets/icons/Add.svg';
import Minus from '../assets/icons/Minus.svg';
import Trash from '../assets/icons/Trash.svg';
import {baseURL} from '../config';

export default function CartList({
  title,
  price,
  qty,
  image,
  onDecrease,
  onIncrease,
  onDelete,
}) {
  const color = getColor();
  return (
    <View
      style={{
        marginHorizontal: 21,
        marginBottom: 16,
        borderRadius: 6,
        backgroundColor: color['white-0'],
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          padding: 16,
          flexDirection: 'row',
        }}>
        {title ? (
          <Image
            source={{uri: baseURL + image}}
            style={{
              width: 50,
              height: 50,
              backgroundColor: '#AAA',
              borderRadius: 8,
            }}
          />
        ) : (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item width={50} height={50} borderRadius={8} />
          </SkeletonPlaceholder>
        )}
        <View style={{marginLeft: 16, flex: 1}}>
          {title ? (
            <Fragment>
              <Text
                style={{
                  fontFamily: 'Gotham-Bold',
                  fontSize: 16,
                  color: color['black-0'],
                }}
                numberOfLines={1}>
                {title}
              </Text>
              <NumberFormat
                value={price}
                thousandSeparator=","
                prefix="Rp"
                displayType="text"
                renderText={value => (
                  <Text
                    style={{
                      fontFamily: 'Roboto-Regular',
                      color: color['black-1'],
                      fontSize: 14,
                      lineHeight: 24,
                    }}>
                    {value}
                  </Text>
                )}
              />
            </Fragment>
          ) : (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                height={16}
                width="100%"
                borderRadius={6}
              />
              <SkeletonPlaceholder.Item
                height={14}
                width="50%"
                borderRadius={6}
                marginTop={10}
              />
            </SkeletonPlaceholder>
          )}
        </View>
      </TouchableOpacity>
      <View
        style={{
          padding: 16,
          flexDirection: 'row',
          borderTopWidth: 1,
          borderColor: color['white-3'],
        }}>
        <TouchableOpacity
          onPress={onDecrease}
          style={{
            width: 32,
            height: 32,
            borderRadius: 4,
            backgroundColor: color['black-0'],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 4,
          }}>
          <Minus width={10} height={10} fill={color['white-0']} />
        </TouchableOpacity>
        <Text
          style={{
            width: 60,
            height: 32,
            borderRadius: 4,
            color: color['black-0'],
            borderWidth: 1,
            borderColor: color['white-4'],
            textAlign: 'center',
            textAlignVertical: 'center',
            marginRight: 4,
          }}>
          {qty}
        </Text>
        <TouchableOpacity
          onPress={onIncrease}
          style={{
            width: 32,
            height: 32,
            borderRadius: 4,
            backgroundColor: color['black-0'],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 4,
          }}>
          <Add width={10} height={10} fill={color['white-0']} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          style={{
            width: 32,
            height: 32,
            borderRadius: 4,
            backgroundColor: color['red-0'],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 4,
          }}>
          <Trash width={16} height={16} fill={color['white-0']} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
