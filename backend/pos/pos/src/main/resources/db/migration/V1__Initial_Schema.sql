-- 1. Suppliers (Proveedores)
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_name VARCHAR(100),
    phone VARCHAR(20),
    category VARCHAR(50) -- e.g., 'Refrescos', 'Panadería'
);

-- 2. Products (Productos)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    barcode VARCHAR(50) UNIQUE,
    name VARCHAR(150) NOT NULL,
    purchase_price DECIMAL(10,2), -- What you paid
    sale_price DECIMAL(10,2) NOT NULL, -- What the customer pays
    stock_quantity DECIMAL(10,3) DEFAULT 0, -- Support for KG (0.500)
    min_stock_alert DECIMAL(10,3) DEFAULT 5,
    supplier_id INTEGER REFERENCES suppliers(id)
);

-- 3. Customers (Clientes)
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    current_debt DECIMAL(10,2) DEFAULT 0.00
);

-- 4. Sales (Ventas)
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    payment_method VARCHAR(20), -- 'Cash', 'Card', 'Credit'
    customer_id INTEGER REFERENCES customers(id) -- Optional, only if 'Fiado'
);

-- 5. Sale Items
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- 6. Credit Transactions (History of Fiado)
CREATE TABLE credit_history (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    sale_id INTEGER REFERENCES sales(id),
    amount DECIMAL(10,2),
    transaction_type VARCHAR(20), -- 'DEBT' (when they buy) or 'PAYMENT' (when they pay you back)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255)
);
