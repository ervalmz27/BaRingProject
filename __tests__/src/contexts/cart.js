import React from 'react';
import service from '../service';

export const CartContext = React.createContext();

const reducer = (state, action) => {
  const currentItems = state;
  switch (action.type) {
    case 'addItem':
      const findIndex = currentItems.findIndex(el => el.id === action.item.id);
      if (findIndex >= 0) {
        currentItems[findIndex] = {
          ...currentItems[findIndex],
          qty: currentItems[findIndex].qty + action.item.qty,
        };
      } else {
        currentItems.push(action.item);
      }

      service
        .post(
          '/cart/increase',
          action.item.type === 'product'
            ? {
                product_id: action.item.id,
                qty: action.item.qty,
              }
            : {
                course_id: action.item.id,
              },
        )
        .then(() => {})
        .catch(() => {});

      return [...currentItems];
    case 'decreaseQty':
      service
        .post('/cart/decrease', {
          product_id: currentItems[action.index].id,
          qty: 1,
        })
        .then(() => {})
        .catch(() => {});

      if (currentItems[action.index].qty < 2) {
        currentItems.splice(action.index, 1);
      } else {
        currentItems[action.index] = {
          ...currentItems[action.index],
          qty: currentItems[action.index].qty - 1,
        };
      }

      return [...currentItems];
    case 'increaseQty':
      currentItems[action.index] = {
        ...currentItems[action.index],
        qty: currentItems[action.index].qty + 1,
      };

      service
        .post('/cart/increase', {
          product_id: currentItems[action.index].id,
          qty: 1,
        })
        .then(() => {})
        .catch(() => {});

      return [...currentItems];
    case 'resetQty':
      service
        .post(
          '/cart/reset',
          currentItems[action.index].type === 'product'
            ? {
                product_id: currentItems[action.index].id,
                qty: action.qty,
              }
            : {
                course_id: currentItems[action.index].id,
              },
        )
        .then(() => {})
        .catch(() => {});

      if (action.qty === 0) {
        currentItems.splice(action.index, 1);
      } else {
        currentItems[action.index] = {
          ...currentItems[action.index],
          qty: action.qty,
        };
      }

      return [...currentItems];

    case 'reset':
      return [...action.payload];
  }
};

export default function CartProvider({children}) {
  const [state, dispatch] = React.useReducer(reducer, []);

  const _getCart = () => {
    service
      .get('/cart')
      .then(response => {
        const {data} = response;
        dispatch({type: 'reset', payload: data});
      })
      .catch(() => {});
  };

  React.useEffect(() => {
    _getCart();
  }, []);

  return (
    <CartContext.Provider value={{cart: state, setCart: dispatch}}>
      {children}
    </CartContext.Provider>
  );
}
