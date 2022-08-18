import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import getColor from '../color';
import PackageList from '../components/PackageList';
import service from '../service';

export default function Subscription({navigation}) {
  const color = getColor();
  const [packages, setPackages] = useState([{}, {}, {}, {}]);

  const proceed = id => {
    service
      .post('/subscription/' + id)
      .then(response => {
        const {id} = response.data;
        navigation.navigate('payment', {id});
      })
      .catch(() => {});
  };

  useEffect(() => {
    service
      .get('/subscription/package')
      .then(response => {
        setPackages(response.data);
      })
      .catch(e => {});
  }, []);
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={packages}
      contentContainerStyle={{
        backgroundColor: color['white-1'],
        paddingTop: 16,
      }}
      keyExtractor={(item, index) => `${item.id || index}`}
      renderItem={({item}) => (
        <PackageList
          onPress={() => proceed(item.id)}
          title={item.title}
          description={item.description}
          price={item.price}
        />
      )}
    />
  );
}
