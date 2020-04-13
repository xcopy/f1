import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://ergast.com/api/f1/',
    timeout: 2000
});

axiosInstance.interceptors.request.use((config) => {
    config.params = {limit: 100};
    config.url = `${config.url}.json`;
    return config;
});

axiosInstance.interceptors.response.use((response) => {
    response.data = response.data.MRData;
    return response;
});

export default axiosInstance;
