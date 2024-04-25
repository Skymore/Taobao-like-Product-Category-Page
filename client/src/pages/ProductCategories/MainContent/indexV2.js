import React, { useCallback, useEffect, useRef, useState } from 'react';
import { throttle } from "lodash";
import '../index.scss';

// 头部组件，展示子类别按钮
const Header = React.forwardRef(({ subcategories, subcategoryId, buttonRefs, onClickSubcategory }, ref) => {
    return (
        <div ref={ref} className="header">
            {subcategories.map(subcategory => (
                <button
                    className={subcategoryId === subcategory.id ? 'active' : ''}
                    key={subcategory.id}
                    ref={el => buttonRefs.current[subcategory.id] = el}
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
                    className="subcategory-section"
                    ref={el => subcategoryRefs.current[subcategory.id] = el}
                >
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
            ))}
        </div>
    );
});

// 主组件
export default function MainContent2({ subcategories }) {
    const [subcategoryId, setSubcategoryId] = useState(null);
    const subcategoryRefs = useRef({});
    const buttonRefs = useRef({});
    const contentRef = useRef(null);
    const headerRef = useRef(null);
    const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);


    // 初始化时设置第一个子类别为选中状态，并滚动到顶部
    useEffect(() => {
        setSubcategoryId(subcategories[0]?.id);
        if (contentRef.current) {
            contentRef.current.scrollTo(0, 0);
        }
    }, [subcategories]);

    // 处理滚动事件的节流函数
    const handleScroll = useCallback(throttle(() => {
        let currId = "";
        const scrollPosition = contentRef.current.scrollTop;
        const maxScroll = contentRef.current.scrollHeight - contentRef.current.clientHeight;

        // 遍历所有子类别，找到当前滚动位置顶部的子类别
        subcategories.forEach(subcategory => {
            const ref = subcategoryRefs.current[subcategory.id];
            if (ref && ref.offsetTop <= scrollPosition + 100) {
                currId = subcategory.id;
            }
        });

        // 获取第一个和最后一个子分类的引用
        const firstSubcatRef = subcategoryRefs.current[subcategories[0].id];
        const lastSubcatRef = subcategoryRefs.current[subcategories[subcategories.length - 1].id];

        // 获取第一个和最后一个子分类元素的高度
        const firstElemHeight = firstSubcatRef ? firstSubcatRef.clientHeight : 0;
        const lastElemHeight = lastSubcatRef ? lastSubcatRef.clientHeight : 0;

        // 特殊情况：顶部和底部检查
        if (scrollPosition <= firstElemHeight / 5) {
            // 滚动到顶部小于第一个元素的20%高度
            currId = subcategories[0].id;
        } else if (scrollPosition >= maxScroll - lastElemHeight / 5) {
            // 滚动到底部小于最后一个元素的20%高度
            currId = subcategories[subcategories.length - 1].id;
        }

        setSubcategoryId(currId);
        ensureVisible(currId);
    },100), [isProgrammaticScroll, subcategories]);

    // 确保当前活跃的按钮在可视区域中
    const ensureVisible = (id) => {
        const activeElement = buttonRefs.current[id];
        if (activeElement && headerRef.current) {
            const headerRect = headerRef.current.getBoundingClientRect();
            const elemRect = activeElement.getBoundingClientRect();

            // 计算当前元素中心点与容器中心点的差距
            const delta = (elemRect.left + elemRect.right) / 2 - (headerRect.left + headerRect.right) / 2;

            // 更新header的滚动位置，使元素居中
            // headerRef.current.scrollLeft += delta;
            headerRef.current.scrollTo({
                left: headerRef.current.scrollLeft + delta,
                behavior: 'instant',
            });
        }
    };

    // 添加和移除滚动事件监听器
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.addEventListener('scroll', handleScroll);
            return () => {
                contentRef.current.removeEventListener('scroll', handleScroll);
            };
        }
    }, [handleScroll]);

    const handleSubcategoryClick = (id) => {
        // 点击子类别按钮时触发滚动
        subcategoryRefs.current[id]?.scrollIntoView({
            behavior: 'instant',
            block: 'start',
        });
        setSubcategoryId(id);
    };

    return (
        <div className="main">
            <Header
                subcategories={subcategories}
                subcategoryId={subcategoryId}
                buttonRefs={buttonRefs}
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
