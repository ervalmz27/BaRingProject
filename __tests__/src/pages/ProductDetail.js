import React, {Fragment} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import NumberFormat from 'react-number-format';
import Add from '../assets/icons/Add.svg';
import Minus from '../assets/icons/Minus.svg';
import getColor from '../color';
import CartAdded from '../components/CartAdded';
import Header from '../components/Header';
import {baseURL} from '../config';
import {CartContext} from '../contexts/cart';
import service from '../service';

export default function ProductDetail({route}) {
  const color = getColor();
  const {id} = route.params || {};
  const [value, setValue] = React.useState(1);
  const {setCart} = React.useContext(CartContext);
  const [data, setData] = React.useState({});
  const modalRef = React.useRef();

  const _getData = () => {
    service
      .get(`/product/${id}`)
      .then(response => {
        setData(response.data);
      })
      .catch(e => {
        setData({});
      });
  };

  React.useEffect(() => {
    _getData();
  }, [id]);

  return (
    <Fragment>
      <View style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, backgroundColor: color['white-0']}}>
          <Header style={{flexDirection: 'row'}}>
            <Image
              source={{uri: baseURL + data.cover}}
              style={{width: 80, height: 80, borderRadius: 6}}
              resizeMode="cover"
            />
            <View style={{flex: 1, marginLeft: 16}}>
              <Text
                style={{
                  fontFamily: 'Gotham-Bold',
                  fontSize: 16,
                  color: color['white-0'],
                  lineHeight: 24,
                }}>
                {data.title}
              </Text>
              <NumberFormat
                value={40000}
                displayType="text"
                thousandSeparator=","
                prefix="Rp"
                renderText={value => (
                  <Text
                    style={{
                      fontFamily: 'Roboto-Regular',
                      color: color['white-1'],
                      lineHeight: 22,
                    }}>
                    {value}
                  </Text>
                )}
              />
            </View>
          </Header>
          <View style={{padding: 21}}>
            <Text style={{textAlign: 'justify', lineHeight: 24}}>
              {data.description}
            </Text>
          </View>
        </ScrollView>
        <View
          style={{
            paddingVertical: 12,
            paddingHorizontal: 21,
            backgroundColor: color['white-0'],
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              borderRadius: 6,
              backgroundColor: color['black-0'],
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}
            onPress={() => {
              if (value > 1) {
                setValue(value => parseInt(value) - 1);
              }
            }}>
            <Minus width={12} height={12} fill={color['white-0']} />
          </TouchableOpacity>
          <TextInput
            style={{
              width: 60,
              height: 40,
              borderWidth: 1,
              borderColor: color['white-4'],
              marginRight: 12,
              borderRadius: 6,
              textAlign: 'center',
              color: color['black-0'],
            }}
            onBlur={() => {
              if (parseInt(value) < 1 || isNaN(parseInt(value))) {
                setValue(1);
              }
            }}
            value={`${value}`}
            onChangeText={text => setValue(text)}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              borderRadius: 6,
              backgroundColor: color['black-0'],
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}
            onPress={() => setValue(value => parseInt(value) + 1)}>
            <Add width={12} height={12} fill={color['white-0']} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              let qty = parseInt(value);
              if (parseInt(value) < 1 || isNaN(parseInt(value))) {
                setValue(1);
                qty = 1;
              }
              setCart({
                type: 'addItem',
                item: {
                  id: data.id,
                  name: data.title,
                  price: data.price,
                  qty,
                  image: data.cover,
                  type: 'product',
                },
              });
              modalRef.current.show();
            }}
            style={{
              backgroundColor: color['secondary-0'],
              height: 40,
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Bold',
                fontSize: 16,
                color: color['black-0'],
              }}>
              + Keranjang
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <CartAdded ref={modalRef} />
    </Fragment>
  );
}
