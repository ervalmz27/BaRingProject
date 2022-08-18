import React from 'react';
import {View, TextInput, FlatList, RefreshControl} from 'react-native';
import getColor from '../color';
import SearchAlt from '../assets/icons/SearchAlt.svg';
import service from '../service';
import BookList from '../components/BookList';
import useDebounce from '../debounce';

export default function Explore({navigation}) {
  const color = getColor();
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const debounce = useDebounce(text => _getData(text, 1), 2000);

  const _getData = (query = '', page = 1, append = false) => {
    service
      .get('/content', {
        params: {
          page,
          q: query,
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
    <View style={{flex: 1, backgroundColor: color['white-1']}}>
      <View
        style={{
          padding: 21,
          backgroundColor: color['primary-0'],
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: color['white-0'],
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TextInput
            style={{
              height: 48,
              color: color['black-0'],
              fontFamily: 'Roboto-Regular',
              fontSize: 16,
              flex: 1,
              paddingHorizontal: 12,
            }}
            placeholderTextColor={color['black-1']}
            placeholder="Cari disini..."
            onChangeText={text => {
              setData([{}, {}, {}, {}, {}]);
              debounce(text);
              setQuery(text);
            }}
          />
          <SearchAlt
            width={18}
            height={18}
            color={color['black-1']}
            style={{marginHorizontal: 12}}
          />
        </View>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              _getData(query, 1);
            }}
          />
        }
        contentContainerStyle={{paddingVertical: 18}}
        data={data}
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: color['white-1']}}
        keyExtractor={(item, index) => `search-${index}`}
        onEndReached={() => {
          if (page + 1 <= total) {
            _getData(query, page + 1, true);
          }
        }}
        onEndReachedThreshold={0.3}
        renderItem={({item, index}) => (
          <BookList
            onPress={() => navigation.navigate('detail', {id: item.id})}
            title={item.title}
            cover={item.cover}
            ring={item.babs_count}
          />
        )}
      />
    </View>
  );
}
