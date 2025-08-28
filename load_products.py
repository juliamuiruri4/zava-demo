#!/usr/bin/env python3
# Moved to data folder
# New path: data/load_products.py
#!/usr/bin/env python3
"""
Script to load product data from JSON file into Azure PostgreSQL database
with vector embeddings support.
"""

import json
try:
    import psycopg2
except ImportError:
    import psycopg2_binary as psycopg2
import numpy as np
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv(os.path.join(os.path.dirname(__file__), 'data/.env'))
DB_CONFIG = {
    'host': os.environ.get('DB_HOST'),
    'database': os.environ.get('DB_NAME'),
    'user': os.environ.get('DB_USER'),
    'password': os.environ.get('DB_PASSWORD'),
    'port': int(os.environ.get('DB_PORT', 5432)),
    'sslmode': os.environ.get('DB_SSLMODE', 'require')
}

def load_json_data(file_path: str) -> List[Dict[str, Any]]:
    """Load product data from JSON file and flatten the nested structure."""
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    products = []
    
    # Navigate through the nested structure
    if 'main_categories' in data:
        for main_category, category_data in data['main_categories'].items():
            for key, value in category_data.items():
                if key != 'washington_seasonal_multipliers' and isinstance(value, list):
                    # This is a subcategory with products
                    subcategory = key
                    for product in value:
                        if isinstance(product, dict):
                            # Add category and subcategory info to the product
                            product['category'] = main_category
                            product['subcategory'] = subcategory
                            # Generate a product_id if not present
                            if 'product_id' not in product:
                                product['product_id'] = f"{main_category}_{subcategory}_{len(products) + 1}"
                            products.append(product)
    
    return products

def generate_mock_embedding(text: str, dimensions: int = 1536) -> List[float]:
    """
    Generate a mock embedding vector for demonstration purposes.
    In production, you would use a real embedding service like OpenAI or Azure OpenAI.
    """
    # Create a deterministic but pseudo-random embedding based on text hash
    import hashlib
    text_hash = hashlib.md5(text.encode()).hexdigest()
    np.random.seed(int(text_hash[:8], 16))
    embedding = np.random.normal(0, 1, dimensions)
    # Normalize the vector
    norm = np.linalg.norm(embedding)
    normalized_embedding = embedding / norm
    # Convert to Python list to avoid PostgreSQL issues
    return normalized_embedding.tolist()

def insert_product(cursor, product: Dict[str, Any]) -> None:
    """Insert a single product into the database."""
    
    # Generate embeddings for the product
    name_embedding = generate_mock_embedding(product.get('name', ''))
    description_embedding = generate_mock_embedding(product.get('description', ''))
    image_embedding = generate_mock_embedding(product.get('image_url', ''))
    
    # Prepare the insert query
    insert_query = """
    INSERT INTO products (
        product_id, name, description, category, subcategory, price, brand,
        availability, stock_quantity, image_url, rating, reviews_count,
        specifications, tags, name_embedding, description_embedding, image_embedding
    ) VALUES (
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
    ) ON CONFLICT (product_id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        subcategory = EXCLUDED.subcategory,
        price = EXCLUDED.price,
        brand = EXCLUDED.brand,
        availability = EXCLUDED.availability,
        stock_quantity = EXCLUDED.stock_quantity,
        image_url = EXCLUDED.image_url,
        rating = EXCLUDED.rating,
        reviews_count = EXCLUDED.reviews_count,
        specifications = EXCLUDED.specifications,
        tags = EXCLUDED.tags,
        name_embedding = EXCLUDED.name_embedding,
        description_embedding = EXCLUDED.description_embedding,
        image_embedding = EXCLUDED.image_embedding,
        updated_at = CURRENT_TIMESTAMP;
    """
    
    # Extract and prepare data
    product_data = (
        product.get('product_id', ''),
        product.get('name', ''),
        product.get('description', ''),
        product.get('category', ''),
        product.get('subcategory', ''),
        float(product.get('price', 0)) if product.get('price') else None,
        product.get('brand', ''),
        product.get('availability', True),
        int(product.get('stock_quantity', 0)) if product.get('stock_quantity') else 0,
        product.get('image_url', ''),
        float(product.get('rating', 0)) if product.get('rating') else None,
        int(product.get('reviews_count', 0)) if product.get('reviews_count') else 0,
        json.dumps(product.get('specifications', {})),
        product.get('tags', []),
        name_embedding,
        description_embedding,
        image_embedding
    )
    
    cursor.execute(insert_query, product_data)

def main():
    """Main function to load data into PostgreSQL."""
    json_file_path = os.path.join(os.path.dirname(__file__), 'zava/product_data.json')
    
    try:
        # Load JSON data
        print("Loading JSON data...")
        products = load_json_data(json_file_path)
        print(f"Loaded {len(products)} products from JSON file")
        
        # Connect to PostgreSQL
        print("Connecting to PostgreSQL...")
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Insert products
        print("Inserting products into database...")
        successful_inserts = 0
        for i, product in enumerate(products):
            try:
                insert_product(cursor, product)
                successful_inserts += 1
                if (i + 1) % 10 == 0:
                    print(f"Inserted {successful_inserts} products successfully ({i + 1} processed)...")
            except Exception as e:
                print(f"Error inserting product {i + 1}: {e}")
                # Rollback the current transaction and start a new one
                conn.rollback()
                continue
        
        # Commit the transaction
        conn.commit()
        print(f"Successfully inserted {len(products)} products!")
        
        # Query some statistics
        cursor.execute("SELECT COUNT(*) FROM products;")
        total_products = cursor.fetchone()[0]
        print(f"Total products in database: {total_products}")
        
        cursor.execute("SELECT DISTINCT category FROM products WHERE category IS NOT NULL;")
        categories = [row[0] for row in cursor.fetchall()]
        print(f"Categories: {', '.join(categories)}")
        
    except Exception as e:
        print(f"Error: {e}")
        if 'conn' in locals():
            conn.rollback()
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
        print("Database connection closed.")

if __name__ == "__main__":
    main()
