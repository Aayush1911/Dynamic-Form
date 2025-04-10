import axios from 'axios';

const API_URL = 'http://localhost:8000/api/forms';

//submit response
export const submitResponse=async()=>{
    return axios.post(`${API_URL}/submit-form`)
}
