import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {Alert, Image, StatusBar, View} from 'react-native';
import 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import Graduation from './src/assets/icons/Graduation.svg';
import Home from './src/assets/icons/Home.svg';
import Search from './src/assets/icons/Search.svg';
import Shop from './src/assets/icons/Shop.svg';
import User from './src/assets/icons/User.svg';
import getColor from './src/color';
import Toast from './src/components/Toast';
import {baseURL} from './src/config';
import {AuthContext} from './src/contexts/auth';
import CartProvider from './src/contexts/cart';
import Audio from './src/pages/Audio';
import Cart from './src/pages/Cart';
import Category from './src/pages/Category';
import Checkout from './src/pages/Checkout';
import Clipper from './src/pages/Clipper';
import ClipperDetail from './src/pages/ClipperDetail';
import Comments from './src/pages/Comments';
import ComposeReview from './src/pages/ComposeReview';
import Course from './src/pages/Course';
import CourseDetail from './src/pages/CourseDetail';
import Detail from './src/pages/Detail';
import Ecommerce from './src/pages/Ecommerce';
import EditProfile from './src/pages/EditProfile';
import Explore from './src/pages/Explore';
import History from './src/pages/History';
import Homepage from './src/pages/Homepage';
import Login from './src/pages/Login';
import MoreDescription from './src/pages/MoreDescription';
import OwnCourse from './src/pages/OwnCourse';
import Payment from './src/pages/Payment';
import PDF from './src/pages/PDF';
import ProductDetail from './src/pages/ProductDetail';
import Profile from './src/pages/Profile';
import Read from './src/pages/Read';
import ReadCourse from './src/pages/ReadCourse';
import Register from './src/pages/Register';
import Reply from './src/pages/Reply';
import StartScreen from './src/pages/StartScreen';
import SubjectList from './src/pages/SubjectList';
import Subscription from './src/pages/Subscription';
import Video from './src/pages/Video';
import Wishlist from './src/pages/Wishlist';
import service from './src/service';
import messaging from '@react-native-firebase/messaging';

const Stack = createStackNavigator();
const EcommerceStack = createStackNavigator();
const HomeStack = createStackNavigator();
const CourseStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const color = getColor();

const defaultHeader = {
  headerStyle: {
    elevation: 0,
    backgroundColor: color['primary-0'],
  },
  headerTitleAlign: 'center',
  headerTintColor: '#FFF',
  headerTitleStyle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    marginBottom: -2,
  },
  ...TransitionPresets.SlideFromRightIOS,
};

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="home"
        component={Homepage}
        options={{
          title: 'Explore',
          headerStyle: {
            elevation: 0,
            backgroundColor: color['primary-0'],
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontFamily: 'Poppins-Bold',
            fontSize: 16,
            marginBottom: -2,
          },
        }}
      />
    </HomeStack.Navigator>
  );
};

const EcommerceStackScreen = () => {
  return (
    <EcommerceStack.Navigator>
      <EcommerceStack.Screen
        name="ecommerce"
        component={Ecommerce}
        options={{
          title: 'Ecommerce',
          headerStyle: {
            elevation: 0,
            backgroundColor: color['primary-0'],
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontFamily: 'Poppins-Bold',
            fontSize: 16,
            marginBottom: -2,
          },
        }}
      />
    </EcommerceStack.Navigator>
  );
};

const CourseStackScreen = () => {
  return (
    <CourseStack.Navigator>
      <CourseStack.Screen
        name="course"
        component={Course}
        options={{
          title: 'Online Course',
          headerStyle: {
            elevation: 0,
            backgroundColor: color['primary-0'],
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontFamily: 'Poppins-Bold',
            fontSize: 16,
            marginBottom: -2,
          },
        }}
      />
    </CourseStack.Navigator>
  );
};
 
const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let Icon;

          if (route.name === 'homepage') {
            Icon = Search;
          } 
          // else if (route.name === 'explore') {
          //   Icon = Search;
          // } 
          // else if (route.name === 'course') {
          //   Icon = Graduation;
          // } 
          else if (route.name === 'profile') {
            Icon = User;
          } 
          else if (route.name === 'ecommerceStack') {
            Icon = Shop;
          }

          // You can return any component that you like here!
          return (
            <Icon
              width={24}
              height={24}
              color={focused ? color['primary-0'] : color['black-2']}
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: color['black-0'],
        inactiveTintColor: color['black-2'],
        style: {
          backgroundColor: color['white-0'],
          elevation: 0,
          borderTopWidth: 0,
          height: 64,
          padding: 0,
        },
        showLabel: false,
        keyboardHidesTabBar: true,
      }}>
      <Tab.Screen
        name="homepage"
        component={HomeStackScreen}
        options={{title: 'Home'}}
      />
     {/* <Tab.Screen
        name="explore"
        component={Explore}
        options={{title: 'Jelajah'}}
      />
      <Tab.Screen
        name="course"
        component={CourseStackScreen}
        options={{title: 'Course'}}
      />*/}
      <Tab.Screen
        name="ecommerceStack"
        component={EcommerceStackScreen}
        options={{title: 'Ecommerce'}}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{title: 'Akun'}}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const {
    auth: {token},
    dispatchAuth,
  } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(true);
  const [splash, setSplash] = React.useState(true);
  const [logo, setLogo] = React.useState('');

  async function saveTokenToDatabase(token) {
    // Assume user is already signed in
    service
      .put('/user/token', {
        token,
      })
      .then(response => {
        messaging()
          .subscribeToTopic('newRelease')
          .then(() => console.log('Subscribed to topic!'));
        messaging()
          .subscribeToTopic('newProduct')
          .then(() => console.log('Subscribed to topic!'));
        messaging()
          .subscribeToTopic('newCourse')
          .then(() => console.log('Subscribed to topic!'));
      })
      .catch(e => {
        console.log(e);
      });
  }

  React.useEffect(() => {
    if (token) {
      const unsubscribe = messaging().onMessage(async remoteMessage => {});
      messaging()
        .getToken()
        .then(token => {
          return saveTokenToDatabase(token);
        });

      return unsubscribe;
    }
  }, [token]);

  React.useEffect(() => {
    (async () => {
      await TrackPlayer.setupPlayer({});
      const token = await AsyncStorage.getItem('@token');
      const partnerId = await AsyncStorage.getItem('@partnerId');
      if (partnerId) {
        setLogo(`${baseURL}/api/stream/partner-logo/${partnerId}`);
      } else {
        setLogo(`${baseURL}/base-logo.png`);
      }
      if (token) {
        const id = await AsyncStorage.getItem('@id');
        const fullname = await AsyncStorage.getItem('@fullname');
        service
          .get('/auth/user/verify-token', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            dispatchAuth({type: 'login', token, fullname, id});
            setLoading(false);
          })
          .catch(e => {
            if (e.response?.status === 401) {
              (async () => {
                await AsyncStorage.removeItem('@id');
                await AsyncStorage.removeItem('@token');
                await AsyncStorage.removeItem('@fullname');
              })();
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
      return;
    })();
  }, []);

  React.useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        setSplash(false);
      }, 1500);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [loading]);

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
    <Toast>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {!token ? (
              <React.Fragment>
                <Stack.Screen
                  name="start"
                  component={StartScreen}
                  options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                  }}
                />
                <Stack.Screen
                  name="login"
                  component={Login}
                  options={{
                    headerStyle: {
                      elevation: 0,
                      backgroundColor: color['primary-0'],
                    },
                    headerTintColor: '#FFF',
                    title: '',
                    ...TransitionPresets.SlideFromRightIOS,
                  }}
                />
                <Stack.Screen
                  name="register"
                  component={Register}
                  options={{
                    headerStyle: {
                      elevation: 0,
                      backgroundColor: color['primary-0'],
                    },
                    headerTintColor: '#FFF',
                    title: '',
                    ...TransitionPresets.SlideFromRightIOS,
                  }}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Stack.Screen
                  name="main"
                  component={MainTab}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="detail"
                  component={Detail}
                  options={{
                    title: '',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="courseDetail"
                  component={CourseDetail}
                  options={{
                    title: '',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="wishlist"
                  component={Wishlist}
                  options={{
                    title: 'Disukai',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="clipper"
                  component={Clipper}
                  options={{
                    title: 'Clipper',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="moreDescription"
                  component={MoreDescription}
                  options={{
                    title: 'Deskripsi',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="clipperDetail"
                  component={ClipperDetail}
                  options={{
                    title: '',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="audio"
                  component={Audio}
                  options={{
                    title: '',
                  }}
                />
                <Stack.Screen
                  name="composeReview"
                  component={ComposeReview}
                  options={{
                    title: 'Tulis Review',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="subjectList"
                  component={SubjectList}
                  options={{
                    title: 'Daftar Materi',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="pdf"
                  component={PDF}
                  options={{
                    title: 'PDF',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="video"
                  component={Video}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="comments"
                  component={Comments}
                  options={{
                    title: 'Komentar',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="reply"
                  component={Reply}
                  options={{
                    title: 'Balasan',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="read"
                  component={Read}
                  options={{
                    title: '',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="readCourse"
                  component={ReadCourse}
                  options={{
                    title: '',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="category"
                  component={Category}
                  options={{
                    title: '',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="ownCourse"
                  component={OwnCourse}
                  options={{
                    title: 'Course Saya',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="editProfile"
                  component={EditProfile}
                  options={{
                    title: 'Edit Profile',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="subscription"
                  component={Subscription}
                  options={{
                    title: 'Berlangganan',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="payment"
                  component={Payment}
                  options={{
                    title: 'Pembayaran',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="productDetail"
                  component={ProductDetail}
                  options={{
                    title: '',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="cart"
                  component={Cart}
                  options={{
                    title: 'Keranjang',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="checkout"
                  component={Checkout}
                  options={{
                    title: 'Checkout',
                    ...defaultHeader,
                  }}
                />
                <Stack.Screen
                  name="history"
                  component={History}
                  options={{
                    title: 'Pembelian',
                    ...defaultHeader,
                  }}
                />
              </React.Fragment>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </Toast>
  );
}
