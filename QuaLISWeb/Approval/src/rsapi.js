import axios from 'axios';

const baseURL = 'http://localhost:8001/QuaLIS';
export default axios.create({
  baseURL: baseURL
});

export const serverUrl = () => {

  return baseURL

}

export const clientUrl = () => {
  return baseURL

}

export const fileViewUrl = () => {
  return 'http://localhost:8001'
}