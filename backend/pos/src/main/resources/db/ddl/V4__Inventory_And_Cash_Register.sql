-- V4__Inventory_Schema.sql

-- 1. Remove stock_quantity from products table
ALTER TABLE products
DROP COLUMN stock_quantity;

-- 2. Create inventory table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL UNIQUE REFERENCES products(id),
    quantity DECIMAL(10,3) NOT NULL DEFAULT 0,
    min_stock_alert DECIMAL(10,3) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create inventory_movement table
CREATE TABLE inventory_movement (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    movement_type VARCHAR(30) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    reference_id INTEGER, -- e.g., sale_id, purchase_id
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- 4. Update sales table
ALTER TABLE sales
ADD COLUMN cash_register_id INTEGER; -- To be referenced later

-- 5. Create cash_register_closure table
CREATE TABLE cash_register_closure (
    id SERIAL PRIMARY KEY,
    opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    opened_by INTEGER REFERENCES users(id),
    closed_by INTEGER REFERENCES users(id),
    initial_cash DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    system_cash DECIMAL(10,2),
    counted_cash DECIMAL(10,2),
    cash_difference DECIMAL(10,2),
    total_sales DECIMAL(10,2),
    total_cash DECIMAL(10,2),
    total_card DECIMAL(10,2),
    total_credit DECIMAL(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN'
);

-- 6. Add foreign key from sales to cash_register_closure
ALTER TABLE sales
ADD CONSTRAINT fk_sales_cash_register
FOREIGN KEY (cash_register_id)
REFERENCES cash_register_closure(id);

-- 7. Create cash_movement table
CREATE TABLE cash_movement (
    id SERIAL PRIMARY KEY,
    cash_register_id INTEGER REFERENCES cash_register_closure(id),
    movement_type VARCHAR(20) NOT NULL, -- IN | OUT
    reason VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);
