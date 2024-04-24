import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './index.scss';

function ProductCategories() {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const subcategoryRefs = useRef({});
    const contentRef = useRef(null); // Ref for the content container

    const serverUrl = ''; // Please ensure to fill in your server URL here

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategoryId !== null) {
            fetchSubcategoriesAndProducts(selectedCategoryId);
            if (contentRef.current) {
                contentRef.current.scrollTop = 0; // Scroll to the top when a new category is selected
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

    const fetchSubcategoriesAndProducts = async (categoryId) => {
        const response = await axios.get(`${serverUrl}/categories/${categoryId}`);
        setSubcategories(response.data.subcategories);
        setProducts(response.data.subcategories.flatMap(sub => sub.products));
    };

    const handleSubcategoryClick = subcategoryId => {
        subcategoryRefs.current[subcategoryId].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <div className="container">
            <div className="sidebar">
                <ul>
                    {categories.map(category => (
                        <li key={category.id}
                            onClick={() => setSelectedCategoryId(category.id)}
                            className={selectedCategoryId === category.id ? 'active' : ''}>
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="main">
                <div className="header">
                    {subcategories.map(subcategory => (
                        <button key={subcategory.id} onClick={() => handleSubcategoryClick(subcategory.id)}>
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
                                        <img src={`${serverUrl}/${product.image}`} alt={product.name} />
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
