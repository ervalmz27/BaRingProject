import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video'; /// alreadyimported this
import Icon from 'react-native-vector-icons/FontAwesome5'; // and this
import Orientation from 'react-native-orientation';
import Slider from '@react-native-community/slider';
const {width} = Dimensions.get('window');
export default class App extends React.Component {
  constructor(p) {
    super(p);
    this.state = {
      currentTime: 0,
      duration: 0.1,
      paused: false,
      overlay: false,
      fullscreen: false,
      quality: {type: 'auto'},
    };
  }

  lastTap = null;

  handleDoubleTap = (doubleTapCallback, singleTapCallback) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY) {
      clearTimeout(this.timer);
      doubleTapCallback();
    } else {
      this.lastTap = now;
      this.timer = setTimeout(() => {
        singleTapCallback();
      }, DOUBLE_PRESS_DELAY);
    }
  };

  getTime = t => {
    const digit = n => (n < 10 ? `0${n}` : `${n}`);
    // const t = Math.round(time);
    const sec = digit(Math.floor(t % 60));
    const min = digit(Math.floor((t / 60) % 60));
    const hr = digit(Math.floor((t / 3600) % 60));
    return hr + ':' + min + ':' + sec; // this will convert sec to timer string
    // 33 -> 00:00:33
    // this is done here
    // ok now the theme is good to look
  };

  load = ({duration}) => this.setState({duration}); // now here the duration is update on load video
  progress = ({currentTime}) => this.setState({currentTime}); // here the current time is upated

  backward = () => {
    this.video.seek(this.state.currentTime - 5);
    clearTimeout(this.overlayTimer);

    this.overlayTimer = setTimeout(() => this.setState({overlay: false}), 3000);
  };
  forward = () => {
    this.video.seek(this.state.currentTime + 10); // here the video is seek to 5 sec forward
    clearTimeout(this.overlayTimer);

    this.overlayTimer = setTimeout(() => this.setState({overlay: false}), 3000);
  };

  onslide = slide => {
    this.video.seek(slide * this.state.duration); // here the upation is maked for video seeking
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({overlay: false}), 3000);
  };

  youtubeSeekLeft = () => {
    const {currentTime} = this.state;
    this.handleDoubleTap(
      () => {
        this.video.seek(currentTime - 5);
      },
      () => {
        this.setState({overlay: true});
        this.overlayTimer = setTimeout(
          () => this.setState({overlay: false}),
          3000,
        );
      },
    );
  };
  youtubeSeekRight = () => {
    const {currentTime} = this.state;
    this.handleDoubleTap(
      () => {
        // this fn is usecurrentTime + 5d to detect the double tap first callback
        this.video.seek(currentTime + 10);
      },
      () => {
        this.setState({overlay: true});
        this.overlayTimer = setTimeout(
          () => this.setState({overlay: false}),
          3000,
        );
      },
    );
  };

  fullscreen = () => {
    const {fullscreen} = this.state;
    if (fullscreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
    this.setState({fullscreen: !fullscreen});
  };
  render = () => {
    const {
      currentTime,
      duration,
      paused,
      overlay,
      fullscreen,
      onmodal,
      quality,
    } = this.state;

    return (
      <View style={style.container}>
        <View style={fullscreen ? style.fullscreenVideo : style.video}>
          <Video
            fullscreen={fullscreen}
            paused={paused} // this will manage the pause and play
            ref={ref => {
              this.video = ref;
            }}
            source={{uri: this.props.route.params.uri}}
            style={{...StyleSheet.absoluteFill}}
            resizeMode="cover"
            onLoad={this.load}
            onProgress={this.progress}
            // onVideoEnd={this.onEndVideo}
            selectedVideoTrack={quality}
          />
          <View style={style.overlay}>
            {/* now we can remove this not */}
            {overlay ? (
              <>
                <Icon
                  name="cog"
                  size={24}
                  color="white"
                  onPress={() => {
                    this.setState({onmodal: !onmodal});
                  }}
                  style={{position: 'absolute', right: 10, top: 10, zIndex: 10}}
                />
                {onmodal ? (
                  <View style={style.quality}>
                    <Text>Kualitas Video</Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          quality: {type: 'resolution', value: 720},
                          onmodal: !onmodal,
                        });
                      }}>
                      <Text>720p</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          quality: {type: 'resolution', value: 480},
                          onmodal: !onmodal,
                        });
                      }}>
                      <Text>480p</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          quality: {type: 'resolution', value: 360},
                          onmodal: !onmodal,
                        });
                      }}>
                      <Text>360p</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          quality: {type: 'resolution', value: 240},
                          onmodal: !onmodal,
                        });
                      }}>
                      <Text>240p</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                <View style={{...style.overlaySet, backgroundColor: '#0006'}}>
                  <Icon
                    name="backward"
                    style={style.icon}
                    onPress={this.backward}
                  />
                  <Icon
                    name={paused ? 'play' : 'pause'}
                    style={style.icon}
                    onPress={() => this.setState({paused: !paused})}
                  />
                  <Icon
                    name="forward"
                    style={style.icon}
                    onPress={this.forward}
                  />
                  <View style={style.sliderCont}>
                    <View style={style.timer}>
                      <Text style={{color: 'white'}}>
                        {this.getTime(currentTime)}
                      </Text>
                      <Text style={{color: 'white'}}>
                        {this.getTime(duration)}
                        {'   '}
                        <Icon
                          onPress={this.fullscreen}
                          name={fullscreen ? 'compress' : 'expand'}
                          style={{fontSize: 15, marginHorizontal: 5}}
                        />
                        {'   '}
                      </Text>
                    </View>
                    <Slider
                      // we want to add some param here
                      maximumTrackTintColor="white"
                      minimumTrackTintColor="white"
                      thumbTintColor="white" // now the slider and the time will work
                      value={currentTime / duration} // slier input is 0 - 1 only so we want to convert sec to 0 - 1
                      onValueChange={this.onslide}
                    />
                  </View>
                </View>
              </>
            ) : (
              <View style={style.overlaySet}>
                <TouchableNativeFeedback onPress={this.youtubeSeekLeft}>
                  <View style={{flex: 1}} />
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.youtubeSeekRight}>
                  <View style={{flex: 1}} />
                </TouchableNativeFeedback>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlaySet: {
    flex: 1,
    flexDirection: 'row',
  },
  quality: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    position: 'absolute',
    right: 10,
    top: 40,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'white',
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 25,
  },
  sliderCont: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  timer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginHorizontal: 2,
  },
  video: {
    marginVertical: width * 0.5,
    width,
    height: width * 0.6,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    backgroundColor: 'black',
    ...StyleSheet.absoluteFill,
    elevation: 1,
  },
});
