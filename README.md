# 仿淘宝商品分类页面项目

## 模仿 & 实现页面

模仿：<img src="img.png" alt="img" height="400"/>

实现：<img src="demo.gif" alt="demo" height="400"/>!

## 总体设计

本项目使用ReactJS作为前端框架，Express.js作为后端服务器，通过REST API与前端进行数据交互。该页面中主要包含两个部分：分类侧边栏（Sidebar）和主内容区（MainContent）。

**功能描述**：

1. **分类数据展示**：页面加载时自动展示左侧的商品分类和首个分类的商品内容。
2. **动态内容更新**：
    - 点击左侧分类，右侧展示该分类下的商品，且点击的分类名称会自动居中。
    - 点击右侧顶部筛选项，根据筛选条件刷新商品显示，并使选中的筛选项自动居中。
3. **Loading效果**：在数据加载时显示Loading效果，提高用户体验。
4. **滚动联动效果**：在商品内容区滚动时，顶部筛选项会根据显示的商品自动切换并居中。
5. **响应式**：页面在不同设备上均能正常显示，且在移动端上有更好的交互体验。
6. **后端模拟**：使用Express.js和JSON文件模拟数据接口，实现前后端分离的开发模式。

## 技术栈

- **前端**：ReactJS, HTML, CSS/SCSS
- **后端**：Express.js
- **数据接口**：REST API

## 目录结构

```
/project-root
|-- client/                     # 客户端代码
    |-- public/                 # 公共静态资源
    |-- src/                    # 源代码目录
        |-- apis/               # API调用相关
        |-- pages/              # 页面组件
            |-- MainContent     # 主内容组件
                |-- index.js    # 主内容组件入口
                |-- indexV2.js  # 主内容组件入口（V2,V3)
            |-- Sidebar         # 侧边栏组件
                |-- index.js    # 侧边栏组件入口
            |-- index.js        # 页面入口
            |-- index.scss      # 页面样式
        |-- App.js              # 应用入口
        |-- index.js            # React渲染入口
    |-- package.json            # 项目依赖
    |-- package-lock.json       # 项目依赖锁定文件
|-- server/                     # 服务器端代码
|-- package.json                # 项目依赖
|-- package-lock.json           # 项目依赖锁定文件
|-- README.md                   # 项目说明文件
```

## 运行项目

1. **下载项目**:

   ```bash
   git clone https://github.com/Skymore/Taobao-like-Product-Category-Page.git

2. **安装依赖**：

   ```bash
   npm install
   ```

3. **启动前端和后端服务器**：

   ```bash
   node run dev
   ```

   访问 `http://localhost:3000` 来查看应用。

## API 接口

### 获取一级分类列表和首个一级分类下具体内容

- **方法**：GET
- **URL**：`/categories`
- **响应**：

  ```json
  {
    "categories": [
        {
            "id": 1,
            "name": "生鲜"
        },
        {
            "id": 2,
            "name": "电器"
        }
    ],
     "firstCategory": {
        "id": 1,
        "name": "生鲜",
        "subcategories": [
            {
                "id": 1,
                "name": "生鲜测试一",
                "products": [
                    {
                        "id": 1,
                        "name": "产品A 1",
                        "image": "images/image0.webp",
                        "subcategoryId": 1
                    },
                    {
                        "id": 2,
                        "name": "产品J 2",
                        "image": "images/image5.webp",
                        "subcategoryId": 1
                    },
                    {
                        "id": 3,
                        "name": "产品E 3",
                        "image": "images/image4.webp",
                        "subcategoryId": 1
                    }
                ]
            }
        ]
    }
  }
  ```

### 获取指定一级分类下的具体内容

- **方法**：GET
- **URL**：`/categories/:id`
- **示例**：`http://localhost:3004/categories/1`
- **响应**：

  ```json
  {
    "id": 1,
    "name": "电子产品",
    "subcategories": [
      {
        "id": 1,
        "name": "手机",
        "products": [
          {"id": 1, "name": "iPhone 12", "image": "images/image0.webp", "subcategoryId": 1},
          {"id": 2, "name": "Samsung Galaxy S20", "image": "images/image1.webp", "subcategoryId": 1}
        ]
      },
      {
        "id": 2,
        "name": "电脑",
        "products": [
          {"id": 3, "name": "MacBook Pro", "image": "images/image2.webp", "subcategoryId": 2},
          {"id": 4, "name": "Dell XPS 13", "image": "images/image3.webp", "subcategoryId": 2}
        ]
      }
    ]
  }
  ```

## 开源许可

本项目采用MIT许可证，详情请参见[LICENSE](https://github.com/Skymore/Taobao-like-Product-Category-Page/blob/main/LISENCE)文件。

## 技术实现细节

### 1. 主页面

**文件位置**：`client/src/pages/ProductCategories/index.js`

**功能描述**：
- 页面的入口文件，包含了分类侧边栏和主内容区组件。
- 通过调用API获取一级分类列表和首个分类下的商品数据。
- 使用`useState`和`useEffect`来管理和更新页面的状态。
- 使用`fetchCategories`和`fetchSubcategories`函数来获取分类数据和特定分类下的商品数据。
- 使用`Loading`组件来展示数据加载时的Loading效果。
- 使用`Sidebar`和`MainContent`组件来展示分类侧边栏和主内容区。
- 使用`index.scss`文件来定义页面的样式。

### 2. 分类侧边栏（Sidebar）

**文件位置**：`client/src/pages/ProductCategories/Sidebar/index.js`

**功能描述**：
- 显示所有商品的一级分类。
- 允许用户通过点击不同的分类来更新主内容区显示的商品。
- 点击分类后，该分类项自动滚动到侧边栏的中心位置。

**实现细节**：
- 使用`useState`来管理当前选中的分类`categoryId`。
- 使用`useEffect`来处理初次加载和分类点击后的数据更新。
- 利用CSS的`scrollIntoView`方法实现点击分类后自动滚动到中心的效果。
- 当用户点击某个分类时，`categoryId`状态更新，触发组件重新渲染，同时调用API获取新分类的商品数据，数据获取后，更新状态并重新渲染商品显示区域。

### 3. 主内容区（MainContent）

**文件位置**：`client/src/pages/ProductCategories/MainContent/indexV2.js`

**功能描述**：
- 显示选中分类下的所有子分类及其商品。
- 允许用户通过顶部筛选条切换不同的子分类。
- 随着用户滚动，顶部筛选条自动更新以反映当前可见的子分类。

**实现细节**：
- 使用了 throttle 方法来控制 handleScroll 函数的执行频率，设定为每200毫秒最多执行一次。
- 在点击二级分类按钮时，使用了 scrollIntoView 方法跳转到指定的二级分类。
- 在 Header 组件中为每个按钮添加了 ref，并在 MainContent2 组件中通过 buttonRefs 管理这些引用。
- 添加滚动事件监听器，根据滚动的位置动态设置当前活跃的子类别ID，并调整头部导航的滚动位置以保证活跃按钮居中显示。
- 在滚动事件中，根据滚动的位置动态设置当前活跃的子类别ID，并调整头部导航的滚动位置以保证活跃按钮居中显示。
- 在点击事件中，根据点击的按钮的索引值，调整滚动位置，根据内容的滚动位置来更新`subcategoryId`状态。

### 4. 数据处理

**文件位置**：`client/src/apis/categoryService.js`

**功能描述**：
- 从后端API获取分类数据和子分类下的商品数据。

**实现细节**：
- 使用`axios`库向后端发送HTTP请求。
- 封装`fetchCategories`和`fetchSubcategories`函数，分别用于获取一级分类列表和指定分类下的子分类及商品。

### 5. 样式

**文件位置**：`client/src/pages/ProductCategories/index.scss`

**功能描述**：
- 定义应用的全局和组件级别的样式。

### 6. 后端模拟

**文件位置**：`server/index.js`

**功能描述**：
- 提供静态文件服务。
- 模拟REST API，返回商品分类和商品数据。

**实现细节**：
- 使用Express.js创建简单的服务器。
- 使用JSON文件存储静态数据，通过API端点返回相应的数据。
