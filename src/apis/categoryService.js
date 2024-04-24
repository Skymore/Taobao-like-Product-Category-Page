import axios from 'axios';

const serverUrl = '';  // 服务端 API 地址

export const fetchCategories = async () => {
    return axios.get(`${serverUrl}/categories`);
};

export const fetchSubcategoriesAndProducts = async (categoryId) => {
    return axios.get(`${serverUrl}/categories/${categoryId}`);
};
