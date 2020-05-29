import axios from 'axios';
import localforage from 'localforage';
import {setup} from 'axios-cache-adapter';

const axiosInstances = [
    axios.create({baseURL: '/api/f1/'}),
    setup({
        baseURL: 'https://ergast.com/api/f1/',
        cache: {
            maxAge: 60 * 60 * 1000,
            exclude: {
                query: false
            },
            store: localforage.createInstance({
                name: 'axios-cache',
                version: 1
            })
        }
    })
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

        return {
            ...response,
            data: MRData
        };
    });
});

export const [localApi, remoteApi] = axiosInstances;
