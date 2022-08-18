import React, {Fragment} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import getColor from '../color';
import BlockButton from '../components/BlockButton';
import Header from '../components/Header';
import SectionTitle from '../components/SectionTitle';
import TextField from '../components/TextField';
import {baseURL} from '../config';
import service from '../service';

export default function ReadCourse({route, navigation}) {
  const color = getColor();
  const [loading, setLoading] = React.useState(true);
  const [postLoading, setPostLoading] = React.useState(false);
  const [withChild, setWithChild] = React.useState(true);
  const [showBoostForm, setShowBoostForm] = React.useState(false);
  const [data, setData] = React.useState({});
  const [boosts, setBoosts] = React.useState([]);
  const {id} = route.params;
  const _scrollY = React.useRef(new Animated.Value(0)).current;
  const _titleOpacity = _scrollY.interpolate({
    inputRange: [0, 70, 80],
    outputRange: [0, 0, 1],
  });
  const {control, handleSubmit} = useForm();

  const sendBoost = ({body}) => {
    setShowBoostForm(false);
    setPostLoading(true);
    service
      .post('/boost/' + id, {
        body,
      })
      .then(response => {
        setPostLoading(false);
        setData(value => ({
          ...value,
          is_boosted: true,
        }));
        setBoosts(value => {
          return [...value, response.data];
        });
      })
      .catch(e => {
        setPostLoading(false);
      });
  };

  const _getDataBoost = () => {
    service
      .get('/boost/' + id)
      .then(response => {
        setBoosts(response.data);
      })
      .catch(e => {});
  };

  const _getData = () => {
    setLoading(true);
    service
      .get(`/subject/${id}`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    _getData();
    _getDataBoost();
  }, [id]);

  React.useEffect(() => {
    navigation.setOptions({
      title: data.title,
      headerTitleStyle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        marginBottom: -2,
        opacity: _titleOpacity,
      },
    });
    if (data.childs?.length < 1) {
      setWithChild(false);
    }
  }, [data]);

  return (
    <Fragment>
      <Animated.FlatList
        data={!loading ? data.childs : []}
        keyExtractor={(item, index) => `${index}`}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {y: _scrollY},
              },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}
        showsVerticalScrollIndicator={false}
        style={{flex: 1, backgroundColor: color['white-0']}}
        ListHeaderComponent={
          <Fragment>
            <Header style={{marginBottom: 21}}>
              {loading ? (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item
                    width="100%"
                    height={16}
                    marginTop={10}
                    borderRadius={6}
                  />
                </SkeletonPlaceholder>
              ) : (
                <Fragment>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Bold',
                      color: color['white-0'],
                      fontSize: 16,
                      marginTop: 4,
                      lineHeight: 22,
                    }}>
                    {data.title}
                  </Text>
                </Fragment>
              )}
            </Header>
            {loading ? (
              <View style={{paddingHorizontal: 21}}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item
                    height={16}
                    marginTop={6}
                    width="100%"
                  />
                  <SkeletonPlaceholder.Item
                    height={16}
                    marginTop={6}
                    width="100%"
                  />
                  <SkeletonPlaceholder.Item
                    height={16}
                    marginTop={6}
                    width="100%"
                  />
                  <SkeletonPlaceholder.Item
                    height={16}
                    marginTop={6}
                    width="100%"
                  />
                </SkeletonPlaceholder>
              </View>
            ) : (
              <Fragment>
                <View style={{flexDirection: 'row', paddingHorizontal: 21}}>
                  {data.pdf ? (
                    <BlockButton
                      onPress={() => {
                        navigation.navigate('pdf', {uri: baseURL + data.pdf});
                      }}
                      textStyle={{
                        fontSize: 14,
                      }}
                      style={{
                        height: 30,
                        paddingHorizontal: 21,
                        borderRadius: 3,
                        marginRight: 12,
                      }}>
                      PDF
                    </BlockButton>
                  ) : null}
                  {data.audio ? (
                    <BlockButton
                      onPress={() => {
                        navigation.navigate('audio', {
                          uri: baseURL + data.audio,
                          cover: baseURL + data.course.cover,
                          courseTitle: data.course.title,
                          title: data.title,
                        });
                      }}
                      textStyle={{
                        fontSize: 14,
                      }}
                      style={{
                        height: 30,
                        paddingHorizontal: 21,
                        borderRadius: 3,
                        marginRight: 12,
                      }}>
                      Audio
                    </BlockButton>
                  ) : null}
                  {data.video ? (
                    <BlockButton
                      onPress={() => {
                        navigation.navigate('video', {uri: data.video});
                      }}
                      textStyle={{
                        fontSize: 14,
                      }}
                      style={{
                        height: 30,
                        paddingHorizontal: 21,
                        borderRadius: 3,
                        marginRight: 12,
                      }}>
                      Video
                    </BlockButton>
                  ) : null}
                </View>
                <HTMLView
                  addLineBreaks={false}
                  stylesheet={StyleSheet.create({
                    p: {
                      fontFamily: 'Gotham-Book',
                      color: color['black-1'],
                      lineHeight: 24,
                      textAlign: 'justify',
                      marginVertical: 8,
                      marginHorizontal: 21,
                    },
                  })}
                  value={data?.body || ''}
                />
                <View
                  style={{
                    padding: 12,
                    paddingHorizontal: 21,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {boosts.map((item, index) => (
                    <View
                      style={{
                        borderWidth: 1,
                        padding: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 12,
                        borderColor: color['white-3'],
                      }}
                      key={`boost-${index}`}>
                      <Image
                        source={{uri: baseURL + item.user?.avatar}}
                        style={{
                          height: 32,
                          width: 32,
                          resizeMode: 'cover',
                          marginRight: 4,
                        }}
                      />
                      <Text style={{paddingHorizontal: 6}}>{item.body}</Text>
                    </View>
                  ))}
                </View>
              </Fragment>
            )}
            {data.childs?.length > 0 && !loading ? (
              <SectionTitle>Sub Materi</SectionTitle>
            ) : null}
          </Fragment>
        }
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate({
                key: `sub-${item.id}`,
                name: 'readCourse',
                params: {id: item.id},
              })
            }>
            <View
              style={{
                paddingHorizontal: 21,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderColor: color['white-3'],
              }}>
              <Text>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {loading && (!withChild || !data.is_boosted) ? null : (
        <View
          style={{
            paddingVertical: 12,
            paddingHorizontal: 21,
            backgroundColor: color['white-0'],
            flexDirection: 'row',
          }}>
          {!data.is_boosted ? (
            <TouchableOpacity
              onPress={() => setShowBoostForm(true)}
              style={{
                backgroundColor: color['secondary-0'],
                height: 40,
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                paddingHorizontal: 12,
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  fontSize: 16,
                  color: color['black-0'],
                }}>
                Boost
              </Text>
            </TouchableOpacity>
          ) : null}
          {!withChild ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('comments', {id: data.id})}
              style={{
                backgroundColor: color['white-3'],
                height: 40,
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 12,
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  fontSize: 16,
                  color: color['black-0'],
                }}>
                Komentar
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
      <Modal
        visible={showBoostForm}
        transparent={true}
        onRequestClose={() => setShowBoostForm(false)}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            opacity: 0.5,
          }}
        />
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View
            style={{
              backgroundColor: color['white-0'],
              padding: 12,
              paddingHorizontal: 21,
              flexDirection: 'row',
            }}>
            <Controller
              control={control}
              name="body"
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  value={value}
                  onChangeText={onChange}
                  containerStyle={{flex: 1, marginRight: 12}}
                  placeholder="Tulis disini..."
                />
              )}
            />
            <BlockButton
              style={{paddingHorizontal: 12}}
              onPress={handleSubmit(sendBoost)}>
              Kirim
            </BlockButton>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={postLoading}>
        <View style={{flex: 1, backgroundColor: '#000', opacity: 0.5}} />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color="#FFF" size="large" />
        </View>
      </Modal>
    </Fragment>
  );
}
