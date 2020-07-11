import axios from 'axios';

const api = axios.create({
    baseURL: 'https://sport-app-backend.herokuapp.com'
})

export default api;