import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {Text, View} from 'react-native';
import getColor from '../color';

export default function SelectPicker({
  value,
  options = [],
  onValueChange = () => {},
  label,
  containerStyle,
  message,
}) {
  const color = getColor();
  const [selected, setSelected] = React.useState(value);
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
      <View
        style={{
          borderWidth: 1,
          borderColor: color['white-4'],
        }}>
        <Picker
          selectedValue={selected}
          style={{
            backgroundColor: color['white-0'],
            fontFamily: 'Poppins-Regular',
            color: color['black-0'],
          }}
          onValueChange={itemValue => {
            setSelected(itemValue);
            onValueChange(itemValue);
          }}>
          <Picker.Item label="--- Pilih ---" value="" />
          {options.map((item, index) => (
            <Picker.Item
              label={item.label}
              value={item.value}
              key={`${index}`}
            />
          ))}
        </Picker>
      </View>
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
}
