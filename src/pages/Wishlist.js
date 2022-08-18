import React from 'react';
import {Dimensions, FlatList, RefreshControl, Text, View} from 'react-native';
import getColor from '../color';
import BookList from '../components/BookList';
import service from '../service';

export default function Wishlist({navigation}) {
  const color = getColor();
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const _getData = (page = 1, append = false) => {
    service
      .get('/content', {
        params: {
          page,
          liked: 1,
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
      .catch(() => {
        setData([]);
        setTotal(0);
      });
  };

  React.useEffect(() => {
    setData([{}, {}, {}, {}, {}]);
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
      contentContainerStyle={{paddingVertical: 18}}
      data={data}
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: color['white-1'], flex: 1}}
      keyExtractor={(item, index) => `search-${index}`}
      onEndReached={() => {
        if (page + 1 <= total) {
          _getData(page + 1, true);
        }
      }}
      onEndReachedThreshold={0.3}
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
      renderItem={({item, index}) => (
        <BookList
          onPress={() => navigation.navigate('detail', {id: item.id})}
          title={item.title}
          cover={item.cover}
          ring={item.babs_count}
        />
      )}
    />
  );
}
