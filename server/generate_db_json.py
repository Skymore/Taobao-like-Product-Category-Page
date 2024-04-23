import json
import random

def generate_data():
    # 设置分类、子分类和产品的名称
    categories_names = [
        "生鲜", "电器", "数码", "内衣", "进口", "女装", "食品", "手机", "鞋靴", "母婴",
        "饰品", "箱包", "男装", "车品", "百货", "图书", "洗护", "运动", "美妆", "家装",
        "企业", "保健", "医药", "奢品"
    ]
    subcategories_examples = ["系列1", "系列2", "系列3", "系列4", "系列5", "系列6", "系列7", "系列8", "系列9", "系列10"]
    products_examples = ["产品A", "产品B", "产品C", "产品D", "产品E", "产品F", "产品G", "产品H", "产品I", "产品J"]

    # Build the data structure
    db = {"categories": []}
    category_id = 1
    subcat_id = 1
    product_id = 1

    for cat_name in categories_names:
        subcategories = []
        for subcat_suffix in subcategories_examples:
            products = []
            num_products = random.randint(5, 10)  # Each subcategory has 5-10 products
            for _ in range(num_products):
                product_name = random.choice(products_examples) + f" {product_id}"
                products.append({
                    "id": product_id,
                    "name": product_name,
                    "image": f"images/image.webp"
                })
                product_id += 1
            subcategories.append({
                "id": subcat_id,
                "name": f"{cat_name} {subcat_suffix}",
                "products": products
            })
            subcat_id += 1
        db["categories"].append({
            "id": category_id,
            "name": cat_name,
            "subcategories": subcategories
        })
        category_id += 1

    # Save the db.json content to a file
    db_json_path = 'db.json'
    with open(db_json_path, 'w') as file:
        json.dump(db, file, ensure_ascii=False, indent=4)

    print(f"db.json file generated at {db_json_path}")

if __name__ == "__main__":
    generate_data()
