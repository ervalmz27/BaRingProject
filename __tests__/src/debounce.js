import {useCallback} from 'react';

function debounce(callback = () => {}, seconds = 1000) {
  let timeout;

  return text => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      callback(text);
    }, seconds);
  };
}

const useDebounce = (...props) => useCallback(debounce(...props), []);

export default useDebounce;
