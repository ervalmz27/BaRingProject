import React from 'react';
import {RefreshControl, FlatList, Text, View} from 'react-native';
import ProductList from '../components/ProductList';
import service from '../service';
import Ecommerce from './Ecommerce'
import SectionTitle from '../components/SectionTitle';

export default function Course({navigation}) {
  const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const _getData = (page = 1, append = false) => {
    service
      .get('/course', {
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
      onEndReachedThreshold={0.3}
      keyExtractor={(item, index) => `${index}`}
      renderItem={({item}) => (
        <ProductList
          image={item.cover}
          title={item.title}
          price={item.price}
          access={item.is_access}
          onPress={() => {
            navigation.navigate('courseDetail', {id: item.id});
          }}
        />
      )}
      ListHeaderComponent={<SectionTitle style={{ marginTop: -30, marginLeft: -24 }}>Online Course</SectionTitle> }
      ListFooterComponent={
        <View style={{ flex: 1, marginLeft: -13 }}>
        <Ecommerce navigation={navigation} />
        </View>
      }
    />
  );
}
