import axios from "axios";

const API_URL = 'http://localhost:8000/dept'; 

//add dept
export const addDept=async(deptData)=>{
    return axios.post(`${API_URL}/add`,deptData)
}

//edit dept
export const editDept=async(id,deptData)=>{
    return axios.put(`${API_URL}/edit/${id}`,deptData)
}

//get all dept
export const getDept=async()=>{
    return axios.get(`${API_URL}/get`)
}