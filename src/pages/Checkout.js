import React, {Fragment} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ActivityIndicator, FlatList, Modal, Text, View} from 'react-native';
import NumberFormat from 'react-number-format';
import getColor from '../color';
import BlockButton from '../components/BlockButton';
import CheckoutList from '../components/CheckoutList';
import CourierList from '../components/CourierList';
import SectionTitle from '../components/SectionTitle';
import SelectPicker from '../components/SelectPicker';
import TextField from '../components/TextField';
import {CartContext} from '../contexts/cart';
import errorMessage from '../error-message';
import service from '../service';

export default function Checkout({navigation}) {
  const color = getColor();
  const {setCart: dispatchCart} = React.useContext(CartContext);
  const [cart, setCart] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [postLoading, setPostLoading] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const [shipping, setShipping] = React.useState(0);
  const [province, setProvince] = React.useState([]);
  const [city, setCity] = React.useState([]);
  const [subdistrict, setSubdistrict] = React.useState([]);
  const [couriers, setCouriers] = React.useState([]);
  const [withShipping, setWithShipping] = React.useState(false);
  const [courierSelected, setCourierSelected] = React.useState('');
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const getShippingCost = destination => {
    setCouriers([{}, {}, {}, {}]);
    service
      .get('/shipping/cost', {
        params: {
          destination,
        },
      })
      .then(response => {
        const {data} = response;
        setCouriers(data);
      })
      .catch(() => {
        setCouriers([]);
      });
  };

  const _getCart = () => {
    setLoading(true);
    service
      .get('/cart')
      .then(response => {
        const {data} = response;
        setCart(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const loadProvince = () => {
    setProvince([]);
    setCity([]);
    setSubdistrict([]);
    service
      .get('/shipping/province')
      .then(response => {
        const {data} = response;

        const province = data.map(item => ({
          value: item.province_id,
          label: item.province,
        }));
        setProvince(province);
      })
      .catch(e => {});
  };

  const loadCity = id => {
    setCity([]);
    setSubdistrict([]);
    service
      .get('/shipping/city', {
        params: {
          id,
        },
      })
      .then(response => {
        const {data} = response;

        const city = data.map(item => ({
          value: item.city_id,
          label: item.city_name,
        }));
        setCity(city);
      })
      .catch(e => {});
  };

  const loadSubdistrict = id => {
    setSubdistrict([]);
    service
      .get('/shipping/subdistrict', {
        params: {
          id,
        },
      })
      .then(response => {
        const {data} = response;

        const subdistrict = data.map(item => ({
          value: item.subdistrict_id,
          label: item.subdistrict_name,
        }));
        setSubdistrict(subdistrict);
      })
      .catch(e => {});
  };

  const proceedCheckout = ({
    destination_rajaongkir,
    destination_first,
    recipient_name,
    recipient_phone,
    shipping_service,
  }) => {
    setPostLoading(true);
    service
      .post(
        '/checkout',
        withShipping
          ? {
              destination_rajaongkir,
              destination_first,
              recipient_name,
              recipient_phone,
              shipping_service,
            }
          : {},
      )
      .then(response => {
        const {id} = response.data;
        dispatchCart({type: 'reset', payload: []});
        navigation.navigate('payment', {id});
      })
      .catch(e => {
        setPostLoading(false);
        console.log(e.response);
      });
  };

  React.useEffect(() => {
    _getCart();
    loadProvince();
  }, []);

  React.useEffect(() => {
    setValue('destination_rajaongkir', '');
    setValue('shipping_service', '');
    setShipping(0);
  }, [province, city, subdistrict]);

  React.useEffect(() => {
    let shipping = false;
    let total = 0;
    for (let item of cart) {
      if (item.type === 'product') {
        shipping = true;
      }
      total = total + item.price * item.qty;
    }

    setWithShipping(shipping);
    setTotal(total);
  }, [cart]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color['white-1'],
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={color['primary-0']} />
      </View>
    );
  }

  return (
    <Fragment>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={cart}
        style={{flex: 1, backgroundColor: color['white-1']}}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({item}) => (
          <CheckoutList
            title={item.name}
            price={item.price}
            qty={item.qty}
            image={item.image}
          />
        )}
        ListFooterComponent={
          <Fragment>
            {withShipping ? (
              <Fragment>
                <View
                  style={{
                    backgroundColor: color['white-0'],
                    marginTop: 16,
                  }}>
                  <SectionTitle>Alamat</SectionTitle>
                  <Controller
                    control={control}
                    name="recipient_name"
                    rules={{required: errorMessage.required}}
                    render={({field: {value, onChange}}) => (
                      <TextField
                        value={value}
                        onChangeText={text => onChange(text)}
                        containerStyle={{
                          marginHorizontal: 21,
                          marginBottom: 14,
                        }}
                        label="Nama Penerima"
                        message={errors.recipient_name?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="recipient_phone"
                    rules={{required: errorMessage.required}}
                    render={({field: {value, onChange}}) => (
                      <TextField
                        value={value}
                        onChangeText={text => onChange(text)}
                        containerStyle={{
                          marginHorizontal: 21,
                          marginBottom: 14,
                        }}
                        label="No. Handphone"
                        placeholder="Contoh: 08127176xxxx"
                        message={errors.recipient_phone?.message}
                      />
                    )}
                  />
                  <SelectPicker
                    label="Provinsi"
                    options={province}
                    containerStyle={{
                      marginHorizontal: 21,
                      marginBottom: 14,
                    }}
                    onValueChange={id => {
                      if (id) loadCity(id);
                    }}
                  />
                  <SelectPicker
                    label="Kota/Kabupaten"
                    options={city}
                    containerStyle={{
                      marginHorizontal: 21,
                      marginBottom: 14,
                    }}
                    onValueChange={id => {
                      if (id) loadSubdistrict(id);
                    }}
                  />
                  <Controller
                    control={control}
                    defaultValue=""
                    rules={{required: errorMessage.required}}
                    name="destination_rajaongkir"
                    render={({field: {value, onChange}}) => (
                      <SelectPicker
                        label="Kecamatan"
                        options={subdistrict}
                        containerStyle={{
                          marginHorizontal: 21,
                          marginBottom: 14,
                        }}
                        onValueChange={id => {
                          onChange(id);
                          setValue('shipping_service', '');
                          setShipping(0);
                          if (id) getShippingCost(id);
                        }}
                        message={errors.destination_rajaongkir?.message}
                        value={value || ''}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="destination_first"
                    rules={{required: errorMessage.required}}
                    render={({field: {value, onChange}}) => (
                      <TextField
                        value={value}
                        onChangeText={text => onChange(text)}
                        containerStyle={{
                          marginHorizontal: 21,
                          marginBottom: 14,
                        }}
                        label="Alamat"
                        message={errors.destination_first?.message}
                      />
                    )}
                  />
                </View>
                {watch('destination_rajaongkir') ? (
                  <Controller
                    control={control}
                    name="shipping_service"
                    rules={{required: errorMessage.required}}
                    render={({field: {value, onChange}}) => (
                      <View
                        style={{
                          backgroundColor: color['white-0'],
                          marginTop: 16,
                        }}>
                        <SectionTitle>Jasa Pengiriman</SectionTitle>
                        {couriers.map((item, index) => (
                          <CourierList
                            name={item.name}
                            code={item.code}
                            costs={item.costs}
                            key={`${index}`}
                            value={value}
                            selected={courierSelected === item.code}
                            onChangeCourier={setCourierSelected}
                            onChangeService={(service, cost) => {
                              onChange(`${item.code} - ${service}`);
                              setShipping(cost);
                            }}
                          />
                        ))}
                        {errors.shipping_service?.message ? (
                          <Text
                            style={{
                              color: color['red-0'],
                              fontFamily: 'Roboto-Regular',
                              fontSize: 14,
                              marginHorizontal: 21,
                              marginBottom: 12,
                            }}>
                            {errors.shipping_service?.message}
                          </Text>
                        ) : null}
                      </View>
                    )}
                  />
                ) : null}
              </Fragment>
            ) : null}
            <View
              style={{
                backgroundColor: color['white-0'],
                marginTop: 16,
                paddingHorizontal: 21,
                paddingVertical: 18,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 2,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: color['black-1'],
                    fontFamily: 'Roboto-Regular',
                  }}>
                  Total
                </Text>
                <NumberFormat
                  displayType="text"
                  thousandSeparator={true}
                  prefix="Rp"
                  value={total}
                  renderText={text => (
                    <Text
                      style={{
                        color: color['black-1'],
                        fontFamily: 'Roboto-Regular',
                      }}>
                      {text}
                    </Text>
                  )}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 2,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: color['black-1'],
                    fontFamily: 'Roboto-Regular',
                  }}>
                  Ongkos Kirim
                </Text>
                <NumberFormat
                  displayType="text"
                  thousandSeparator={true}
                  prefix="Rp"
                  value={shipping}
                  renderText={text => (
                    <Text
                      style={{
                        color: color['black-1'],
                        fontFamily: 'Roboto-Regular',
                      }}>
                      {text}
                    </Text>
                  )}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 2,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: color['black-1'],
                    fontFamily: 'Roboto-Bold',
                    fontSize: 16,
                  }}>
                  Total Pembayaran
                </Text>
                <NumberFormat
                  displayType="text"
                  thousandSeparator={true}
                  prefix="Rp"
                  value={shipping + total}
                  renderText={text => (
                    <Text
                      style={{
                        color: color['black-1'],
                        fontFamily: 'Roboto-Bold',
                        fontSize: 16,
                      }}>
                      {text}
                    </Text>
                  )}
                />
              </View>
              <BlockButton
                onPress={handleSubmit(proceedCheckout)}
                style={{marginTop: 20, borderRadius: 6}}>
                Proses Pembayaran
              </BlockButton>
            </View>
          </Fragment>
        }
      />
      <Modal transparent={true} visible={postLoading}>
        <View style={{flex: 1, backgroundColor: '#000', opacity: 0.5}} />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color="#FFF" size="large" />
        </View>
      </Modal>
    </Fragment>
  );
}
