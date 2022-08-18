import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import getColor from '../color';
import service from '../service';

export default function SubjectList({route, navigation}) {
  const color = getColor();
  const {courseId, start = null} = route.params;
  const [subjects, setSubjects] = React.useState([]);
  const [parent, setParent] = React.useState(null);
  const [subjectsToShow, setSubjectsToShow] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isMember, setIsMember] = React.useState(false);

  const _recursiveGetParent = (checking, id, parent = null) => {
    for (let subject of checking) {
      if (subject.id === id) {
        setParent(parent);
        break;
      } else if (subject.childs?.length) {
        _recursiveGetParent(subject.childs, id, subject.id);
      }
    }

    return;
  };

  const _recursiveGetChild = (checking, id) => {
    if (id) {
      for (let subject of checking) {
        if (subject.id === id) {
          setSubjectsToShow(subject.childs);
          setLoading(false);
          break;
        } else if (subject.childs?.length) {
          _recursiveGetChild(subject.childs, id);
        }
      }
    } else {
      setSubjectsToShow(subjects);
    }
  };

  const _getData = () => {
    service
      .get(`/course/${courseId}`)
      .then(response => {
        setSubjects(response.data.subjects);
        setIsMember(response.data.is_member);
        if (start) {
          _recursiveGetParent(response.data.subjects);
        } else {
          setSubjectsToShow(response.data.subjects);
          setLoading(false);
        }
      })
      .catch(e => {
        setSubjects([]);
      });
  };

  React.useEffect(() => {
    _getData();
  }, []);

  React.useEffect(() => {
    _recursiveGetChild(subjects, parent);
  }, [parent]);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!parent) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        _recursiveGetParent(subjects, parent);
      }),
    [navigation, parent],
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color['white-1'],
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={color['primary-0']} />
      </View>
    );
  }
  return (
    <FlatList
      data={subjectsToShow}
      keyExtractor={item => `${item.id}`}
      style={{flex: 1, backgroundColor: color['white-1']}}
      renderItem={({item}) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            paddingHorizontal: 21,
            borderBottomWidth: 1,
            borderColor: color['white-3'],
            backgroundColor: color['white-0'],
          }}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              if (isMember) {
                navigation.navigate('readCourse', {id: item.id});
              }
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                color: color['black-0'],
                lineHeight: 24,
              }}>
              {item.title}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 24,
              height: 24,
              borderWidth: 1,
              borderColor: color['primary-0'],
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 2,
            }}
            onPress={() => {
              if (item.childs.length) {
                setParent(item.id);
              }
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                color: color['primary-0'],
              }}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}
