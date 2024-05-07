# Taobao-like Product Category Page Project

## Imitation & Implementation

Imitation: <img src="img.png" alt="img" height="400"/>
Implementation:<img src="demo.gif" alt="demo" height="400"/>!

## Overall Design

This project uses ReactJS as the frontend framework and Express.js as the backend server, interacting with the frontend through REST APIs. The page mainly consists of two parts: the Sidebar and MainContent.

**Functional Description**:

1. **Category Data Display**: Automatically display the product categories on the left and the products of the first category when the page loads.
2. **Dynamic Content Update**:
   - Click on the left-side category to display the products under that category on the right, and the clicked category name will automatically center.
   - Click the top category item on the right to refresh the product display according to the category conditions, and make the selected category item automatically center.
3. **Loading Effect**: Show a loading effect while data is loading to enhance user experience.
4. **Scroll Linkage Effect**: When scrolling in the product content area, the top category items will automatically switch and center according to the displayed products.
5. **Responsive**: The page displays normally on different devices and offers a better interaction experience on mobile devices.
6. **Backend Simulation**: Use Express.js and JSON files to simulate data interfaces, implementing a front-end and back-end separation development model.

## Tech Stack

- **Frontend**: ReactJS, HTML, CSS/SCSS
- **Backend**: Express.js
- **Data Interface**: REST API

## Directory Structure

    /project-root
        |-- client/                     # Client code
            |-- public/                 # Public static resources
            |-- src/                    # Source code directory
                |-- apis/               # API related
                |-- pages/              # Page components
                    |-- MainContent     # Main Content component
                        |-- index.js    # Main Content component entry
                        |-- indexV2.js  # Main Content component entry (V2,V3)
                    |-- Sidebar         # Sidebar component
                        |-- index.js    # Sidebar component entry
                    |-- index.js        # Page entry
                    |-- index.scss      # Page styles
                |-- App.js              # App entry
                |-- index.js            # React rendering entry
            |-- package.json            # Project dependencies
            |-- package-lock.json       # Project dependency lock file
        |-- server/                     # Server-side code
        |-- package.json                # Project dependencies
        |-- package-lock.json           # Project dependency lock file
        |-- README.md                   # Project documentation

## Running the Project

1. **Download the project**:
   ```
   git clone https://github.com/Skymore/Taobao-like-Product-Category-Page.git
   ```
2. **Install dependencies**:
   ```
   npm install
   ```
3. **Start the frontend and backend servers**:
   ```
   node run dev
   ```
   Visit `http://localhost:3000` to view the application.

## API Interface

### Get a list of primary categories and the specific contents under the first primary category

- **Method**: GET
- **URL**: `/categories`
- **Response**:

  ```json
  {
    "categories": [
        {
            "id": 1,
            "name": "Fresh Food"
        },
        {
            "id": 2,
            "name": "Electronics"
        }
    ],
     "firstCategory": {
        "id": 1,
        "name": "Fresh Food",
        "subcategories": [
            {
                "id": 1,
                "name": "Fresh Food Test One",
                "products": [
                    {
                        "id": 1,
                        "name": "Product A 1",
                        "image": "images/image0.webp",
                        "subcategoryId": 1
                    },
                    {
                        "id": 2,
                        "name": "Product J 2",
                        "image": "images/image5.webp",
                        "subcategoryId": 1
                    },
                    {
                        "id": 3,
                        "name": "Product E 3",
                        "image": "images/image4.webp",
                        "subcategoryId": 1
                    }
                ]
            }
        }
    }
  }
  ```

### Get the specific contents under a designated primary category

- **Method**: GET
- **URL**: `/categories/:id`
- **Example**: `http://localhost:3004/categories/1`
- **Response**:

  ```json
  {
    "id": 1,
    "name": "Electronics",
    "subcategories": [
      {
        "id": 1,
        "name": "Phones",
        "products": [
          {"id": 1, "name": "iPhone 12", "image": "images/image0.webp", "subcategoryId": 1},
          {"id": 2, "name": "Samsung Galaxy S20", "image": "images/image1.webp", "subcategoryId": 1}
        ]
      },
      {
        "id": 2,
        "name": "Computers",
        "products": [
          {"id": 3, "name": "MacBook Pro", "image": "images/image2.webp", "subcategoryId": 2},
          {"id": 4, "name": "Dell XPS 13", "image": "images/image3.webp", "subcategoryId": 2}
        ]
      }
    ]
  }
  ```

