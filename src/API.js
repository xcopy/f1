import axios from 'axios';

// const host = process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'ergast.com';

const axiosInstance = axios.create({
    baseURL: '/api/f1/'
    // baseURL: `https://${host}/api/f1/`,
    // timeout: 2000
});

axiosInstance.interceptors.request.use((config) => {
    config.params = {limit: 100};
    config.url = `${config.url}.json`;
    return config;
});

axiosInstance.interceptors.response.use((response) => {
    const {MRData} = response.data;
    response.data = MRData;
    return response;
});

export default axiosInstance;
