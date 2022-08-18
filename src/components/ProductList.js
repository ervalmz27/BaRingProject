import React, {Fragment} from 'react';
import {Dimensions, Image, Text, TouchableOpacity} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NumberFormat from 'react-number-format';
import getColor from '../color';
import {baseURL} from '../config';

export default function ProductList({
  image,
  title,
  price,
  onPress,
  showPrice = true,
  access = false,
}) {
  const color = getColor();
  const dimension = Dimensions.get('screen');
  const width = (dimension.width - 21 * 2 - 12) / 2;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        margin: 6,
        backgroundColor: color['white-0'],
        width,
        borderRadius: 6,
        padding: 12,
        paddingBottom: 20,
      }}>
      {title ? (
        <Fragment>
          <Image
            source={{uri: baseURL + image}}
            style={{
              width: width - 24,
              height: width - 24,
              borderRadius: 6,
            }}
            resizeMode="cover"
          />
          <Text
            style={{
              lineHeight: 24,
              fontSize: 16,
              fontFamily: 'Gotham-Bold',
              color: color['black-0'],
              marginTop: 8,
            }}
            numberOfLines={2}>
            {title}
          </Text>
          {access ? (
            <Text
              style={{
                lineHeight: 22,
                fontFamily: 'Roboto-Regular',
                color: color['black-1'],
              }}>
              AKSES
            </Text>
          ) : title && showPrice ? (
            price ? (
              <NumberFormat
                displayType="text"
                value={price}
                thousandSeparator=","
                prefix="Rp"
                renderText={value => (
                  <Text
                    style={{
                      lineHeight: 22,
                      fontFamily: 'Roboto-Regular',
                      color: color['black-1'],
                    }}>
                    {value}
                  </Text>
                )}
              />
            ) : (
              <Text
                style={{
                  lineHeight: 22,
                  fontFamily: 'Roboto-Regular',
                  color: color['black-1'],
                }}>
                FREE
              </Text>
            )
          ) : null}
        </Fragment>
      ) : (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            width={width - 24}
            height={width - 24}
            borderRadius={6}
          />
          <SkeletonPlaceholder.Item
            height={16}
            width="100%"
            marginTop={8}
            borderRadius={6}
          />
          <SkeletonPlaceholder.Item
            height={14}
            width="50%"
            marginTop={6}
            borderRadius={6}
          />
        </SkeletonPlaceholder>
      )}
    </TouchableOpacity>
  );
}
