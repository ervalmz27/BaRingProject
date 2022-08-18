import {SelectableText} from '@astrocoders/react-native-selectable-text';
import Slider from '@react-native-community/slider';
import React, {Fragment} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import TrackPlayer, {
  Event,
  State,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Next from '../assets/icons/Next.svg';
import Pause from '../assets/icons/Pause.svg';
import Play from '../assets/icons/Play.svg';
import Prev from '../assets/icons/Prev.svg';
import getColor from '../color';
import BabList from '../components/BabList';
import BookList from '../components/BookList';
import Header from '../components/Header';
import {baseURL} from '../config';
import service from '../service';

const leadingZero = value => {
  if (value < 10) {
    return `0${value}`;
  }
  return `${value}`;
};

const parsingSeconds = data => {
  let seconds = Math.floor(data);
  let minutes = Math.floor(data / 60);
  seconds = seconds - minutes * 60;
  let result = `${leadingZero(minutes)}:${leadingZero(seconds)}`;
  if (minutes > 59) {
    let hours = Math.floor(minutes / 60);
    minutes = minutes - hours * 60;
    result = `${leadingZero(hours)}:${leadingZero(minutes)}:${leadingZero(
      seconds,
    )}`;
  }

  return result;
};

const getIndex = (data, list = [], indexing = 'id') => {
  const getIndex = list.findIndex(el => el[indexing] === data);
  return getIndex;
};
const getPoint = (data, list = [], indexing = 'id') => {
  const getIndex = list.findIndex(el => el[indexing] === data);
  return `${getIndex + 1}/${list.length}`;
};

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackTrackChanged,
];

export default function Read({navigation, route}) {
  const {id} = route.params;
  const [loading, setLoading] = React.useState(false);
  const [queue, setQueue] = React.useState(false);
  const [data, setData] = React.useState({});
  const [body, setBody] = React.useState('');
  const [playerState, setPlayerState] = React.useState(null);
  const color = getColor();
  const _scrollY = React.useRef(new Animated.Value(0)).current;
  const _titleOpacity = _scrollY.interpolate({
    inputRange: [0, 70, 80],
    outputRange: [0, 0, 1],
  });
  const _barOpacity = _scrollY.interpolate({
    inputRange: [0, 70, 80],
    outputRange: [0, 0, 1],
  });
  const [isSeeking, setIsSeeking] = React.useState(false);

  const {position, duration} = useProgress();

  useTrackPlayerEvents(events, event => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      setPlayerState(event.state);
    }
    if (event.type === Event.PlaybackTrackChanged) {
      if (event.nextTrack >= 0) {
        navigation.navigate('read', {
          id: data.content?.babs[event.nextTrack].id,
        });
      }
    }
  });

  const isPlaying = playerState === State.Playing;
  let listIndex = 1;

  const renderNode = React.useCallback(
    (node, index, siblings, parent, defaultRenderer) => {
      if (node.name == 'p') {
        return (
          <SelectableText
            key={`${index}`}
            menuItems={['Add to Clipper']}
            style={{
              fontFamily: 'Gotham-Book',
              color: getColor()['black-1'],
              lineHeight: 24,
              marginVertical: 8,
              marginHorizontal: 21,
            }}
            onSelection={({
              eventType,
              content,
              selectionStart,
              selectionEnd,
            }) => {
              if (eventType === 'Add to Clipper') {
                service
                  .post('/clip', {
                    bab_id: id,
                    body: content,
                  })
                  .then(() => {})
                  .catch(() => {});
              }
            }}
            value={node.children?.map((item, index) => item.data)}
          />
        );
      } else if (node.name === 'ul' || node.name === 'ol') {
        listIndex = 1;
        return (
          <View style={{flexDirection: 'column'}} key={`${index}`}>
            {defaultRenderer(node.children, parent)}
          </View>
        );
      } else if (node.name === 'li') {
        let bullet = '\u2022';
        if (node.parent.name === 'ol') {
          bullet = `${listIndex}.`;
          listIndex = listIndex + 1;
        }
        return (
          <View
            style={{
              marginHorizontal: 21,
              marginLeft: 40,
              flexDirection: 'row',
            }}
            key={`${index}`}>
            <Text
              style={{
                marginRight: 12,
                textAlign: 'right',
                lineHeight: 24,
                color: getColor()['black-1'],
              }}>
              {bullet}
            </Text>
            <Text
              style={{
                fontFamily: 'Gotham-Book',
                color: getColor()['black-1'],
                lineHeight: 24,
              }}>
              {defaultRenderer(node.children, parent)}
            </Text>
          </View>
        );
      }
    },
    [id],
  );

  const getData = (
    beforeLoad = () => {},
    onSuccess = () => {},
    onError = () => {},
  ) => {
    beforeLoad();
    service
      .get(`/bab/${id}/read`)
      .then(response => {
        onSuccess(response);
      })
      .catch(() => {
        onError();
      });
  };

  React.useEffect(() => {
    getData(
      () => setLoading(true),
      response => {
        setLoading(false);
        setData(response.data);
      },
      () => setLoading(false),
    );
  }, [id]);

  React.useEffect(() => {
    return () => {
      if (queue) {
        TrackPlayer.reset();
      }
    };
  }, [queue]);

  React.useEffect(() => {
    if (data.title) {
      navigation.setOptions({
        title: data.title,
        headerTitleStyle: {
          fontFamily: 'Poppins-Bold',
          fontSize: 16,
          marginBottom: -2,
          opacity: _titleOpacity,
        },
      });
      if (!queue) {
        (async () => {
          const trackQueue = [];
          const currentIndex = getIndex(id, data.content?.babs);
          for (let track of data.content?.babs) {
            trackQueue.push({
              url: baseURL + track.audio,
              title: track.title,
              artist: data.content?.title,
              artwork: baseURL + data.content?.cover,
            });
          }
          await TrackPlayer.add(trackQueue);
          await TrackPlayer.skip(currentIndex);
          setQueue(true);
        })();
      }
    }
    if (data.body) {
      setBody(data.body);
    }
  }, [data]);
  return (
    <View style={{flex: 1}}>
      <Animated.FlatList
        data={[]}
        style={{
          flex: 1,
          backgroundColor: color['white-1'],
        }}
        contentContainerStyle={{
          backgroundColor: color['white-0'],
        }}
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
        ListHeaderComponent={
          <Fragment>
            <Header style={{marginBottom: 21}}>
              {loading ? (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item
                    width="30%"
                    height={14}
                    borderRadius={6}
                  />
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
                      color: color['white-1'],
                      fontFamily: 'Roboto-Regular',
                    }}>
                    Ring {getPoint(data.id, data.content?.babs || [])}
                  </Text>
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
            {body ? (
              <HTMLView
                addLineBreaks={false}
                renderNode={renderNode}
                value={body.replace('&nbsp;', ' ')}
                textComponentProps={{selectable:true}}
              />
            ) : (
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
            )}
          </Fragment>
        }
        ListFooterComponent={
          <View
            style={{
              paddingVertical: 21,
              backgroundColor: color['white-1'],
              marginTop: 21,
            }}>
            <BookList
              onPress={() =>
                navigation.navigate('detail', {id: data.content?.id})
              }
              title={!loading && data.content?.title}
              cover={!loading && data.content?.cover}
              ring={(!loading && data.content?.babs?.length) || 0}
            />
            <FlatList
              data={loading ? [{}, {}] : data.content?.babs}
              keyExtractor={(item, index) => `ring-${index}`}
              renderItem={({item, index}) => (
                <BabList
                  title={item.title}
                  ring={`${index + 1}/${data.content?.babs?.length}`}
                  onPress={() => {
                    TrackPlayer.skip(index);
                  }}
                />
              )}
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        renderItem={() => null}
      />
      {loading ? null : (
        <View
          style={{
            position: 'relative',
            borderTopWidth: 1,
            borderColor: color['white-4'],
            backgroundColor: color['white-0'],
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 9,
              paddingVertical: 9,
              flexDirection: 'row',
              marginTop: 16,
            }}>
            <TouchableOpacity
              style={{padding: 15}}
              onPress={() => {
                const index = getIndex(data.id, data.content?.babs, 'id');
                if (index > 0) {
                  TrackPlayer.skipToPrevious();
                }
              }}>
              <Prev fill={color['black-0']} width={12} height={12} />
            </TouchableOpacity>
            {!isPlaying ? (
              <TouchableOpacity
                style={{padding: 12}}
                onPress={async () => {
                  await TrackPlayer.play();
                }}>
                <Play fill={color['black-0']} width={18} height={18} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{padding: 12}}
                onPress={async () => {
                  await TrackPlayer.pause();
                }}>
                <Pause fill={color['black-0']} width={18} height={18} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{padding: 15, marginRight: 'auto'}}
              onPress={() => {
                const index = getIndex(data.id, data.content?.babs, 'id');
                if (index + 1 < data.content?.babs?.length) {
                  TrackPlayer.skipToNext();
                }
              }}>
              <Next fill={color['black-0']} width={12} height={12} />
            </TouchableOpacity>
            <Text
              style={{
                paddingHorizontal: 12,
                color: color['black-1'],
                fontFamily: 'Roboto-Regular',
              }}>
              {parsingSeconds(position)} / {parsingSeconds(duration)}
            </Text>
          </View>
          <Slider
            style={{
              position: 'absolute',
              top: 4,
              left: 0,
              right: 0,
            }}
            onSlidingStart={() => {
              setIsSeeking(true);
            }}
            onSlidingComplete={async e => {
              setIsSeeking(false);
              await TrackPlayer.seekTo((e / 100) * duration);
            }}
            value={
              isSeeking
                ? null
                : duration
                ? ((position || 1) / duration) * 100
                : 0
            }
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor={color['primary-1']}
            maximumTrackTintColor="#000000"
            thumbTintColor={color['secondary-0']}
          />
        </View>
      )}
    </View>
  );
}
