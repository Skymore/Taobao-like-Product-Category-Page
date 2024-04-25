import React, { useEffect, useState } from 'react';
import './index.scss';
import { fetchCategories, fetchSubcategories } from "../../apis/categoryService";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Loading from "./Loading";
import MainContent2 from "./MainContent/indexV2";

function ProductCategories() {
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(1);
    const [subcategories, setSubcategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // 新增状态变量
    const [initialLoad, setInitialLoad] = useState(true); // 新增状态变量

    // Helper function to handle fetching and setting subcategories and products
    const handleSetSubcategories = (subcategoriesData) => {
        const productsData = subcategoriesData.flatMap(sub => sub.products);
        const randomProducts = randomSelection(productsData, Math.floor(Math.random() * 6) + 4);
        const guessLikeSubcategory = {
            id: 'guess-like',
            name: '猜你喜欢',
            products: randomProducts.map(product => ({
                ...product,
                subcategoryId: 'guess-like',
                id: `guess-like-${product.id}`
            }))
        };

        setSubcategories([guessLikeSubcategory, ...subcategoriesData]);
    };

    // Fetching initial data
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true); // 开始加载数据
            try {
                const { data } = await fetchCategories();
                setCategories(data.categories);
                setCategoryId(data.categories[0].id);
                handleSetSubcategories(data.firstCategory.subcategories);
                console.log("loadInitialData", data.categories);
            } catch (error) {
                console.error('Failed to fetch initial categories data:', error);
            }
            setIsLoading(false); // 结束加载数据
        };

        loadInitialData();
    }, []);


    // Fetch subcategories when categoryId changes
    useEffect(() => {
        if (categoryId && !initialLoad) {
            const fetchAndSetSubcategories = async () => {
                try {
                    const { data } = await fetchSubcategories(categoryId);
                    handleSetSubcategories(data.subcategories);
                    console.log("fetchAndSetSubcategories", data);
                } catch (error) {
                    console.error('Failed to fetch subcategories:', error);
                }
            };

            fetchAndSetSubcategories();
        }
    }, [categoryId, initialLoad]);


    return (
        <div className="container">
            {isLoading && <Loading/>}
            <Sidebar
                categories={categories}
                categoryId={categoryId}
                onSelect={id => {
                    setCategoryId(id);
                    setInitialLoad(false);
                }}
            />
            <MainContent
                subcategories={subcategories}
            />
        </div>
    );
}

export default ProductCategories;

function randomSelection(products, count) {
    const indices = new Set();
    while (indices.size < count) {
        indices.add(Math.floor(Math.random() * products.length));
    }
    return Array.from(indices).map(index => products[index]);
}
