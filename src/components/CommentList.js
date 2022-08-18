import {useNavigation} from '@react-navigation/native';
import React, {Fragment} from 'react';
import {Text, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import getColor from '../color';

export default function CommentList({
  name,
  body,
  replies,
  id,
  showButton = true,
}) {
  const color = getColor();
  const navigation = useNavigation();
  return (
    <View
      style={{
        backgroundColor: color['white-0'],
        marginBottom: 12,
        padding: 16,
      }}>
      {name ? (
        <Fragment>
          <Text
            style={{
              fontFamily: 'Roboto-Bold',
              fontSize: 16,
              color: color['black-0'],
            }}>
            {name}
          </Text>
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              color: color['black-1'],
              fontSize: 16,
              marginTop: 4,
            }}>
            {body}
          </Text>
          {showButton ? (
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <Text
                onPress={() => {
                  navigation.navigate('reply', {id, name, body});
                }}
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: color['primary-0'],
                  fontSize: 16,
                  paddingHorizontal: 16,
                  marginLeft: -16,
                }}>
                {replies ? `${replies} Balasan` : 'Balas'}
              </Text>
            </View>
          ) : null}
        </Fragment>
      ) : (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item width="40%" height={16} borderRadius={6} />
          <SkeletonPlaceholder.Item
            width="100%"
            height={16}
            borderRadius={6}
            marginTop={6}
          />
          <SkeletonPlaceholder.Item
            width="60%"
            height={16}
            borderRadius={6}
            marginTop={6}
          />
        </SkeletonPlaceholder>
      )}
    </View>
  );
}
