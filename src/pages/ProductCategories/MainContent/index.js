import React, { useEffect, useRef, useState } from 'react';
import '../index.scss';

export default function MainContent({ subcategories }) {
    const [subcategoryId, setSubcategoryId] = useState(null);
    const subcategoryRefs = useRef({});
    const contentRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        setSubcategoryId(subcategories[0]?.id);

        if (contentRef.current) {
            contentRef.current.scrollTo(0, 0);
        }
    }, [subcategories]);

    const handleScroll = () => {
        let currentId = subcategoryId;
        const scrollPosition = contentRef.current.scrollTop;

        subcategories.forEach(subcategory => {
            const ref = subcategoryRefs.current[subcategory.id];
            if (ref && ref.offsetTop <= scrollPosition + 100) {
                currentId = subcategory.id;
            }
        });

        if (currentId !== subcategoryId) {
            console.log("currentId", currentId)
            console.log("subcategoryId", subcategoryId)
            setSubcategoryId(currentId);
        }

        if (headerRef.current) {
            const index = subcategories.findIndex(cat => cat.id === currentId);
            if (index !== -1) {
                const listItem = headerRef.current.querySelectorAll('button')[index];
                console.log("listItem", listItem);
                listItem.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center'
                });
            }
        }
    };


    useEffect(() => {
        // 当 categoryId 改变时，对应的分类滚动到可视区域中间
        if (headerRef.current) {
            const index = subcategories.findIndex(cat => cat.id === subcategoryId);
            if (index !== -1) {
                const listItem = headerRef.current.querySelectorAll('button')[index];
                console.log("listItem", listItem);
                listItem.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center'
                });
            }
        }
    }, [subcategoryId]);


    const handleSubcategoryClick = (id) => {
        subcategoryRefs.current[id]?.scrollIntoView({
            behavior: 'instant',
            block: 'start',
        });
        setSubcategoryId(id);
    };

    return (
        <div className="main">
            <div className="header" ref={headerRef}>
                {subcategories.map(subcategory => (
                    <button
                        data-id={subcategory.id}
                        className={subcategoryId === subcategory.id ? 'active' : ''}
                        key={subcategory.id}
                        onClick={() => handleSubcategoryClick(subcategory.id)}
                    >
                        {subcategory.name}
                    </button>
                ))}
            </div>
            <div className="content" onScroll={() => handleScroll()} ref={contentRef}>
                {subcategories.map(subcategory => (
                    <div key={subcategory.id} ref={el => subcategoryRefs.current[subcategory.id] = el}
                         className="subcategory-section">
                        <h2>{subcategory.name}</h2>

                        <div className="products-container">
                            {subcategory.products.map(product => (
                                <div
                                    key={product.id}
                                    className="product-card"
                                    data-subcategory-id={product.subcategoryId}
                                >
                                    <img src={product.image} alt={product.name}/>
                                    <div className="product-info">{product.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
