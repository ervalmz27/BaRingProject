import React from 'react';
import {Dimensions, FlatList, RefreshControl, Text, View} from 'react-native';
import getColor from '../color';
import BlockButton from '../components/BlockButton';
import CartDigiList from '../components/CartDigiList';
import CartList from '../components/CartList';
import {CartContext} from '../contexts/cart';
import service from '../service';

export default function Cart({navigation}) {
  const color = getColor();
  const {cart, setCart} = React.useContext(CartContext);
  const [refreshing, setRefreshing] = React.useState(false);

  const _getCart = () => {
    service
      .get('/cart')
      .then(response => {
        const {data} = response;
        setCart({type: 'reset', payload: data});
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            _getCart();
          }}
        />
      }
      style={{flex: 1, backgroundColor: color['white-1']}}
      data={cart}
      contentContainerStyle={{
        paddingVertical: 21,
      }}
      ListEmptyComponent={
        <View
          style={{
            height: (Dimensions.get('window').height * 80) / 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontFamily: 'Poppins-Bold', color: color['black-0']}}>
            Belum ada item
          </Text>
        </View>
      }
      keyExtractor={(item, index) => `${index}`}
      renderItem={({item, index}) =>
        item.type === 'product' ? (
          <CartList
            title={item.name}
            price={item.price}
            qty={item.qty}
            image={item.image}
            onDelete={() => {
              setCart({type: 'resetQty', index, qty: 0});
            }}
            onDecrease={() => {
              setCart({type: 'decreaseQty', index});
            }}
            onIncrease={() => {
              setCart({type: 'increaseQty', index});
            }}
          />
        ) : (
          <CartDigiList
            title={item.name}
            price={item.price}
            image={item.image}
            onDelete={() => {
              setCart({type: 'resetQty', index, qty: 0});
            }}
          />
        )
      }
      ListFooterComponent={
        cart.length ? (
          <BlockButton
            onPress={() => navigation.navigate('checkout')}
            style={{margin: 12, marginHorizontal: 21, borderRadius: 6}}>
            Checkout
          </BlockButton>
        ) : null
      }
    />
  );
}
