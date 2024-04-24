import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import { fetchCategories, fetchSubcategoriesAndProducts } from "../../apis/categoryService";

function ProductCategories() {
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [subcategoryId, setSubcategoryId] = useState(null);
    const [products, setProducts] = useState([]);

    const subcategoryRefs = useRef({});
    const contentRef = useRef(null);
    const sidebarRef = useRef(null);

    // Helper function to handle fetching and setting subcategories and products
    const handleSetSubcategoriesAndProducts = (subcategoriesData) => {
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
        setSubcategoryId(guessLikeSubcategory.id);
        setProducts([...guessLikeSubcategory.products, ...productsData]);
    };

    // Fetching initial data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const { data } = await fetchCategories();
                setCategories(data.categories);
                setCategoryId(data.categories[0].id);
                handleSetSubcategoriesAndProducts(data.firstCategory.subcategories);
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
                const { data } = await fetchSubcategoriesAndProducts(categoryId);
                handleSetSubcategoriesAndProducts(data.subcategories);
            };
            fetchAndSetSubcategories();

            if (sidebarRef.current) {
                const index = categories.findIndex(cat => cat.id === categoryId);
                if (index !== -1) {
                    const listItem = sidebarRef.current.querySelectorAll('li')[index];
                    listItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        }
    }, [categoryId]);

    const handleCategoryClick = (id) => {
        setCategoryId(id);
        contentRef.current.scrollTop = 0;
    };

    const handleSubcategoryClick = (id) => {
        setSubcategoryId(id);
        subcategoryRefs.current[id]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <div className="container">
            <div className="sidebar" ref={sidebarRef}>
                <ul>
                    {categories.map(category => (
                        <li key={category.id} onClick={() => handleCategoryClick(category.id)}
                            className={categoryId === category.id ? 'active' : ''}>
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="main">
                <div className="header">
                    {subcategories.map(subcategory => (
                        <button className={subcategoryId === subcategory.id ? 'active' : ''}
                                key={subcategory.id} onClick={() => handleSubcategoryClick(subcategory.id)}>
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
                                        <img src={product.image} alt={product.name}/>
                                        <div className="product-info">{product.name}</div>
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

function randomSelection(products, count) {
    const indices = new Set();
    while (indices.size < count) {
        indices.add(Math.floor(Math.random() * products.length));
    }
    return Array.from(indices).map(index => products[index]);
}
