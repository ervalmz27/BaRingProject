import React, {Fragment} from 'react';
import {Text, View} from 'react-native';
import getColor from '../color';
import Star from './Star';
import moment from 'moment';
import 'moment/locale/id';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function ReviewList({name, date, star, body}) {
  const color = getColor();
  return (
    <View
      style={{
        backgroundColor: color['white-0'],
        paddingHorizontal: 21,
        paddingBottom: 12,
      }}>
      <View style={{borderWidth: 1, borderColor: color['white-3']}}>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: color['white-3'],
            padding: 12,
          }}>
          {name ? (
            <Fragment>
              <Text
                style={{fontFamily: 'Roboto-Bold', color: color['black-0']}}>
                {name}
              </Text>
              <Text
                style={{fontFamily: 'Roboto-Regular', color: color['black-0']}}>
                {moment(date).locale('id').format('dddd, D MMM YYYY')}
              </Text>
            </Fragment>
          ) : (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                width="60%"
                height={16}
                borderRadius={6}
              />
              <SkeletonPlaceholder.Item
                width="40%"
                height={16}
                borderRadius={6}
                marginTop={4}
              />
            </SkeletonPlaceholder>
          )}
        </View>
        <View style={{padding: 12}}>
          {name ? (
            <Fragment>
              <Star count={star} />
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: color['black-0'],
                  marginTop: 12,
                }}>
                {body}
              </Text>
            </Fragment>
          ) : (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                width="100%"
                height={16}
                borderRadius={6}
              />
              <SkeletonPlaceholder.Item
                width="100%"
                height={16}
                borderRadius={6}
                marginTop={4}
              />
              <SkeletonPlaceholder.Item
                width="50%"
                height={16}
                borderRadius={6}
                marginTop={4}
              />
            </SkeletonPlaceholder>
          )}
        </View>
      </View>
    </View>
  );
}
