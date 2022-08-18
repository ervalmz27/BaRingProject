import React from 'react';
import {ScrollView, Text, TouchableOpacity} from 'react-native';
import getColor from '../color';
import service from '../service';

export default function ClipperDetail({route, navigation}) {
  const color = getColor();
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{paddingHorizontal: 21}}
          onPress={() => {
            service
              .delete(`/clip/${route.params.id}`)
              .then(() => {
                navigation.navigate('clipper', {
                  refresh: true,
                });
              })
              .catch(e => {
                console.log(e);
              });
          }}>
          <Text style={{fontFamily: 'Roboto-Regular', color: color['white-0']}}>
            Hapus
          </Text>
        </TouchableOpacity>
      ),
    });
  }, []);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: color['white-0'], flex: 1}}
      contentContainerStyle={{padding: 21}}>
      <Text
        style={{
          textAlign: 'justify',
          fontFamily: 'Roboto-Regular',
          lineHeight: 24,
        }}>
        {route.params.text}
      </Text>
    </ScrollView>
  );
}
