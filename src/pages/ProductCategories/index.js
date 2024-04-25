import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import { fetchCategories, fetchSubcategories } from "../../apis/categoryService";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
// import MainContent2 from "./MainContent/indexV2";

function ProductCategories() {
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [subcategories, setSubcategories] = useState([]);

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
            try {
                const { data } = await fetchCategories();
                setCategories(data.categories);
                setCategoryId(data.categories[0].id);
                handleSetSubcategories(data.firstCategory.subcategories);
            } catch (error) {
                console.error('Failed to fetch initial categories data:', error);
            }
        };
        loadInitialData();
    }, []);


    // Fetch subcategories when categoryId changes
    useEffect(() => {
        if (categoryId) {
            const fetchAndSetSubcategories = async () => {
                const { data } = await fetchSubcategories(categoryId);
                handleSetSubcategories(data.subcategories);
            };
            fetchAndSetSubcategories();
        }
    }, [categoryId]);

    return (
        <div className="container">
            <Sidebar
                categories={categories}
                categoryId={categoryId}
                onSelect={id => {
                    setCategoryId(id);
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
