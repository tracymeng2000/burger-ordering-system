import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-1003.firebaseio.com/'
})

export default instance;