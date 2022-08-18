import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ActivityIndicator, View} from 'react-native';
import getColor from '../color';
import BlockButton from '../components/BlockButton';
import Star from '../components/Star';
import TextField from '../components/TextField';
import service from '../service';
export default function ComposeReview({route, navigation}) {
  const {id} = route.params;
  const color = getColor();
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = React.useState(false);

  const sendReview = ({body, star}) => {
    setLoading(true);
    service
      .post('/review/' + id, {
        star,
        body,
      })
      .then(response => {
        setLoading(false);
        navigation.goBack();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <View style={{backgroundColor: color['white-1']}}>
      <View style={{padding: 21, backgroundColor: color['white-0']}}>
        <Controller
          name="star"
          control={control}
          render={({field: {value, onChange}}) => (
            <Star count={value} onChange={onChange} />
          )}
        />
        <Controller
          name="body"
          control={control}
          render={({field: {value, onChange}}) => (
            <TextField
              containerStyle={{marginTop: 16}}
              style={{height: null, minHeight: 49, maxHeight: 140}}
              multiline
              placeholder="Tulis disini..."
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <BlockButton
          style={{marginTop: 12}}
          onPress={handleSubmit(sendReview)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={color['black-0']} />
          ) : (
            'Kirim'
          )}
        </BlockButton>
      </View>
    </View>
  );
}
