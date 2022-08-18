import React, {Fragment} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NumberFormat from 'react-number-format';
import getColor from '../color';

export default function PackageList({title, description, price, onPress}) {
  const color = getColor();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={title ? false : true}
      style={{
        backgroundColor: color['white-0'],
        marginHorizontal: 21,
        marginBottom: 16,
        borderRadius: 6,
        padding: 16,
      }}>
      {title ? (
        <Fragment>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 16,
              color: color['black-0'],
              fontWeight: 'bold',
            }}>
            {title}
          </Text>
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              color: color['black-1'],
              marginTop: 3,
            }}>
            {description}
          </Text>
          <NumberFormat
            thousandSeparator={true}
            prefix="Rp"
            value={price}
            displayType="text"
            renderText={text => (
              <Text
                style={{
                  borderTopWidth: 1,
                  borderTopColor: color['white-3'],
                  paddingTop: 16,
                  marginTop: 16,
                  textAlign: 'right',
                  color: color['black-0'],
                }}>
                {text}
              </Text>
            )}
          />
        </Fragment>
      ) : (
        <Fragment>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width="100%"
              height={16}
              borderRadius={8}
            />
            <SkeletonPlaceholder.Item
              width="60%"
              height={14}
              marginTop={6}
              borderRadius={8}
            />
          </SkeletonPlaceholder>
          <View
            style={{
              borderTopColor: color['white-3'],
              borderTopWidth: 1,
              paddingTop: 16,
              marginTop: 16,
            }}
          />
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width="30%"
              height={16}
              borderRadius={8}
              alignSelf="flex-end"
            />
          </SkeletonPlaceholder>
        </Fragment>
      )}
    </TouchableOpacity>
  );
}
