import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './index.scss';

function ProductCategories() {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const subcategoryRefs = useRef({});
    const contentRef = useRef(null); // 用于滚动到顶部
    const sidebarRef = useRef(null); // 用于滚动到中间


    const serverUrl = '';

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategoryId !== null) {
            fetchSubcategoryAndProducts(selectedCategoryId);
            if (contentRef.current) {
                contentRef.current.scrollTop = 0; // 点击新的一级分类时，滚动到顶部
            }
        }
    }, [selectedCategoryId]);

    const fetchCategories = async () => {
        const response = await axios.get(`${serverUrl}/categories`);
        setCategories(response.data);
        if (response.data.length > 0) {
            setSelectedCategoryId(response.data[0].id);
        }
    };

    const fetchSubcategoryAndProducts = async (categoryId) => {
        const response = await axios.get(`${serverUrl}/categories/${categoryId}`);
        setSubcategories(response.data.subcategories);
        setProducts(response.data.subcategories.flatMap(sub => sub.products));
        if (response.data.subcategories.length > 0) {
            setSelectedSubcategoryId(response.data.subcategories[0].id);
        }
    };

    const handleCategoryClick = categoryId => {
        // console.log("Category clicked:", categoryId);
        setSelectedCategoryId(categoryId);
        const index = categories.findIndex(cat => cat.id === categoryId);
        // console.log("Category index:", index);

        if (sidebarRef.current && index >= 0) {
            // 使用 setTimeout 是为了等待 React 更新 DOM 后再滚动
            setTimeout(() => {
                const listItem = sidebarRef.current.querySelectorAll('li')[index];
                // console.log("Scrolling to item:", listItem);
                listItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 0);  // 0毫秒的延迟，也可以尝试100毫秒看看效果
        }
    };




    const handleSubcategoryClick = subcategoryId => {
        setSelectedSubcategoryId(subcategoryId);
        subcategoryRefs.current[subcategoryId].scrollIntoView({
            behavior: 'smooth', // 平滑滚动
            block: 'start' // 滚动到子分类的顶部
        });
    };

    return (
        <div className="container">
            <div className="sidebar" ref={sidebarRef}>
                <ul>
                    {categories.map(category => (
                        <li key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={selectedCategoryId === category.id ? 'active' : ''}>
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="main">
                <div className="header">
                    {subcategories.map(subcategory => (
                        <button className={selectedSubcategoryId === subcategory.id ? 'active' : ''} key={subcategory.id} onClick={() => handleSubcategoryClick(subcategory.id)}>
                            {subcategory.name}
                        </button>
                    ))}
                </div>
                <div className="content" ref={contentRef}>
                    {subcategories.map(subcategory => (
                        <div key={subcategory.id} ref={el => subcategoryRefs.current[subcategory.id] = el}
                             className="subcategory-section">
                            <h2>{subcategory.name}</h2>
                            <div className="products-container">
                                {products.filter(product => product.subcategoryId === subcategory.id).map(product => (
                                    <div key={product.id} className="product-card">
                                        <img src={`${serverUrl}/${product.image}`} alt={product.name}/>
                                        <div className="product-info">
                                            <p>{product.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductCategories;
