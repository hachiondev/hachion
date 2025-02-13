import axios from "axios";

const REST_API_BASE_URL='http://localhost:8080/trainers';

export const listTrainer=()=>{
    return axios.get(REST_API_BASE_URL);
}
