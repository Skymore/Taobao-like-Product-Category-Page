import json
import random

# Path to your JSON file
file_path = 'db.json'

# Load JSON data from the file
def load_data(filepath):
    with open(filepath, 'r') as file:
        return json.load(file)

# Save JSON data to the file
def save_data(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# Update the image paths in the data
def update_images(data):
    for category in data['categories']:
        for subcategory in category['subcategories']:
            for product in subcategory['products']:
                # Generate a random number for the image name
                new_image_number = random.randint(0, 6)
                product['image'] = f'images/image{new_image_number}.webp'
    return data

# Main function to process the updates
def process_updates(filepath):
    data = load_data(filepath)
    updated_data = update_images(data)
    save_data(filepath, updated_data)

# Call the main function with the path to your JSON file
if __name__ == '__main__':
    process_updates(file_path)
