import React, {Fragment, useState, useEffect} from 'react';
import {FlatList, View, Text} from 'react-native';
import NumberFormat from 'react-number-format';
import getColor from '../color';
import service from '../service';

export default function Payment({route}) {
  const color = getColor();
  const [bank, setBank] = useState([]);
  const [data, setData] = useState({});
  const {id} = route.params;
  const [text, setText] = useState('');

  const getBank = () => {
    return new Promise(resolve => {
      service
        .get('/bank')
        .then(response => {
          resolve(response.data);
        })
        .catch(() => {
          resolve(false);
        });
    });
  };

  const getConfig = () => {
    return new Promise(resolve => {
      service
        .get('/config')
        .then(response => {
          const {paymentText} = response.data;
          resolve(paymentText.replace('{bank}', ''));
        })
        .catch(() => {
          resolve(false);
        });
    });
  };

  const getData = id => {
    return new Promise(resolve => {
      service
        .get(`/checkout/${id}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(e => {
          if (e.response?.status === 404) {
            history.replace('/');
          }
          resolve(false);
        });
    });
  };

  useEffect(() => {
    (async () => {
      setData({});
      setBank([{}, {}, {}, {}]);
      const data = await getData(id);
      const bank = await getBank();
      const text = await getConfig();

      setData(data);
      setBank(bank);
      setText(text);
    })();
  }, [id]);

  return (
    <FlatList
      data={bank}
      contentContainerStyle={{
        marginHorizontal: 21,
        marginVertical: 16,
        backgroundColor: color['white-0'],
        padding: 16,
      }}
      keyExtractor={(item, index) => `${item.id || index}`}
      ListHeaderComponent={
        <Fragment>
          <View
            style={{
              borderWidth: 1,
              borderColor: color['white-4'],
              padding: 16,
              backgroundColor: color['white-0'],
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                color: color['black-2'],
              }}>
              Total
            </Text>
            <NumberFormat
              thousandSeparator={true}
              prefix="Rp"
              displayType="text"
              value={data.total}
              renderText={text => (
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: color['black-1'],
                    fontFamily: 'Roboto-Bold',
                    fontSize: 20,
                    marginTop: 6,
                  }}>
                  {text}
                </Text>
              )}
            />
          </View>
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              lineHeight: 22,
              marginVertical: 16,
            }}>
            {text}
          </Text>
        </Fragment>
      }
      renderItem={({item}) => (
        <View
          style={{
            borderLeftWidth: 3,
            borderColor: color['white-5'],
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginBottom: 16,
          }}>
          <Text
            style={{
              fontFamily: 'Roboto-Bold',
              fontSize: 16,
              color: color['black-0'],
            }}>
            {item.bank_name}
          </Text>
          <Text style={{fontFamily: 'Roboto-Regular', color: color['black-1']}}>
            {item.account_number}
          </Text>
          <Text style={{fontFamily: 'Roboto-Regular', color: color['black-1']}}>
            {item.account_name}
          </Text>
        </View>
      )}
    />
  );
}
