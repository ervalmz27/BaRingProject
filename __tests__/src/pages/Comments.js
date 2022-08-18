import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ActivityIndicator, FlatList, Modal, Text, View} from 'react-native';
import getColor from '../color';
import BlockButton from '../components/BlockButton';
import CommentList from '../components/CommentList';
import TextField from '../components/TextField';
import service from '../service';
export default function Comments({route, navigation}) {
  const color = getColor();
  const [comments, setComments] = React.useState([{}, {}, {}, {}]);
  const [sending, setSending] = React.useState(false);
  const {id} = route.params;
  const {control, handleSubmit, reset} = useForm();

  const send = ({body}) => {
    setSending(true);
    service
      .post('/comment/' + id, {
        body,
      })
      .then(response => {
        reset({});
        setSending(false);
        setComments(value => value.concat([response.data]));
      })
      .catch(e => {
        setSending(false);
      });
  };

  const _getData = () => {
    service
      .get('/comment/' + id)
      .then(response => {
        console.log(response.data);
        setComments(response.data);
      })
      .catch(e => {});
  };

  React.useEffect(() => {
    _getData();
  }, []);
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={comments}
        keyExtractor={(item, index) => `${index}`}
        style={{flex: 1, backgroundColor: color['white-1']}}
        contentContainerStyle={{
          padding: 12,
          paddingHorizontal: 21,
        }}
        ListEmptyComponent={
          <Text
            style={{padding: 21, color: color['black-0'], textAlign: 'center'}}>
            Belum ada
          </Text>
        }
        renderItem={({item}) => (
          <CommentList
            id={item.id}
            name={item.user?.fullname}
            body={item.body}
            replies={Number(item.replies_count)}
          />
        )}
      />
      <View
        style={{
          backgroundColor: color['white-0'],
          padding: 12,
          paddingHorizontal: 21,
        }}>
        <Controller
          control={control}
          name="body"
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <TextField
              value={value}
              style={{height: null, minHeight: 48, maxHeight: 120}}
              multiline
              onChangeText={onChange}
              placeholder="Tulis disini..."
            />
          )}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 12,
            justifyContent: 'flex-end',
          }}>
          <BlockButton
            style={{paddingHorizontal: 12, height: 38}}
            onPress={handleSubmit(send)}>
            Kirim
          </BlockButton>
        </View>
      </View>
      <Modal transparent={true} visible={sending}>
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
    </View>
  );
}
