import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {RefreshControl, Text, TouchableOpacity} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Cart from '../assets/icons/Cart.svg';
import getColor from '../color';
import ProductList from '../components/ProductList';
import {CartContext} from '../contexts/cart';
import service from '../service';

export default function Ecommerce({navigation}) {
  const color = getColor();
  const {cart} = React.useContext(CartContext);
  const isFocused = useIsFocused();
  const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const _getData = (page = 1, append = false) => {
    service
      .get('/product', {
        params: {
          page,
        },
      })
      .then(response => {
        const {data, total} = response.data;
        if (append) {
          setData(value => value.concat(data));
        } else {
          setData(data);
        }
        setPage(page);
        setTotal(total);
        setRefreshing(false);
      })
      .catch(e => {
        setData([]);
        setTotal(0);
      });
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('cart');
          }}
          style={{
            paddingHorizontal: 18,
            paddingVertical: 6,
            position: 'relative',
          }}>
          <Cart width={24} height={24} fill={color['white-0']} />
          {cart.length ? (
            <Text
              style={{
                position: 'absolute',
                top: 0,
                right: 5,
                backgroundColor: color['red-0'],
                width: 24,
                height: 24,
                textAlign: 'center',
                textAlignVertical: 'center',
                borderRadius: 24 / 2,
                fontSize: 12,
                color: color['white-0'],
              }}>
              {cart.length}
            </Text>
          ) : null}
        </TouchableOpacity>
      ),
    });
  }, [isFocused]);

  React.useEffect(() => {
    setData([{}, {}, {}, {}]);
    _getData(page);
  }, []);

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            _getData(1);
          }}
        />
      }
      data={data}
      style={{flex: 1}}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 21,
      }}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      onEndReached={() => {
        if (page + 1 <= total) {
          _getData(page + 1, true);
        }
      }}
      onEndReachedThreshold={0.3}
      keyExtractor={(item, index) => `${index}`}
      renderItem={({item}) => (
        <ProductList
          image={item.cover}
          title={item.title}
          price={item.price}
          onPress={() => {
            navigation.navigate('productDetail', {id: item.id});
          }}
        />
      )}
    />
  );
}
