import axios from 'axios';
import { API_IP_ADDRESS } from './config';

const api = axios.create({
    baseURL: `http://${API_IP_ADDRESS}`, // If using an emulator, replace 'your_server_ip' accordingly
});

export default api;
