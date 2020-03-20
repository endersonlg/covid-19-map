import axios from 'axios';

export const apiBrazil = axios.create({
  baseURL: 'https://api.coronaanalytic.com/brazil',
});

export const apiWorld = axios.create({
  baseURL: 'https://www.bing.com/covid/data',
});
