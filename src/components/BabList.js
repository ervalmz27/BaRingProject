import React, {Fragment} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import getColor from '../color';

export default function BabList({title, ring, onPress}) {
  const color = getColor();
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={{
        marginHorizontal: 21,
        marginBottom: 12,
        padding: 16,
        paddingVertical: 20,
        backgroundColor: color['white-0'],
        borderRadius: 6,
      }}>
      {title ? (
        <Fragment>
          <Text style={{color: color['black-1'], fontFamily: 'Roboto-Regular'}}>
            Ring {ring}
          </Text>
          <Text
            style={{
              color: color['black-0'],
              fontFamily: 'Poppins-Bold',
              lineHeight: 22,
              marginTop: 4,
            }}>
            {title}
          </Text>
        </Fragment>
      ) : (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item height={14} width="30%" borderRadius={6} />
          <SkeletonPlaceholder.Item
            height={14}
            width="100%"
            marginTop={12}
            borderRadius={6}
          />
        </SkeletonPlaceholder>
      )}
    </TouchableOpacity>
  );
}
