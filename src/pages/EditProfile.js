import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import getColor from '../color';
import CustomModal from '../components/CustomModal';
import TextField from '../components/TextField';
import {baseURL} from '../config';
import errorMessage from '../error-message';
import ImagePicker from 'react-native-image-crop-picker';
import service from '../service';
import axios from 'axios';
import BlockButton from '../components/BlockButton';

export default function EditProfile({route}) {
  const color = getColor();
  const [data, setData] = React.useState(route.params.data);
  const _modal = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const _cancel = React.useRef(null);
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      avatar: {},
      fullname: data.fullname,
    },
  });

  const onSubmit = ({fullname, avatar}) => {
    _cancel.current = axios.CancelToken.source();
    const formData = new FormData();
    formData.append('fullname', fullname);

    if (avatar.path) {
      formData.append('avatar', {
        type: avatar.mime,
        uri: avatar.path,
        name: avatar.path.split('/').pop(),
      });
    }

    setLoading(true);
    service
      .put('/user/change-profile', formData, {
        cancelToken: _cancel.current.token,
      })
      .then(response => {
        setData(response.data);
        setLoading(false);
        reset({
          avatar: {},
          fullname,
        });
        DeviceEventEmitter.emit('toast', {
          text: 'Profile berhasil diperbaharui',
          type: 'success',
        });
        DeviceEventEmitter.emit('update', {});
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onGallery = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      setValue('avatar', image);
      _modal.current.hide();
    });
  };

  const onCamera = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      setValue('avatar', image);
      _modal.current.hide();
    });
  };

  const onCancel = React.useCallback(() => {
    if (loading) {
      _cancel.current.cancel();
    }
  }, [loading]);

  React.useEffect(() => {
    return onCancel;
  }, [loading]);
  return (
    <React.Fragment>
      <View style={{flex: 1, backgroundColor: color['white-1']}}>
        <Controller
          name="avatar"
          control={control}
          render={({field: {value}}) => (
            <View
              style={{alignItems: 'center', marginTop: 32, marginBottom: 18}}>
              <Image
                source={{uri: value.path || baseURL + data.avatar}}
                style={{width: 160, height: 160, resizeMode: 'contain'}}
              />
              <Text
                onPress={() => _modal.current.show()}
                style={{
                  padding: 6,
                  paddingHorizontal: 12,
                  fontSize: 16,
                  fontFamily: 'Roboto-Bold',
                  color: color['primary-0'],
                }}>
                Ganti
              </Text>
            </View>
          )}
        />
        <TextField
          value={data.username}
          editable={false}
          containerStyle={{
            marginHorizontal: 21,
            marginBottom: 14,
          }}
          label="Username"
        />
        <TextField
          value={data.email}
          editable={false}
          containerStyle={{
            marginHorizontal: 21,
            marginBottom: 14,
          }}
          label="Email"
        />
        <Controller
          control={control}
          name="fullname"
          rules={{required: errorMessage.required}}
          render={({field: {value, onChange}}) => (
            <TextField
              value={value}
              onChangeText={onChange}
              containerStyle={{
                marginHorizontal: 21,
                marginBottom: 14,
              }}
              label="Nama"
              message={errors.email?.message}
            />
          )}
        />
        
        <BlockButton
          onPress={handleSubmit(onSubmit)}
          style={{marginHorizontal: 21}}>
          {loading ? (
            <ActivityIndicator color={color['black-0']} size="small" />
          ) : (
            'Simpan'
          )}
        </BlockButton>
      </View>
      <CustomModal ref={_modal}>
        <TouchableOpacity
          style={{
            height: 48,
            borderWidth: 1,
            borderColor: color['white-4'],
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}
          onPress={() => onGallery()}>
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              fontSize: 16,
              color: color['black-1'],
            }}>
            Pilih Dari Galeri
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onCamera()}
          style={{
            height: 48,
            borderWidth: 1,
            borderColor: color['white-4'],
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              fontSize: 16,
              color: color['black-1'],
            }}>
            Kamera
          </Text>
        </TouchableOpacity>
      </CustomModal>
    </React.Fragment>
  );
}