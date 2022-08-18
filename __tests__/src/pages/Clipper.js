import React from 'react';
import {Dimensions, FlatList, Text, View} from 'react-native';
import getColor from '../color';
import ClipList from '../components/ClipList';
import service from '../service';

export default function Clipper({route}) {
  const [data, setData] = React.useState([]);
  const color = getColor();

  const _getData = () => {
    service
      .get('/clip')
      .then(response => {
        setData(response.data);
      })
      .catch(() => {});
  };

  React.useEffect(() => {
    _getData();
  }, [route.params?.refresh]);
  return (
    <FlatList
      style={{flex: 1, backgroundColor: color['white-1']}}
      data={data}
      keyExtractor={(item, index) => `${index}`}
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
      renderItem={({item}) => (
        <ClipList
          body={item.body}
          content={item.bab?.content?.title}
          bab={item.bab?.title}
          id={item.id}
        />
      )}
    />
  );
}
