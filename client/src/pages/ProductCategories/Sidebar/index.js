import React, { useEffect, useRef } from 'react';
import '../index.scss';

export default function Sidebar({ categories, categoryId, onSelect }) {
    const sidebarRef = useRef(null);

    useEffect(() => {
        // 当 categoryId 改变时，对应的分类滚动到可视区域中间
        setTimeout(() => {
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
        }, 100);
    }, [categories, categoryId]);

    const handleCategoryClick = (id) => {
        onSelect(id);
    };

    return (
        <div className="sidebar" ref={sidebarRef}>
            <ul>
                {categories.map(category => (
                    <li key={category.id}
                        className={categoryId === category.id ? 'active' : ''}
                        onClick={() => handleCategoryClick(category.id)}>
                        {category.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};
