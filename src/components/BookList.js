import React, {Fragment} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import getColor from '../color';
import {baseURL} from '../config';

export default function BookList({cover, title, ring, onPress}) {
  const color = getColor();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        marginHorizontal: 21,
        marginBottom: 16,
        padding: 16,
        backgroundColor: color['white-0'],
        flexDirection: 'row',
        borderRadius: 6,
      }}>
      {cover ? (
        <Image
          source={{uri: `${baseURL + cover}`}}
          style={{
            width: 80,
            height: 80,
            backgroundColor: '#AAA',
            borderRadius: 8,
          }}
        />
      ) : (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item width={80} height={80} borderRadius={8} />
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
                lineHeight: 22,
              }}
              numberOfLines={2}>
              {title}
            </Text>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                color: color['black-1'],
                fontSize: 14,
                lineHeight: 24,
              }}>
              {ring} Ring
            </Text>
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
  );
}
