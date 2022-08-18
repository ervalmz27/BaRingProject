import React, {Fragment} from 'react';
import {Text, View, Image} from 'react-native';
import NumberFormat from 'react-number-format';
import getColor from '../color';
import {baseURL} from '../config';
import moment from 'moment';
import 'moment/locale/id';
import BlockButton from './BlockButton';
import {useNavigation} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function HistoryList({items = [{}], date, id, isPaid = false}) {
  const navigation = useNavigation();
  const color = getColor();
  React.useEffect(() => {
    console.log(
      moment(date).toDate() >= moment().subtract(2, 'days').toDate()
        ? 'true'
        : 'false',
    );
  }, []);
  return (
    <View
      style={{
        backgroundColor: color['white-0'],
        padding: 16,
        paddingHorizontal: 21,
        marginBottom: 12,
      }}>
      {date ? (
        <Text style={{fontFamily: 'Roboto-Regular', color: color['black-0']}}>
          {moment(date).locale('id').format('DD MMM YYYY, HH:mm')}
        </Text>
      ) : (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item width="45%" height={16} borderRadius={6} />
        </SkeletonPlaceholder>
      )}
      {items.map(({title, price, qty, product, course}, index) => (
        <View
          key={`${index}`}
          style={{
            padding: 12,
            marginTop: 16,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: color['white-3'],
          }}>
          {date ? (
            <Image
              source={{uri: baseURL + (product || course)?.cover}}
              resizeMode="cover"
              style={{width: 64, height: 64, marginRight: 16}}
            />
          ) : (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                width={64}
                height={64}
                marginRight={16}
              />
            </SkeletonPlaceholder>
          )}
          <View style={{flex: 1}}>
            {date ? (
              <Fragment>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: 'Roboto-Bold',
                    fontSize: 16,
                    color: color['black-0'],
                  }}>
                  {title}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <NumberFormat
                    displayType="text"
                    thousandSeparator={true}
                    prefix="Rp"
                    value={price}
                    renderText={text => (
                      <Text
                        style={{
                          color: color['black-1'],
                          flex: 1,
                          fontFamily: 'Roboto-Regular',
                        }}>
                        {text}
                      </Text>
                    )}
                  />
                  <Text
                    style={{
                      color: color['black-1'],
                      fontFamily: 'Roboto-Regular',
                    }}>
                    x{qty}
                  </Text>
                </View>
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
                  marginTop={6}
                />
              </SkeletonPlaceholder>
            )}
          </View>
        </View>
      ))}
      {date &&
      moment(date).toDate() >= moment().subtract(2, 'days').toDate() &&
      !isPaid ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 12,
          }}>
          <BlockButton
            style={{height: 38, paddingHorizontal: 20}}
            onPress={() => navigation.navigate('payment', {id})}>
            Bayar
          </BlockButton>
        </View>
      ) : null}
    </View>
  );
}
