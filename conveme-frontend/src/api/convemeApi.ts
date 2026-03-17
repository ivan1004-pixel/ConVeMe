import axios from 'axios';

export const convemeApi = axios.create({
    baseURL: 'http://localhost:3000/graphql',
    headers: {
        'Content-Type': 'application/json',
    },
});
