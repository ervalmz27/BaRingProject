import React from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import getColor from '../color';
import BookList from '../components/BookList';
import service from '../service';

export default function Category({navigation, route}) {
  const color = getColor();
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [name, setName] = React.useState('');
  const {id} = route.params;

  const _getCategory = id => {
    return new Promise(resolve => {
      service
        .get('/category/' + id)
        .then(response => {
          const {name} = response.data;
          resolve(name);
        })
        .catch(() => {
          resolve(false);
        });
    });
  };

  const _getData = async (page = 1, append = false) => {
    if (!name) {
      const category = await _getCategory(id);
      if (!category) {
        history.replace('/');
        return;
      }
      setName(category);
    }
    service
      .get('/content', {
        params: {
          page,
          category: id,
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
    navigation.setOptions({title: name});
    if (!name) {
      setData([{}, {}, {}, {}, {}]);
      _getData(page);
    }
  }, [name]);

  React.useEffect(() => {
    setName('');
  }, [id]);
  return (
    <View style={{flex: 1, backgroundColor: color['white-1']}}>
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
        style={{backgroundColor: color['white-1']}}
        keyExtractor={(item, index) => `search-${index}`}
        onEndReached={() => {
          if (page + 1 <= total) {
            _getData(page + 1, true);
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
