import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import getColor from '../color';
import {baseURL} from '../config';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function RecommendationList({cover, title, onPress}) {
  const color = getColor();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        padding: 12,
        position: 'relative',
        height: 220,
        marginRight: 21,
        backgroundColor: color['white-0'],
        borderRadius: 6,
      }}>
      {/* <View
        style={{
          height: '50%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: color['white-0'],
          borderRadius: 8,
        }}
      /> */}
      {cover ? (
        <Image
          source={{uri: `${baseURL}${cover}`}}
          style={{
            backgroundColor: '#AAA',
            width: 144,
            height: 144,
            borderRadius: 6,
          }}
          resizeMode="cover"
        />
      ) : (
        <SkeletonPlaceholder speed={1500}>
          <SkeletonPlaceholder.Item
            backgroundColor="#AAA"
            width={144}
            height={144}
          />
        </SkeletonPlaceholder>
      )}
      {title ? (
        <Text
          style={{
            paddingVertical: 12,
            textAlign: 'left',
            fontFamily: 'Gotham-Bold',
            color: color['black-0'],
            width: 144,
            fontSize: 14,
            lineHeight: 22,
            flex: 1,
          }}
          numberOfLines={2}>
          {title}
        </Text>
      ) : (
        <View
          style={{
            padding: 12,
            height: 74,
            width: 144,
            flex: 1,
          }}>
          <SkeletonPlaceholder speed={1500}>
            <SkeletonPlaceholder.Item height={16} width="100%" />
            <SkeletonPlaceholder.Item height={16} marginTop={6} width="100%" />
          </SkeletonPlaceholder>
        </View>
      )}
    </TouchableOpacity>
  );
}
