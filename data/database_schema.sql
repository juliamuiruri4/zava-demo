...existing code...
-- Moved to data folder
-- New path: data/database_schema.sql
-- First, let's create the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify the extension is installed
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Create the products table with vector columns for embeddings
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(200),
    subcategory VARCHAR(200),
    price DECIMAL(10, 2),
    brand VARCHAR(200),
    availability BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    rating DECIMAL(3, 2),
    reviews_count INTEGER DEFAULT 0,
    specifications JSONB,
    tags TEXT[],
    
    -- Vector embeddings for AI search capabilities
    -- Assuming 1536 dimensions for OpenAI embeddings (text-embedding-ada-002)
    name_embedding vector(1536),
    description_embedding vector(1536),
    image_embedding vector(1536),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability);

-- Create HNSW indexes for vector similarity search
CREATE INDEX IF NOT EXISTS idx_products_name_embedding 
ON products USING hnsw (name_embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_products_description_embedding 
ON products USING hnsw (description_embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_products_image_embedding 
ON products USING hnsw (image_embedding vector_cosine_ops);

-- Create a categories table for better normalization
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    parent_category_id INTEGER REFERENCES categories(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a brands table
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    customer_name VARCHAR(200),
    customer_email VARCHAR(300),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    helpful_votes INTEGER DEFAULT 0,
    verified_purchase BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory_tracking table
CREATE TABLE IF NOT EXISTS inventory_tracking (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('IN', 'OUT', 'ADJUSTMENT')),
    quantity_change INTEGER NOT NULL,
    previous_quantity INTEGER,
    new_quantity INTEGER,
    reason VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(200)
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create some sample categories based on typical retail categories
INSERT INTO categories (name, description) VALUES
('Paint & Stain', 'Interior and exterior paints, stains, and related products'),
('Tools & Hardware', 'Hand tools, power tools, and hardware items'),
('Flooring', 'Various flooring materials and accessories'),
('Home Improvement', 'General home improvement and renovation products'),
('Storage & Organization', 'Storage solutions and organizational products')
ON CONFLICT (name) DO NOTHING;

-- Create some sample brands
INSERT INTO brands (name, description) VALUES
('Zava', 'Premium home improvement and paint products'),
('ProPaint', 'Professional grade paint solutions'),
('FloorMaster', 'Quality flooring materials'),
('ToolCraft', 'Reliable tools and hardware')
ON CONFLICT (name) DO NOTHING;

-- Create a view for product search with category and brand names
CREATE OR REPLACE VIEW products_detailed AS
SELECT 
    p.*,
    c.name as category_name,
    b.name as brand_name
FROM products p
LEFT JOIN categories c ON p.category = c.name
LEFT JOIN brands b ON p.brand = b.name;

-- Create a function for similarity search
CREATE OR REPLACE FUNCTION find_similar_products(
    query_embedding vector(1536),
    similarity_threshold FLOAT DEFAULT 0.7,
    max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    product_id VARCHAR(50),
    name VARCHAR(500),
    description TEXT,
    category VARCHAR(200),
    price DECIMAL(10, 2),
    similarity_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.product_id,
        p.name,
        p.description,
        p.category,
        p.price,
        (1 - (p.description_embedding <=> query_embedding)) as similarity_score
    FROM products p
    WHERE p.description_embedding IS NOT NULL
        AND (1 - (p.description_embedding <=> query_embedding)) >= similarity_threshold
    ORDER BY p.description_embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Display current extensions and confirm vector is available
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';

-- Show the created tables
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
