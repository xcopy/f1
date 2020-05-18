import axios from 'axios';

const axiosInstances = [
    axios.create({baseURL: '/api/f1/'}),
    axios.create({baseURL: 'https://ergast.com/api/f1/'})
];

axiosInstances.forEach(instance => {
    instance.interceptors.request.use((config) => {
        config.params = {limit: 1000};

        config.url = `${config.url}.json`;

        return config;
    });

    instance.interceptors.response.use((response) => {
        const {data: {MRData}} = response;

        response.data = MRData;

        return response;
    });
});

export const [localApi, remoteApi] = axiosInstances;
