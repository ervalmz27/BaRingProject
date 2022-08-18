import React, {Fragment} from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NumberFormat from 'react-number-format';
import getColor from '../color';
import CartAdded from '../components/CartAdded';
import Header from '../components/Header';
import ReviewList from '../components/ReviewList';
import SectionTitle from '../components/SectionTitle';
import {baseURL} from '../config';
import {CartContext} from '../contexts/cart';
import service from '../service';

export default function CourseDetail({route, navigation}) {
  const color = getColor();
  const {id} = route.params || {};
  const {cart, setCart} = React.useContext(CartContext);
  const [data, setData] = React.useState({});
  const modalRef = React.useRef();
  const [reviews, setReviews] = React.useState([{}, {}]);
  const [isMember, setIsMember] = React.useState(false);
  const [isMentor, setIsMentor] = React.useState(false);
  const [isReviewed, setIsReviewed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [joining, setJoining] = React.useState(false);
  const _scrollY = React.useRef(new Animated.Value(0)).current;

  const _titleOpacity = _scrollY.interpolate({
    inputRange: [0, 280, 300],
    outputRange: [0, 0, 1],
  });

  const _joining = () => {
    setJoining(true);
    service
      .post('/course/join/' + id)
      .then(response => {
        setJoining(false);
        setIsMember(true);
      })
      .catch(e => {
        setJoining(false);
      });
  };

  const _getData = () => {
    setLoading(true);
    setReviews([{}, {}]);
    service
      .get('/review/' + id)
      .then(response => {
        setReviews(response.data);
      })
      .catch(e => {
        setReviews([]);
      });
    service
      .get(`/course/${id}`)
      .then(response => {
        setData(response.data);
        setIsMember(response.data.is_member);
        setIsMentor(response.data.is_mentor);
        setIsReviewed(response.data.is_reviewed);
        setLoading(false);
      })
      .catch(e => {
        setData({});
      });
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        marginBottom: -2,
        opacity: _titleOpacity,
      },
    });
  }, []);

  React.useEffect(() => {
    _getData();
  }, [id]);

  React.useEffect(() => {
    if (data.title) {
      navigation.setOptions({
        title: data.title,
      });
    }
  }, [data]);

  return (
    <Fragment>
      <View style={{flex: 1}}>
        <Animated.FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                _getData();
              }}
            />
          }
          data={reviews}
          keyExtractor={(item, index) => `review-${item.id || index}`}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {y: _scrollY},
                },
              },
            ],
            {useNativeDriver: true},
          )}
          showsVerticalScrollIndicator={false}
          style={{flex: 1, backgroundColor: color['white-1']}}
          ListHeaderComponent={
            <Fragment>
              <Header style={{alignItems: 'center'}}>
                {!loading ? (
                  <Image
                    source={{uri: baseURL + data.cover}}
                    style={{
                      width: 144,
                      height: 144,
                      backgroundColor: '#AAA',
                      borderRadius: 12,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item
                      width={144}
                      height={144}
                      borderRadius={12}
                    />
                  </SkeletonPlaceholder>
                )}
                {loading ? (
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item
                      marginTop={28}
                      marginBottom={12}
                      height={16}
                      width={160}
                      borderRadius={6}
                    />
                    <SkeletonPlaceholder.Item
                      marginTop={6}
                      height={14}
                      width={160}
                      borderRadius={6}
                    />
                  </SkeletonPlaceholder>
                ) : (
                  <Fragment>
                    <Text
                      style={{
                        fontFamily: 'Gotham-Bold',
                        color: color['white-0'],
                        fontSize: 18,
                        marginTop: 21,
                        textAlign: 'center',
                        paddingVertical: 12,
                        lineHeight: 24,
                      }}>
                      {data.title}
                    </Text>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginTop: -10,
                        flexWrap: 'wrap',
                      }}>
                      {(data.users
                        ? data.users?.length > 2
                          ? [
                              data.users[0],
                              data.users[1],
                              {
                                fullname: 'dll',
                              },
                            ]
                          : data.users
                        : []
                      ).map((item, index) => (
                        <Fragment key={`author-${index}`}>
                          {index > 0 ? (
                            <Text
                              style={{
                                color: color['white-1'],
                                fontSize: 16,
                              }}>
                              ·
                            </Text>
                          ) : null}
                          <Text
                            style={{
                              marginHorizontal: 12,
                              color: color['white-1'],
                              fontFamily: 'Roboto-Regular',
                              fontSize: 16,
                            }}>
                            {item.fullname}
                          </Text>
                        </Fragment>
                      ))}
                    </View>
                    <NumberFormat
                      displayType="text"
                      thousandSeparator={true}
                      prefix="Rp"
                      value={data.price}
                      renderText={text => (
                        <Text
                          style={{
                            marginTop: 12,
                            color: color['white-1'],
                            fontFamily: 'Roboto-Regular',
                          }}>
                          {text}
                        </Text>
                      )}
                    />
                  </Fragment>
                )}
              </Header>
              <View style={{backgroundColor: color['white-0']}}>
                {loading ? (
                  <View style={{padding: 21}}>
                    <SkeletonPlaceholder>
                      <SkeletonPlaceholder.Item
                        height={14}
                        marginBottom={10}
                        width="100%"
                        borderRadius={6}
                      />
                      <SkeletonPlaceholder.Item
                        height={14}
                        marginBottom={10}
                        width="100%"
                        borderRadius={6}
                      />
                      <SkeletonPlaceholder.Item
                        height={14}
                        marginBottom={10}
                        width="100%"
                        borderRadius={6}
                      />
                      <SkeletonPlaceholder.Item
                        height={14}
                        marginBottom={10}
                        width="100%"
                        borderRadius={6}
                      />
                      <SkeletonPlaceholder.Item
                        height={14}
                        marginBottom={10}
                        width="50%"
                        borderRadius={6}
                      />
                    </SkeletonPlaceholder>
                  </View>
                ) : (
                  <Fragment>
                    <View
                      style={{padding: 21, maxHeight: 134, overflow: 'hidden'}}>
                      <Text
                        style={{
                          textAlign: 'justify',
                          fontFamily: 'Roboto-Regular',
                          lineHeight: 24,
                        }}>
                        {data.description}
                      </Text>
                    </View>
                    <Text
                      onPress={() =>
                        navigation.navigate('moreDescription', {
                          text: data.description,
                        })
                      }
                      style={{
                        paddingHorizontal: 21,
                        marginBottom: 18,
                        fontFamily: 'Roboto-Bold',
                        color: color['primary-0'],
                      }}>
                      Selengkapnya
                    </Text>
                  </Fragment>
                )}
              </View>
              <View style={{backgroundColor: color['white-0'], marginTop: 21}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <SectionTitle>Review</SectionTitle>
                  {isMember && !isReviewed && !isMentor ? (
                    <Text
                      onPress={() =>
                        navigation.navigate('composeReview', {
                          id,
                        })
                      }
                      style={{
                        paddingHorizontal: 21,
                        fontFamily: 'Roboto-Bold',
                        color: color['primary-0'],
                      }}>
                      + Tulis
                    </Text>
                  ) : null}
                </View>
              </View>
            </Fragment>
          }
          ListEmptyComponent={
            <Text
              style={{
                backgroundColor: color['white-0'],
                paddingHorizontal: 21,
                paddingBottom: 21,
                fontFamily: 'Roboto-Regular',
                color: color['black-0'],
              }}>
              Belum ada review
            </Text>
          }
          renderItem={({item}) => (
            <ReviewList
              date={item.created_at}
              name={item.user?.fullname}
              star={item.star}
              body={item.body}
            />
          )}
        />
        {loading ? null : (
          <View
            style={{
              paddingVertical: 12,
              paddingHorizontal: 21,
              backgroundColor: color['white-0'],
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('subjectList', {courseId: id})}
              style={{
                backgroundColor: color['white-3'],
                height: 40,
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                paddingHorizontal: 12,
                flex: isMember ? 1 : null,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  fontSize: 16,
                  color: color['black-0'],
                }}>
                Daftar Materi
              </Text>
            </TouchableOpacity>
            {isMember ? null : data.price ? (
              <TouchableOpacity
                onPress={() => {
                  const index = cart.findIndex(el => el.id === data.id);
                  if (!(index >= 0)) {
                    setCart({
                      type: 'addItem',
                      item: {
                        id: data.id,
                        name: data.title,
                        price: data.price,
                        qty: 1,
                        image: data.cover,
                        type: 'course',
                      },
                    });
                    modalRef.current.show();
                  } else {
                    setCart({type: 'resetQty', index, qty: 0});
                  }
                }}
                style={{
                  backgroundColor: !(
                    cart.findIndex(el => el.id === data.id) >= 0
                  )
                    ? color['secondary-0']
                    : color['red-0'],
                  height: 40,
                  borderRadius: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                {!(cart.findIndex(el => el.id === data.id) >= 0) ? (
                  <Text
                    style={{
                      fontFamily: 'Poppins-Bold',
                      fontSize: 16,
                      color: color['black-0'],
                    }}>
                    + Keranjang
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: 'Poppins-Bold',
                      fontSize: 16,
                      color: color['white-0'],
                    }}>
                    - Keranjang
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  _joining();
                }}
                disabled={joining}
                style={{
                  backgroundColor: color['secondary-0'],
                  height: 40,
                  borderRadius: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                {joining ? (
                  <ActivityIndicator size="small" color={color['black-0']} />
                ) : (
                  <Text
                    style={{
                      fontFamily: 'Poppins-Bold',
                      fontSize: 16,
                      color: color['black-0'],
                    }}>
                    Join
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <CartAdded ref={modalRef} />
    </Fragment>
  );
}
