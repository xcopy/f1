import axios from 'axios';
import localforage from 'localforage';
import {setup} from 'axios-cache-adapter';

const LIMIT = 1000;

const axiosInstances = [
    axios.create({baseURL: '/api/f1/'}),
    setup({
        baseURL: 'https://ergast.com/api/f1/',
        cache: {
            maxAge: 60 * 60 * 1000 * (process.env.NODE_ENV === 'development' ? 24 : 1),
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
    instance.interceptors.request.use(config => {
        const {params, url} = config;

        return {
            ...config,
            url: `${url}.json`,
            params: {
                limit: LIMIT,
                ...params
            }
        };
    });

    instance.interceptors.response.use(response => {
        const {data: {MRData}} = response;

        return {
            ...response,
            data: MRData
        };
    });
});

export {LIMIT};
export const [localApi, remoteApi] = axiosInstances;
