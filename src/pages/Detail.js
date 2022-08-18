import React, {Fragment} from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Pause from '../assets/icons/Pause.svg';
import Play from '../assets/icons/Play.svg';
import getColor from '../color';
import BabList from '../components/BabList';
import Header from '../components/Header';
import SectionTitle from '../components/SectionTitle';
import {baseURL} from '../config';
import service from '../service';
import {useIsFocused} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Heart from '../assets/icons/Heart.svg';

const events = [Event.PlaybackState, Event.PlaybackError];

export default function Detail({route, navigation}) {
  const color = getColor();
  const [data, setData] = React.useState({});
  const {id} = route.params;
  const _heightDesc = React.useRef(new Animated.Value(128)).current;
  const _scrollY = React.useRef(new Animated.Value(0)).current;
  const [more, setMore] = React.useState(false);
  const [playerState, setPlayerState] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const isFocused = useIsFocused();
  const [isLiked, setIsLiked] = React.useState(false);

  const _titleOpacity = _scrollY.interpolate({
    inputRange: [0, 280, 300],
    outputRange: [0, 0, 1],
  });

  useTrackPlayerEvents(events, event => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      setPlayerState(event.state);
    }
  });

  const isPlaying = playerState === State.Playing;

  const _showMore = () => {
    setMore(true);
    Animated.timing(_heightDesc, {
      toValue: 2000,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const _hideMore = () => {
    Animated.timing(_heightDesc, {
      toValue: 128,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setMore(false);
    });
  };

  const getData = (
    beforeLoad = () => {},
    onSuccess = () => {},
    onError = () => {},
  ) => {
    beforeLoad();
    service
      .get(`/content/${id}/detail`)
      .then(response => {
        onSuccess(response);
      })
      .catch(() => {
        onError();
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
    getData(
      () => setLoading(true),
      response => {
        setLoading(false);
        setData(response.data);
      },
      () => setLoading(false),
    );
  }, []);

  React.useEffect(() => {
    if (data.title) {
      setIsLiked(data.is_liked);
      navigation.setOptions({
        title: data.title,
      });
    }
  }, [data]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{paddingHorizontal: 21}}
          onPress={() => {
            service
              .post(`/content/${id}/${isLiked ? 'unlike' : 'like'}`)
              .then(() => {})
              .catch(() => {});
            setIsLiked(value => !value);
          }}>
          <Heart
            width={20}
            height={20}
            color={isLiked ? color['secondary-0'] : color['white-0']}
          />
        </TouchableOpacity>
      ),
    });
  }, [isLiked]);

  React.useEffect(() => {
    if (!isFocused) {
      TrackPlayer.reset();
      setAdded(false);
    }
  }, [isFocused]);
  return (
    <Animated.FlatList
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
      ListHeaderComponent={
        <React.Fragment>
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
                <FlatList
                  horizontal={true}
                  contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  data={data.authors}
                  keyExtractor={(item, index) => `author-${index}`}
                  renderItem={({item, index}) => (
                    <Fragment>
                      {index > 0 ? (
                        <Text
                          style={{
                            color: color['white-1'],
                          }}>
                          ·
                        </Text>
                      ) : null}
                      <Text
                        style={{
                          marginHorizontal: 12,
                          color: color['white-1'],
                          fontFamily: 'Roboto-Regular',
                        }}>
                        {item.name}
                      </Text>
                    </Fragment>
                  )}
                />
              </Fragment>
            )}
          </Header>
          <View
            style={{
              paddingVertical: 26,
              paddingHorizontal: 21,
              backgroundColor: color['white-0'],
            }}>
            {!loading ? (
              <Fragment>
                {data.audio ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <TouchableOpacity
                      style={{
                        height: 40,
                        backgroundColor: color['white-3'],
                        borderRadius: 40 / 2,
                        marginBottom: 12,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 9,
                      }}
                      onPress={() => {
                        if (isPlaying) {
                          TrackPlayer.pause();
                        } else {
                          (async () => {
                            if (!added) {
                              await TrackPlayer.add([
                                {
                                  url: baseURL + data.audio,
                                  title: data.title,
                                  artwork: baseURL + data.cover,
                                },
                              ]);
                              setAdded(true);
                            }
                            TrackPlayer.play();
                          })();
                        }
                      }}>
                      <View style={{marginLeft: 12}}>
                        {isPlaying ? (
                          <Pause
                            width={14}
                            height={14}
                            fill={color['black-0']}
                          />
                        ) : (
                          <Play
                            width={14}
                            height={14}
                            fill={color['black-0']}
                          />
                        )}
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Roboto-Regular',
                          paddingHorizontal: 12,
                        }}>
                        Audio
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                <Animated.View
                  style={{maxHeight: _heightDesc, overflow: 'hidden'}}>
                  <HTMLView
                    addLineBreaks={false}
                    stylesheet={StyleSheet.create({
                      p: {
                        fontFamily: 'Gotham-Book',
                        color: color['black-1'],
                        lineHeight: 24,
                        textAlign: 'justify',
                        marginVertical: 8,
                      },
                    })}
                    value={data.synopsis}
                  />
                </Animated.View>
                <TouchableOpacity
                  style={{marginTop: 12, marginBottom: 24}}
                  onPress={() => {
                    if (more) {
                      _hideMore();
                    } else {
                      _showMore();
                    }
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Bold',
                      color: color['primary-0'],
                    }}>
                    {more ? 'Less' : 'More'}
                  </Text>
                </TouchableOpacity>
                <FlatList
                  style={{
                    paddingTop: 24,
                    borderTopWidth: 1,
                    borderColor: color['white-1'],
                  }}
                  showsHorizontalScrollIndicator={false}
                  data={data.categories}
                  horizontal={true}
                  keyExtractor={(item, index) => `category-${index}`}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={{
                        marginBottom: 6,
                        marginRight: 6,
                        paddingVertical: 6,
                        paddingHorizontal: 21,
                        backgroundColor: color['primary-1'],
                        borderRadius: 4,
                      }}
                      onPress={() =>
                        navigation.navigate('category', {id: item.id})
                      }>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: color['white-0'],
                        }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </Fragment>
            ) : (
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
            )}
          </View>

          <SectionTitle>Ring</SectionTitle>
        </React.Fragment>
      }
      data={loading ? [{}, {}] : data.babs}
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: color['white-1']}}
      contentContainerStyle={{paddingBottom: 12}}
      keyExtractor={(item, index) => `${index}`}
      renderItem={({item, index}) => (
        <BabList
          title={item.title}
          ring={`${index + 1}/${data.babs?.length}`}
          onPress={() => {
            navigation.navigate('read', {id: item.id});
          }}
        />
      )}
    />
  );
}
