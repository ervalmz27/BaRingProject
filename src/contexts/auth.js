import React, {createContext, useReducer} from 'react';
import service from '../service';

export const AuthContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'login':
      service.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${action.token}`;
      return {
        ...state,
        token: action.token,
        id: action.id,
        fullname: action.fullname,
      };
    case 'update':
      return {
        ...state,
        id: action.id,
        fullname: action.fullname,
      };
    case 'logout':
      service.defaults.headers.common['Authorization'] = undefined;
      return {
        ...state,
        token: null,
        fullname: null,
        id: null,
      };
    default:
      throw new Error();
  }
};

export const AuthProvider = ({children}) => {
  const [auth, dispatchAuth] = useReducer(reducer, {
    token: null,
    fullname: null,
    id: null,
  });
  return (
    <AuthContext.Provider value={{auth, dispatchAuth}}>
      {children}
    </AuthContext.Provider>
  );
};
