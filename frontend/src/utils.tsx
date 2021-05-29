import axios from 'axios';
import { endpoint } from './utils/constants';

export const authAxios = axios.create({
  baseURL: endpoint,
  headers: {
    Authorization: `Token ${localStorage.getItem('token')}`,
  },
});
