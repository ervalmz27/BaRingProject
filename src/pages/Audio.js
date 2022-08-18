import React from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import TrackPlayer, {
  Event,
  State,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Pause from '../assets/icons/Pause.svg';
import Play from '../assets/icons/Play.svg';
import getColor from '../color';
import Slider from '@react-native-community/slider';

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

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackTrackChanged,
];

export default function Audio({navigation, route}) {
  const {uri, title, cover, courseTitle} = route.params;
  const color = getColor();
  const [queue, setQueue] = React.useState(false);
  const [playerState, setPlayerState] = React.useState(null);
  const [isSeeking, setIsSeeking] = React.useState(false);

  const {position, duration} = useProgress();

  useTrackPlayerEvents(events, event => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      setPlayerState(event.state);
    }
  });

  const isPlaying = playerState === State.Playing;

  React.useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        elevation: 0,
        backgroundColor: color['white-1'],
      },
      headerTintColor: color['primary-0'],
    });
  }, []);

  React.useEffect(() => {
    return () => {
      if (queue) {
        TrackPlayer.reset();
      }
    };
  }, [queue]);

  React.useEffect(() => {
    if (!queue) {
      (async () => {
        const trackQueue = [];
        trackQueue.push({
          url: uri,
          title: title,
          artist: courseTitle,
          artwork: cover,
        });
        await TrackPlayer.add(trackQueue);
        setQueue(true);
      })();
    }
  }, [uri]);
  return (
    <View style={{flex: 1, backgroundColor: color['white-1']}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 32,
          flex: 1,
        }}>
        <Image
          source={{uri: cover}}
          style={{
            width: (Dimensions.get('screen').width * 50) / 100,
            height: (Dimensions.get('screen').width * 50) / 100,
            resizeMode: 'cover',
            borderRadius: (Dimensions.get('screen').width * 50) / 100 / 2,
          }}
        />
        <Text
          style={{
            fontFamily: 'Poppins-Bold',
            fontSize: 18,
            color: color['black-0'],
            marginTop: 32,
          }}
          numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            fontSize: 14,
            color: color['black-0'],
          }}
          numberOfLines={1}>
          {courseTitle}
        </Text>
      </View>
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
            justifyContent: 'space-between',
            paddingHorizontal: 9,
            paddingVertical: 9,
            flexDirection: 'row',
            marginTop: 16,
          }}>
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
            isSeeking ? null : duration ? ((position || 1) / duration) * 100 : 0
          }
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor={color['primary-1']}
          maximumTrackTintColor="#000000"
          thumbTintColor={color['secondary-0']}
        />
      </View>
    </View>
  );
}
