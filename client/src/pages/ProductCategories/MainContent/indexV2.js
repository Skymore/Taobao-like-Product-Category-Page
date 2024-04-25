import React, { useEffect, useRef, useState } from 'react';
import '../index.scss';

// 头部组件，展示子类别按钮
const Header = React.forwardRef(({ subcategories, subcategoryId, onClickSubcategory }, ref) => {
    return (
        <div ref={ref} className="header">
            {subcategories.map(subcategory => (
                <button
                    data-id={subcategory.id}
                    className={subcategoryId === subcategory.id ? 'active' : ''}
                    key={subcategory.id}
                    onClick={() => onClickSubcategory(subcategory.id)}
                >
                    {subcategory.name}
                </button>
            ))}
        </div>
    );
});


// 内容组件，展示子类别详情和产品
const Content = React.forwardRef(({ subcategories, subcategoryRefs }, ref) => {
    return (
        <div ref={ref} className="content">
            {subcategories.map(subcategory => (
                <div
                    key={subcategory.id}
                    ref={el => subcategoryRefs.current[subcategory.id] = el}
                    className="subcategory-section"
                >
                    <h2>{subcategory.name}</h2>
                    <div className="products-container">
                        {subcategory.products.map(product => (
                            <div
                                key={product.id}
                                className="product-card"
                                data-subcategory-id={product.subcategoryId}
                            >
                                <img src={product.image} alt={product.name} />
                                <div className="product-info">{product.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
});


export default function MainContent2({ subcategories }) {
    const [subcategoryId, setSubcategoryId] = useState(null);
    const subcategoryRefs = useRef({});
    const contentRef = useRef(null);
    const headerRef = useRef(null);

    let isProgrammaticScroll = false;

    useEffect(() => {
        // 初始化时设置第一个子类别为选中状态，并滚动到顶部
        setSubcategoryId(subcategories[0]?.id);
        if (contentRef.current) {
            contentRef.current.scrollTo(0, 0);
        }
    }, [subcategories]);

    const handleScroll = () => {
        // 根据滚动位置更新选中的子类别
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
    };

    useEffect(() => {
        // 使用防抖函数处理滚动事件，优化性能
        const contentElement = contentRef.current;

        if (contentElement) {
            contentElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (contentElement) {
                contentElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [subcategories, subcategoryId]);

    const handleSubcategoryClick = (id) => {
        isProgrammaticScroll = true;
        // 点击子类别按钮时触发滚动
        subcategoryRefs.current[id]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
        setSubcategoryId(id);
    };

    return (
        <div className="main">
            <Header
                subcategories={subcategories}
                subcategoryId={subcategoryId}
                onClickSubcategory={handleSubcategoryClick}
                ref={headerRef}
            />
            <Content
                subcategories={subcategories}
                subcategoryRefs={subcategoryRefs}
                ref={contentRef}
            />
        </div>
    );

}
