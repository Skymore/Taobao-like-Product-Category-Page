import React, { useEffect, useRef, useState } from 'react';
import '../index.scss';

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

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
            setSubcategoryId(currentId);
        }

        if (headerRef.current) {
            const index = subcategories.findIndex(cat => cat.id === currentId);
            if (index !== -1) {
                const listItem = headerRef.current.querySelectorAll('button')[index];
                listItem.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center'
                });
            }
        }
    };

    useEffect(() => {
        const contentElement = contentRef.current;
        const debouncedHandleScroll = debounce(handleScroll, 50);

        if (contentElement) {
            contentElement.addEventListener('scroll', debouncedHandleScroll);
        }

        return () => {
            if (contentElement) {
                contentElement.removeEventListener('scroll', debouncedHandleScroll);
            }
        };
    }, [subcategories, subcategoryId]);

    const handleSubcategoryClick = (id) => {
        subcategoryRefs.current[id]?.scrollIntoView({
            behavior: 'smooth',
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
            <div className="content" ref={contentRef}>
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