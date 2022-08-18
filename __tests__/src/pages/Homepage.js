import React from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import RNMasonryScroll from 'react-native-masonry-scrollview';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import getColor from '../color';
import ProductList from '../components/ProductList';
import SectionTitle from '../components/SectionTitle';
import service from '../service';

export default function Homepage({navigation}) {
  const color = getColor();
  const [last, setLast] = React.useState([]);
  const [course, setCourse] = React.useState([]);
  const [product, setProduct] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

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
        <React.Fragment>
          {/* <Header>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Regular',
                      fontSize: 18,
                      color: color['white-3'],
                    }}>
                    Halo,
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Bold',
                      color: color['secondary-0'],
                      fontSize: 20,
                    }}>
                    {fullname}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Bell width={24} height={24} color="#FFF" />
                </TouchableOpacity>
              </View> */}
          {/* <View
                style={{
                  marginTop: 55,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 85,
                    height: 110,
                    backgroundColor: color['white-0'],
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}>
                  <Bookmark width={32} height={32} color={color['black-0']} />
                </View>
                <View
                  style={{
                    paddingVertical: 20,
                    paddingHorizontal: 12,
                    backgroundColor: color['white-3'],
                    flex: 1,
                    justifyContent: 'center',
                    height: 110,
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      color: color['black-1'],
                      fontSize: 16,
                    }}>
                    Lanjutkan
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Merriweather-Bold',
                      fontSize: 16,
                      color: color['black-0'],
                    }}
                    numberOfLines={2}>
                    Kiat Sukses Manajemen Waktu
                  </Text>
                </View>
              </View> */}
          {/* </Header> */}
          <SectionTitle>Kategori</SectionTitle>
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
                  onPress={() => navigation.navigate('category', {id: item.id})}
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
          <SectionTitle>Terbaru</SectionTitle>
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

          <SectionTitle>Online Course</SectionTitle>
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
          <SectionTitle>Produk</SectionTitle>
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
      </ScrollView>
    </React.Fragment>
  );
}
