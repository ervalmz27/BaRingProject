import React, {Fragment} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NumberFormat from 'react-number-format';
import Trash from '../assets/icons/Trash.svg';
import getColor from '../color';
import {baseURL} from '../config';

export default function CartDigiList({title, price, image, onDelete}) {
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
          onPress={onDelete}
          style={{
            height: 32,
            borderRadius: 4,
            backgroundColor: color['red-0'],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 4,
            flexDirection: 'row',
            paddingHorizontal: 12,
          }}>
          <Trash width={16} height={16} fill={color['white-0']} />
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              color: color['white-0'],
              marginLeft: 6,
            }}>
            Hapus
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
