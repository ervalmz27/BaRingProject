import React from 'react';
import {View, Text, TextInput} from 'react-native';
import getColor from '../color';

const TextField = React.forwardRef(
  ({containerStyle, label, style, message, editable = true, ...props}, ref) => {
    const color = getColor();
    return (
      <View style={containerStyle}>
        {label ? (
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              fontSize: 16,
              marginBottom: 4,
              color: color['black-0'],
            }}>
            {label}
          </Text>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor={color['black-1']}
          style={[
            {
              height: 48,
              backgroundColor: editable ? color['white-0'] : color['white-3'],
              fontFamily: 'Poppins-Regular',
              paddingHorizontal: 12,
              color: color['black-0'],
              fontSize: 16,
              lineHeight: 22,
              borderWidth: 1,
              borderColor: color['white-4'],
            },
            style,
          ]}
          editable={editable}
          {...props}
        />
        {message ? (
          <Text
            style={{
              color: color['red-0'],
              fontFamily: 'Roboto-Regular',
              fontSize: 14,
            }}>
            {message}
          </Text>
        ) : null}
      </View>
    );
  },
  [],
);

export default TextField;
