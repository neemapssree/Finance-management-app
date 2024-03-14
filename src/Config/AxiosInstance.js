import axios from "axios";
import { API_URL } from "../Constants/Constants";

const AxiosInstance = axios.create({
    baseURL : API_URL
})

AxiosInstance.interceptors.request.use(function(config) {
    const token = localStorage.getItem('token')
    config.headers['Authorization']='Bearer '+token
    config.headers['Access-control-Allow-Origin'] = '*'
    return config
})


export default AxiosInstance
