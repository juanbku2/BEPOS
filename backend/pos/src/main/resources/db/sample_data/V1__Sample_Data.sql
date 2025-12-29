-- Insert Users (password is 'password' hashed with BCrypt)
-- Note: You should use a secure way to handle passwords in a real application
INSERT INTO users (username, first_name, last_name, email, password, role) VALUES
('admin', 'Admin', 'Admin', 'admin@bepos.mx', '$2a$10$PeiphQ52x/I.LvddjTC6QO6sGWO.5ORwMnq6dlQRGvql9y.GKjcVy', 'ADMIN')   

-- Insert Suppliers
INSERT INTO suppliers (name, contact_name, phone, category) VALUES
('Coca-Cola Femsa', 'Juan Perez', '800-704-4400', 'Bebidas'),
('Bimbo', 'Maria Lopez', '800-910-2222', 'Panaderia'),
('Sabritas', 'Carlos Sanchez', '800-907-2200', 'Botanas');

-- Insert Products
INSERT INTO products (barcode, name, purchase_price, sale_price, stock_quantity, min_stock_alert, supplier_id) VALUES
('7501055300075', 'Coca-Cola 600ml', 10.50, 15.00, 100, 20, 1),
('7501000100018', 'Gansito', 8.00, 12.00, 50, 15, 2),
('7501011119566', 'Sabritas Originales 45g', 9.50, 14.00, 80, 25, 3);

-- Insert Customers
INSERT INTO customers (full_name, phone, current_debt) VALUES
('Juan Cliente Fiel', '55-1234-5678', 0.00),
('Maria Vecina', '55-8765-4321', 50.00);
