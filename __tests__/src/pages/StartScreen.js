import React from 'react';
import {StatusBar, View, Text, TouchableOpacity} from 'react-native';
import getColor from '../color';
import Starter from '../assets/icons/Starter.svg';
import RightArrow from '../assets/icons/RightArrow.svg';

export default function StartScreen({navigation}) {
  const color = getColor();
  return (
    <React.Fragment>
      <StatusBar backgroundColor={color['white-1']} barStyle="dark-content" />
      <View style={{flex: 1}}>
        <View
          style={{
            backgroundColor: color['white-1'],
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Starter width="70%" />
        </View>
        <View
          style={{
            backgroundColor: color['primary-0'],
            paddingTop: 28,
            paddingBottom: 32,
            paddingHorizontal: 21,
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 24,
              color: color['secondary-0'],
              marginBottom: 5,
            }}>
            Selamat Datang
          </Text>
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              fontSize: 16,
              color: color['white-3'],
              lineHeight: 24,
            }}>
            Baring.Digital menghadirkan ringkasan buku-buku impor bisnis dan
            pengembangan diri untuk membawa ide-ide dunia ke dalam kehidupan
            anda.
          </Text>
        </View>
        <View
          style={{
            height: 70,
            backgroundColor: color['primary-1'],
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingHorizontal: 21,
          }}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => navigation.navigate('login')}>
            <Text
              style={{
                marginTop: 2,
                marginRight: 12,
                fontFamily: 'Poppins-Bold',
                fontSize: 16,
                color: color['white-0'],
              }}>
              Mulai
            </Text>
            <RightArrow />
          </TouchableOpacity>
        </View>
      </View>
    </React.Fragment>
  );
}
