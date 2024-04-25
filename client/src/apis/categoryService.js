import axios from 'axios';

const serverUrl = 'http://localhost:3000';  // 服务端 API 地址

export const fetchCategories = async () => {
    return axios.get(`${serverUrl}/categories`);
};

export const fetchSubcategories = async (categoryId) => {
    return axios.get(`${serverUrl}/categories/${categoryId}`);
};
