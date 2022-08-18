import React from 'react';
import {RefreshControl, Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import getColor from '../color';
import ProductList from '../components/ProductList';
import service from '../service';

export default function OwnCourse({navigation}) {
  const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const color = getColor();

  const _getData = (page = 1, append = false) => {
    service
      .get('/course/list', {
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
      ListEmptyComponent={
        <Text
          style={{padding: 21, color: color['black-0'], textAlign: 'center'}}>
          Belum ada
        </Text>
      }
      onEndReachedThreshold={0.3}
      keyExtractor={(item, index) => `${index}`}
      renderItem={({item}) => (
        <ProductList
          showPrice={false}
          image={item.cover}
          title={item.title}
          price={item.price}
          onPress={() => {
            navigation.navigate('courseDetail', {id: item.id});
          }}
        />
      )}
    />
  );
}
