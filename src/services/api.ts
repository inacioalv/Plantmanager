import axios from 'axios'

const api = axios.create({
    baseURL:'http://10.0.0.111:3333' //Colocar o endereço do Ip para telefone identificar 
});

export default api;