import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ActivityIndicator, ScrollView} from 'react-native';
import getColor from '../color';
import Heading from '../components/AuthPages/Heading';
import BlockButton from '../components/BlockButton';
import Container from '../components/Container';
import TextField from '../components/TextField';
import {AuthContext} from '../contexts/auth';
import errorMessage from '../error-message';
import service from '../service';

export default function Register() {
  const color = getColor();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const {dispatchAuth} = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);

  const _proceedRegister = ({username, fullname, password, email}) => {
    setLoading(true);
    service
      .post('/auth/user/register', {
        username,
        password,
        fullname,
        email,
      })
      .then(response => {
        (async () => {
          setLoading(false);
          const {token, fullname, id, subscriber} = response.data;
          await AsyncStorage.setItem('@token', token);
          await AsyncStorage.setItem('@fullname', fullname);
          await AsyncStorage.setItem('@id', `${id}`);
          await AsyncStorage.setItem(
            '@subscriber',
            subscriber ? 'true' : 'false',
          );
          dispatchAuth({type: 'login', token, fullname, id, subscriber});
          return;
        })();
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
      <ScrollView keyboardShouldPersistTaps="always">
        <Controller
          control={control}
          name="fullname"
          rules={{required: errorMessage.required}}
          render={({field: {value, onChange}}) => (
            <TextField
              value={value}
              onChangeText={text => onChange(text)}
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
              onChangeText={text => onChange(text)}
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
              onChangeText={text => onChange(text)}
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
              onChangeText={text => onChange(text)}
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
          onPress={handleSubmit(_proceedRegister)}
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
