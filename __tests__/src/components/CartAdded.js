import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import getColor from '../color';
import CartCheck from '../assets/icons/CartCheck.svg';

const CartAdded = React.forwardRef((props, ref) => {
  const [modal, setModal] = React.useState(false);
  const navigation = useNavigation();
  const color = getColor();

  React.useImperativeHandle(
    ref,
    () => ({
      show: () => setModal(true),
      hide: () => setModal(false),
    }),
    [],
  );
  return (
    <Modal
      visible={modal}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}>
      <View
        style={{
          backgroundColor: '#000',
          opacity: 0.5,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View
          style={{
            backgroundColor: color['white-0'],
            margin: 18,
            borderRadius: 6,
          }}>
          <View
            style={{
              padding: 21,
              paddingVertical: 46,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CartCheck width={65} height={65} fill={color['black-0']} />
            <Text
              style={{
                fontFamily: 'Poppins-Bold',
                fontSize: 16,
                color: color['black-0'],
                marginTop: 16,
              }}>
              Berhasil Ditambahkan
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderColor: color['white-4'],
            }}>
            <TouchableOpacity
              onPress={() => setModal(false)}
              activeOpacity={0.9}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: color['white-1'],
                borderBottomLeftRadius: 6,
              }}>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: color['black-0'],
                  textAlign: 'center',
                }}>
                Tutup
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModal(false);
                navigation.navigate('cart');
              }}
              activeOpacity={0.9}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: color['white-1'],
                borderBottomRightRadius: 6,
                borderLeftWidth: 1,
                borderColor: color['white-4'],
              }}>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: color['black-0'],
                  textAlign: 'center',
                }}>
                Lihat Keranjang
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default CartAdded;
