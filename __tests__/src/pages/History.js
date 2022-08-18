import React from 'react';
import {FlatList} from 'react-native';
import getColor from '../color';
import HistoryList from '../components/HistoryList';
import service from '../service';

export default function History() {
  const color = getColor();
  const [data, setData] = React.useState([{}, {}]);

  const _getData = (page = 1) => {
    service
      .get('/checkout/list', {
        params: {
          page,
        },
      })
      .then(response => {
        setData(response.data.data);
        console.log(response.data.data);
      })
      .catch(e => {
        setData([]);
      });
  };

  React.useEffect(() => {
    _getData();
  }, []);
  return (
    <FlatList
      style={{flex: 1, backgroundColor: color['white-1']}}
      data={data}
      keyExtractor={(item, index) => `${index}`}
      renderItem={({item}) => (
        <HistoryList
          date={item.created_at}
          items={item.items}
          id={item.id}
          isPaid={item.is_paid}
        />
      )}
    />
  );
}
