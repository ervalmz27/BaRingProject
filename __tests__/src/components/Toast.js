import React, {Fragment} from 'react';
import {Animated, DeviceEventEmitter, Text} from 'react-native';
import getColor from '../color';

export default function Toast({children}) {
  const color = getColor();
  const [text, setText] = React.useState('');
  const [colorType, setColorType] = React.useState(color['red-0']);
  const _opacity = React.useRef(new Animated.Value(0)).current;

  const fadeIn = (callback = () => {}) => {
    Animated.timing(_opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      callback();
    });
  };
  const fadeOut = (callback = () => {}) => {
    Animated.timing(_opacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      callback();
    });
  };

  React.useEffect(() => {
    if (text) {
      const timeout = setTimeout(() => {
        fadeOut(() => {
          setText('');
        });
      }, 3000);

      fadeIn();

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [text]);

  React.useEffect(() => {
    const listen = DeviceEventEmitter.addListener(
      'toast',
      ({text, type = 'error'}) => {
        setColorType(type === 'error' ? color['red-0'] : color['green-0']);
        setText(text);
      },
    );

    return () => {
      listen.remove();
    };
  }, []);

  return (
    <Fragment>
      {children}
      {text ? (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            padding: 18,
            backgroundColor: colorType,
            borderRadius: 8,
            opacity: _opacity,
          }}>
          <Text
            style={{
              color: color['white-0'],
              fontFamily: 'Roboto-Bold',
              textAlign: 'center',
            }}>
            {text}
          </Text>
        </Animated.View>
      ) : null}
    </Fragment>
  );
}
