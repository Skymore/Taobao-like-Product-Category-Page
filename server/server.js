const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());

app.set('json spaces', 4);

// 设置静态图片目录
app.use('/images', express.static(path.join(__dirname, 'images')));

// 获取一级分类列表和首个分类的详细信息
app.get('/categories', (req, res) => {
    fs.readFile('server/db.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }
        const db = JSON.parse(data);
        const categories = db.categories.map(cat => ({ id: cat.id, name: cat.name }));
        const firstCategory = db.categories[0];  // 获取第一个分类的详细信息

        // 返回一级分类列表和首个分类的详细信息
        res.json({
            categories: categories,
            firstCategory: firstCategory
        });
    });
});

// 获取某个分类的详细信息
app.get('/categories/:id', (req, res) => {
    const categoryId = parseInt(req.params.id);
    fs.readFile('server/db.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }
        const db = JSON.parse(data);
        const category = db.categories.find(cat => cat.id === categoryId);
        if (category) {
            res.json(category);
        } else {
            res.status(404).send('Category not found');
        }
    });
});

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

