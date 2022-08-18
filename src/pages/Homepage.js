import React from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import RNMasonryScroll from 'react-native-masonry-scrollview';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import getColor from '../color';
import ProductList from '../components/ProductList';
import SectionTitle from '../components/SectionTitle';
import service from '../service';
import Explore from './Explore';

import _ from 'lodash';
import SearchAlt from '../assets/icons/SearchAlt.svg';
import BookList from '../components/BookList';
import useDebounce from '../debounce';

export default function Homepage({navigation}) {
  const color = getColor();
  const [last, setLast] = React.useState([]);
  const [course, setCourse] = React.useState([]);
  const [product, setProduct] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [found, setFound] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const debounce = useDebounce(text => _getDataExplorer(text, 1), 2000);

  const _getDataExplorer = (query = '', page = 1, append = false) => {
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

  const getProduct = () => {
    return new Promise(resolve => {
      service
        .get('/product', {
          params: {
            limit: 10,
          },
        })
        .then(response => {
          resolve(response.data.data);
        })
        .catch(() => {
          resolve(false);
        });
    });
  };

  const getLastContent = () => {
    return new Promise(resolve => {
      service
        .get('/content', {
          params: {
            q: '',
            page: 1,
            limit: 10,
          },
        })
        .then(response => {
          resolve(response.data.data);
        })
        .catch(() => {
          resolve(false);
        });
    });
  };

  const getCourse = () => {
    return new Promise(resolve => {
      service
        .get('/course', {
          params: {
            limit: 10,
          },
        })
        .then(response => {
          resolve(response.data.data);
        })
        .catch(() => {
          resolve(false);
        });
    });
  };

  const getCategory = () => {
    return new Promise(resolve => {
      service
        .get('/category')
        .then(response => {
          resolve(response.data);
        })
        .catch(() => {
          resolve(false);
        });
    });
  };

  const getData = async (refresh = false) => {
    if (refresh) {
      setRefresh(true);
    } else {
      setLoading(true);
    }

    const lastData = await getLastContent();
    const category = await getCategory();
    const course = await getCourse();
    const product = await getProduct();

    if (lastData && course && product && category) {
      setLast(lastData);
      setCategory(category);
      setCourse(course);
      setProduct(product);

      if (refresh) {
        setRefresh(false);
      } else {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    getData();
    +_getDataExplorer([{}, {}, {}, {}, {}]);
    _getDataExplorer(page);
    navigation.setOptions({
      headerShown: true,
    });
  }, []);

  return (
    <React.Fragment>
      <StatusBar
        backgroundColor={color['primary-1']}
        barStyle="light-content"
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              getData(true);
            }}
          />
        }
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: color['white-1']}}>
        {/*seacrh data*/}
        <View style={{flex: 1, backgroundColor: color['white-1']}}>
          <View
            style={{
              padding: 21,
              backgroundColor: color['white-1'],
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: color['white-2'],
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: color['primary-1'],
                borderWidth: 3,
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
                placeholder="Search ..."
                onChangeText={text => {
                  if (_.isEmpty(text)) {
                    setFound(true);
                  } else {
                    setFound(false);
                    setData([{}, {}, {}, {}, {}]);
                    debounce(text);
                    setQuery(text);
                  }
                }}
              />
              <SearchAlt
                width={18}
                height={18}
                color={color['primary-1']}
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
                  _getDataExplorer(query, 1);
                }}
              />
            }
            contentContainerStyle={{paddingVertical: 18}}
            data={found ? [] : data}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: color['white-1']}}
            keyExtractor={(item, index) => `search-${index}`}
            onEndReached={() => {
              if (page + 1 <= total) {
                _getDataExplorer(query, page + 1, true);
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
        {found ? (
          <React.Fragment>
            <SectionTitle style={{marginTop: -50}}>Categories</SectionTitle>
            <RNMasonryScroll
              horizontal={true}
              columns={3}
              columnStyle={{
                paddingHorizontal: 21,
              }}
              showsHorizontalScrollIndicator={false}>
              {(!loading ? category : [{}, {}, {}, {}, {}]).map((item, index) =>
                loading ? (
                  <SkeletonPlaceholder key={`cat-${index}`}>
                    <SkeletonPlaceholder.Item
                      backgroundColor={color['primary-0']}
                      paddingHorizontal={21}
                      paddingVertical={12}
                      borderRadius={4}
                      marginRight={8}
                      marginBottom={8}
                      width={Math.random() * (200 - 100) + 100}
                    />
                  </SkeletonPlaceholder>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('category', {id: item.id})
                    }
                    style={{
                      backgroundColor: color['primary-0'],
                      paddingHorizontal: 21,
                      paddingVertical: 12,
                      borderRadius: 4,
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                    key={`${index}`}>
                    <Text style={{color: color['white-0']}}>{item.name}</Text>
                  </TouchableOpacity>
                ),
              )}
            </RNMasonryScroll>
            <SectionTitle>Newest</SectionTitle>
            <FlatList
              data={!loading ? last : [{}, {}]}
              keyExtractor={(item, index) => `${index}`}
              contentContainerStyle={{
                paddingHorizontal: 21,
                marginBottom: 21,
              }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={({item, index}) => (
                <ProductList
                  image={item.cover}
                  title={item.title}
                  showPrice={false}
                  onPress={() =>
                    navigation.navigate('detail', {
                      id: item.id,
                    })
                  }
                />
              )}
            />
            <View style={{flex: 1, flexDirection: 'row'}}>
              <SectionTitle>Online Course</SectionTitle>
              <SectionTitle
                style={{flex: 1, fontSize: 14, textAlign: 'right'}}
                onPress={() => navigation.navigate('ocousers')}>
                More »
              </SectionTitle>
            </View>
            <FlatList
              data={!loading ? course : [{}, {}]}
              keyExtractor={(item, index) => `course-${index}`}
              contentContainerStyle={{
                paddingHorizontal: 21,
                marginBottom: 21,
              }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={({item, index}) => (
                <ProductList
                  image={item.cover}
                  title={item.title}
                  showPrice={false}
                  onPress={() => {
                    navigation.navigate('courseDetail', {id: item.id});
                  }}
                />
              )}
            />
            <View style={{flex: 1, flexDirection: 'row'}}>
              <SectionTitle>Books</SectionTitle>
              <SectionTitle
                style={{flex: 1, fontSize: 14, textAlign: 'right'}}
                onPress={() => navigation.navigate('nproduct')}>
                More »
              </SectionTitle>
            </View>
            <FlatList
              data={!loading ? product : [{}, {}]}
              keyExtractor={(item, index) => `product-${index}`}
              contentContainerStyle={{
                paddingHorizontal: 21,
                marginBottom: 21,
              }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={({item, index}) => (
                <ProductList
                  image={item.cover}
                  title={item.title}
                  showPrice={false}
                  onPress={() => {
                    navigation.navigate('productDetail', {id: item.id});
                  }}
                />
              )}
            />
          </React.Fragment>
        ) : null}
      </ScrollView>
    </React.Fragment>
  );
}
