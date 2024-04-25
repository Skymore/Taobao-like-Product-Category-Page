import React, { useEffect, useRef, useState } from 'react';
import '../index.scss';

function Nav({ subcategories, subcategoryId, onLinkClick }) {
    return (
        <div className="header">
            {subcategories.map(subcategory => (
                <button
                    data-id={subcategory.id}
                    className={subcategoryId === subcategory.id ? 'active' : ''}
                    key={subcategory.id}
                    onClick={() => onLinkClick(subcategory.id)}
                >
                    {/*<a href={'#' + subcategory.id} style={{ color: 'inherit', textDecoration: 'none' }}>*/}
                        {subcategory.name}
                    {/*</a>*/}
                </button>
            ))}
        </div>
    );
}

function Subcategory({ subcategory }) {
    return (
        <Anchor id={subcategory.id}>
            <div key={subcategory.id} className="subcategory-section">
                <h2>{subcategory.name}</h2>
                <div className="products-container">
                    {subcategory.products.map(product => (
                        <div
                            key={product.id}
                            className="product-card"
                        >
                            <img src={product.image} alt={product.name}/>
                            <div className="product-info">{product.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Anchor>
    )
}

function Anchor({ children, id }) {
    return (
        <div id={id}>
            {children}
        </div>
    )
}


export default function MainContent2({ subcategories }) {
    const [subcategoryId, setSubcategoryId] = useState(null);
    const contentRef = useRef(null);

    const scrollToSubcategory = (subcategoryId) => {
        console.log("subcategoryId", subcategoryId);
        const subcategoryEl = document.getElementById(subcategoryId);
        console.log("subcategoryEl", subcategoryEl);
        subcategoryEl.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        const handleScroll = () => {
            subcategories.forEach(subcategory => {
                const element = document.getElementById(subcategory.id);
                // 获取元素在可视区域中的位置
                const rect = element.getBoundingClientRect();
                // 判断是否在可视区域内
                if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                    setSubcategoryId(subcategory.id);
                }
            })
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        setSubcategoryId(subcategories[0]?.id);

        if (contentRef.current) {
            contentRef.current.scrollTo(0, 0);
        }
    }, [subcategories]);


    return (
        <div className="main">
            <Nav
                subcategories={subcategories}
                subcategoryId={subcategoryId}
                onLinkClick={(id) => scrollToSubcategory(id)}
            />
            <div className="content" ref={contentRef}>
                {subcategories.map(subcategory => (
                    <Subcategory key={subcategory.id} subcategory={subcategory}/>
                ))}
            </div>
        </div>
    );
}
