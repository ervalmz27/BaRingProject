import React from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';

const CustomModal = React.forwardRef(({children}, ref) => {
  const [show, setShow] = React.useState(false);
  const _translateY = React.useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current;

  const slideUp = () => {
    Animated.timing(_translateY, {
      toValue: 56,
      useNativeDriver: true,
      duration: 350,
    }).start();
  };
  const slideDown = () => {
    Animated.timing(_translateY, {
      toValue: Dimensions.get('window').height,
      useNativeDriver: true,
      duration: 350,
    }).start(() => {
      setShow(false);
    });
  };

  React.useEffect(() => {
    if (show) {
      slideUp();
    }
  }, [show]);

  React.useImperativeHandle(
    ref,
    () => ({
      show: () => {
        setShow(true);
      },
      hide: () => {
        slideDown();
      },
    }),
    [],
  );

  return (
    <Modal
      transparent={true}
      statusBarTranslucent={true}
      visible={show}
      onRequestClose={() => {
        slideDown();
      }}>
      <View style={{flex: 1}}>
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
        <Animated.View
          style={{
            height: Dimensions.get('window').height,
            transform: [{translateY: _translateY}],
          }}>
          <TouchableOpacity
            activeOpacity={0}
            onPress={() => slideDown()}
            style={{
              opacity: 0,
              flex: 1,
            }}
          />
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              paddingHorizontal: 18,
              paddingVertical: 28,
              maxHeight: (80 / 100) * Dimensions.get('window').height,
            }}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});

export default CustomModal;
