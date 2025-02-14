import axios from "axios";

const REST_API_BASE_URL='https://api.hachion.co/trainers';

export const listTrainer=()=>{
    return axios.get(REST_API_BASE_URL);
}
