import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import getColor from '../color';
import Heading from '../components/AuthPages/Heading';
import BlockButton from '../components/BlockButton';
import Container from '../components/Container';
import TextField from '../components/TextField';
import {AuthContext} from '../contexts/auth';
import errorMessage from '../error-message';
import service from '../service';
import axios from 'axios';
import {baseURL} from '../config';

export default function Register() {
  const color = getColor();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const {dispatchAuth} = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [userName, setUserName] = React.useState('');
  const [fullname, setFullname] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');

  // const _proceedRegister = ({username, fullname, password, email}) => {
  //   setLoading(true);
  //   service
  //     .post('/auth/user/register', {
  //       username,
  //       fullname,
  //       password,
  //       email,
  //     })
  //     .then(response => {
  //       console.log(response)(async () => {
  //         setLoading(false);
  //         const {token, fullname, id, subscriber} = response.data;
  //         await AsyncStorage.setItem('@token', token);
  //         await AsyncStorage.setItem('@fullname', fullname);
  //         await AsyncStorage.setItem('@id', `${id}`);
  //         await AsyncStorage.setItem(
  //           '@subscriber',
  //           subscriber ? 'true' : 'false',
  //         );
  //         dispatchAuth({type: 'login', token, fullname, id, subscriber});
  //         return;
  //       })();
  //     })
  //     .catch(e => {
  //       console.log('Messagae', e);
  //       setLoading(false);
  //     });
  // };

  const _proceedRegister = (usname, flname, pw, em) => {
    fetch('https://api.app.baring.digital/api/auth/user/register', {
      method: 'POST',
      body: JSON.stringify({
        username: usname,
        fullname: flname,
        password: pw,
        email: em,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async json => {
        setLoading(true);
        console.log(json);
        const {token, fullname, id, subscriber} = json;
        await AsyncStorage.setItem('@token', token);
        await AsyncStorage.setItem('@fullname', fullname);
        await AsyncStorage.setItem('@id', `${id}`);
        await AsyncStorage.setItem(
          '@subscriber',
          subscriber ? 'true' : 'false',
        );
        dispatchAuth({type: 'login', token, fullname, id, subscriber});
        setLoading(false);
        return;
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  };

  return (
    <Container>
      <Heading
        title="Buat Akun"
        subtitle="Buat akun baring anda untuk memulai"
      />
      <ScrollView>
        <Controller
          control={control}
          name="fullname"
          rules={{required: errorMessage.required}}
          render={({field: {value, onChange}}) => (
            <TextField
              value={value}
              onChangeText={text => {
                onChange(text);
                setFullname(text);
              }}
              containerStyle={{
                marginTop: 32,
                marginHorizontal: 21,
                marginBottom: 14,
              }}
              label="Nama Lengkap"
              message={errors.fullname?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="username"
          rules={{required: errorMessage.required}}
          render={({field: {value, onChange}}) => (
            <TextField
              value={value}
              onChangeText={text => {
                onChange(text);
                setUserName(text);
              }}
              containerStyle={{
                marginHorizontal: 21,
                marginBottom: 14,
              }}
              label="Username"
              message={errors.username?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          rules={{
            required: errorMessage.required,
            pattern: {
              value:
                /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
              message: errorMessage.emailInvalid,
            },
          }}
          render={({field: {value, onChange}}) => (
            <TextField
              value={value}
              onChangeText={text => {
                onChange(text);
                setEmail(text);
              }}
              containerStyle={{
                marginHorizontal: 21,
                marginBottom: 14,
              }}
              label="Email"
              message={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{
            required: errorMessage.required,
          }}
          render={({field: {value, onChange}}) => (
            <TextField
              secureTextEntry={true}
              value={value}
              onChangeText={text => {
                onChange(text);
                setPassword(text);
              }}
              containerStyle={{
                marginHorizontal: 21,
                marginBottom: 14,
              }}
              label="Password"
              message={errors.password?.message}
            />
          )}
        />
        <BlockButton
          onPress={() => {
            _proceedRegister(userName, fullname, password, email);
          }}
          style={{marginHorizontal: 21, marginTop: 14, marginBottom: 32}}>
          {loading ? (
            <ActivityIndicator color={color['black-0']} size="small" />
          ) : (
            'Mendaftar'
          )}
        </BlockButton>
      </ScrollView>
    </Container>
  );
}
