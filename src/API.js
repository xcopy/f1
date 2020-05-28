import axios from 'axios';

const axiosInstances = [
    axios.create({baseURL: '/api/f1/'}),
    axios.create({baseURL: 'https://ergast.com/api/f1/'})
];

axiosInstances.forEach(instance => {
    instance.interceptors.request.use((config) => {
        const {params, url} = config;

        return {
            ...config,
            url: `${url}.json`,
            params: {
                limit: 1000,
                ...params
            }
        };
    });

    instance.interceptors.response.use((response) => {
        const {data: {MRData}} = response;

        response.data = MRData;

        return response;
    });
});

export const [localApi, remoteApi] = axiosInstances;
