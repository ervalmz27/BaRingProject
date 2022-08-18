import React from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Container from '../components/Container';
import getColor from '../color';
import Heading from '../components/AuthPages/Heading';
import BlockButton from '../components/BlockButton';
import TextField from '../components/TextField';
import {AuthContext} from '../contexts/auth';
import {Controller, useForm} from 'react-hook-form';
import service from '../service';
import BlockAlert from '../components/BlockAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseURL} from '../config';

export default function Login({navigation}) {
  const color = getColor();
  const [fail, setFail] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [splash, setSplash] = React.useState(false);
  const [payload, setPayload] = React.useState(null);
  const [logo, setLogo] = React.useState(false);
  const {dispatchAuth} = React.useContext(AuthContext);
  const {control, handleSubmit} = useForm();
  const _proceedLogin = ({username, password}) => {
    setLoading(true);
    service
      .get('/auth/user/get-token', {
        params: {
          username,
          password,
        },
      })
      .then(response => {
        (async () => {
          setLoading(false);
          setFail(false);
          const {token, fullname, id, partner_id: partnerId} = response.data;
          await AsyncStorage.setItem('@token', token);
          await AsyncStorage.setItem('@fullname', fullname);
          await AsyncStorage.setItem('@id', `${id}`);
          if (partnerId) {
            await AsyncStorage.setItem('@partnerId', `${partnerId}`);
            setLogo(`${baseURL}/api/stream/partner-logo/${partnerId}`);
          } else {
            setLogo(`${baseURL}/base-logo.png`);
          }
          setSplash(true);
          setPayload({token, fullname, id});
          return;
        })();
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
        if (e.response?.status === 401) {
          setFail(true);
        }
      });
  };

  React.useEffect(() => {
    if (splash && payload) {
      navigation.setOptions({headerShown: false});
      let timeout = setTimeout(() => {
        dispatchAuth({type: 'login', ...payload});
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [payload, splash]);

  if (splash) {
    return (
      <View
        style={{
          backgroundColor: color['primary-0'],
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <StatusBar
          backgroundColor={color['primary-1']}
          barStyle="light-content"
        />
        {logo ? (
          <Image
            source={{uri: logo}}
            style={{width: 200, height: 200, resizeMode: 'contain'}}
          />
        ) : null}
      </View>
    );
  }
  return (
    <React.Fragment>
      <StatusBar
        backgroundColor={color['primary-0']}
        barStyle="light-content"
      />
      <Container>
        <Heading
          title="Login"
          subtitle="Masuk ke akun baring anda untuk memulai"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 20}
          enabled={Platform.OS === 'ios'}
          style={{
            paddingHorizontal: 21,
            paddingVertical: 32,
            flex: 1,
          }}>
          {fail ? (
            <BlockAlert
              style={{marginBottom: 12}}
              textStyle={{textAlign: 'center'}}>
              Username atau password anda salah
            </BlockAlert>
          ) : null}
          <Controller
            name="username"
            control={control}
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <TextField
                value={value}
                onChangeText={text => onChange(text)}
                placeholder="Username"
                containerStyle={{
                  marginBottom: 14,
                }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <TextField
                placeholder="Password"
                containerStyle={{
                  marginBottom: 14,
                }}
                secureTextEntry={true}
                value={value}
                onChangeText={text => onChange(text)}
              />
            )}
          />
          <BlockButton onPress={handleSubmit(_proceedLogin)}>
            {loading ? (
              <ActivityIndicator color={color['black-0']} size="small" />
            ) : (
              'Masuk'
            )}
          </BlockButton>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  fontSize: 16,
                  color: color['black-1'],
                }}>
                Lupa Password?
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <View
          style={{
            borderTopWidth: 1,
            borderColor: color['white-4'],
            padding: 21,
          }}>
          <BlockButton
            onPress={() => navigation.navigate('register')}
            style={{backgroundColor: color['black-0']}}
            textStyle={{color: color['white-0']}}>
            Buat Akun Baru
          </BlockButton>
        </View>
      </Container>
    </React.Fragment>
  );
}
