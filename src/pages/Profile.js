import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  DeviceEventEmitter,
  RefreshControl,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import _ from 'lodash'
import getColor from '../color';
import BlockButton from '../components/BlockButton';
import {baseURL} from '../config';
import {AuthContext} from '../contexts/auth';
import service from '../service';

export default function Profile({navigation}) {
  const color = getColor();
  const {
    auth: {id},
    dispatchAuth,
  } = React.useContext(AuthContext);

  const [data, setData] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [menu, setMenu] = React.useState([
    {
      onPress: () => {
        navigation.navigate('editProfile', {data});
      },
      name: 'Profile',
    },
    {
      onPress: () => {
        navigation.navigate('wishlist');
      }, 
      name: 'Bookmark',
    },
    {
      onPress: () => {
        navigation.navigate('ownCourse');
      },
      name: 'Course',
    },
    {
      onPress: () => {
        navigation.navigate('history');
      },
      name: 'Purchase',
    },
    {
      onPress: () => {
        navigation.navigate('clipper');
      },
      name: 'Clipper',
    },
  ]);

  const _getData = () => {
    service.get('/user/' + id)
      .then(response => {
        setData(response.data);
        setRefreshing(false);
      })
      .catch(e => {});
  };

  const logout = () => {
    setLoading(true);
    service
      .delete('/auth/logout')
      .then(() => {
        setLoading(false);
        (async () => {
          await AsyncStorage.removeItem('@id');
          await AsyncStorage.removeItem('@token');
          await AsyncStorage.removeItem('@fullname');
          dispatchAuth({type: 'logout'});
        })();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    const listen = DeviceEventEmitter.addListener('update', () => {
      service
        .get('/user/' + id)
        .then(response => {
          setData(response.data);
        })
        .catch(e => {});
    });

    return () => {
      listen.remove();
    };
  }, [id]);

  React.useEffect(() => {
    _getData();
  }, [id, menu]);

  React.useEffect(() => {
    (async () => {
      if (data) {
        const {id, fullname, partner_id: partnerId} = data;
        await AsyncStorage.setItem('@fullname', fullname);
        await AsyncStorage.setItem('@id', `${id}`);
        const partnerIdBefore = await AsyncStorage.getItem('@partnerId');
        if (partnerId) {
          await AsyncStorage.setItem('@partnerId', `${partnerId}`);
        } else if (partnerIdBefore) {
          await AsyncStorage.removeItem('@partnerId');
        }

        dispatchAuth({type: 'update', id, fullname});

        if (
          moment(data.subscription_end).format('DD-MM-YYYY') !== '31-12-2037'
        ) {
          setMenu(menu => {
            menu.splice(1, 0, {
              onPress: () => {
                navigation.navigate('subscription');
              },
              name: 'Membership',
            });
            return menu;
          });
        }
      }
    })();
  }, [data]);

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            _getData();
          }}
        />
      }
      data={data ? menu : [{}, {}]}
      keyExtractor={(item, index) => `${index}`}
      style={{flex: 1, backgroundColor: color['white-1']}}
      nestedScrollEnabled={true}
      ListHeaderComponent={
        <View
          style={{
            paddingHorizontal: 21,
            paddingVertical: 32,
            backgroundColor: color['primary-0'],
            flexDirection: 'row',
          }}>
          <View>
            {!data ? (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item height={14} width={80} height={80} />
              </SkeletonPlaceholder>
            ) : (
              <Image
                source={{uri: baseURL + data.avatar}}
                style={{width: 80, height: 80, resizeMode: 'contain'}}
              />
            )}
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            {data ? (
              <React.Fragment>
                <Text
                  style={{
                    fontFamily: 'Poppins-Bold',
                    fontSize: 18,
                    color: color['secondary-0'],
                  }}>
                  {data.fullname}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    color: color['white-3'],
                  }}>
                  {data.username}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    color: color['white-3'],
                  }}>
                  {data.email}
                </Text>
              </React.Fragment>
            ) : (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                  height={18}
                  width="100%"
                  borderRadius={6}
                />
                <SkeletonPlaceholder.Item
                  height={14}
                  width="50%"
                  borderRadius={6}
                  marginTop={10}
                />
              </SkeletonPlaceholder>
            )}
          </View>
        </View>
      }
      renderItem={({item}) => (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            backgroundColor: color['white-0'],
            paddingHorizontal: 21,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: color['white-3'],
          }}
          // onPress={item.onPress}
          onPress={() => {
             if (_.isEqual(item.name, 'Profile')) {
               navigation.navigate('editProfile', {data})
            }
            if (_.isEqual(item.name, 'Bookmark')) {
               navigation.navigate('wishlist')
            }
            if (_.isEqual(item.name, 'Course')) {
               navigation.navigate('ownCourse')
            }
            if (_.isEqual(item.name, 'Purchase')) {
               navigation.navigate('history')
            }
            if (_.isEqual(item.name, 'Clipper')) {
               navigation.navigate('clipper')
            }
            if (_.isEqual(item.name, 'Membership')) {
               navigation.navigate('subscription')
            } 
          }}
          disabled={!data}>
          {!data ? (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item height={16} />
            </SkeletonPlaceholder>
          ) : (
            <Text

              style={{
                color: color['black-1'],
                fontFamily: 'Roboto-Regular',
                fontSize: 16,
              }}>
              {item.name}
            </Text>
          )}
        </TouchableOpacity>
      )}
      ListFooterComponent={
        data ? (
          <BlockButton onPress={() => logout()} style={{margin: 18}}>
            {loading ? (
              <ActivityIndicator color={color['black-0']} size="small" />
            ) : (
              'Keluar'
            )}
          </BlockButton>
        ) : (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item margin={18} height={48} />
          </SkeletonPlaceholder>
        )
      }
    />
  );
}