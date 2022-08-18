import axios from 'axios';
import {baseURL} from './config';

const service = axios.create({
  baseURL: baseURL + '/api',
});

export default service;
