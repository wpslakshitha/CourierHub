CREATE DATABASE pern_project;

-- Connect to the database
\c pern_project;

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(10) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Shipments Table
CREATE TABLE shipments (
  id SERIAL PRIMARY KEY,
  tracking_number VARCHAR(20) UNIQUE NOT NULL,
  
  -- Sender information (linked to user profile)
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  sender_name VARCHAR(100) NOT NULL,
  sender_email VARCHAR(100) NOT NULL,
  sender_phone VARCHAR(20),
  sender_address TEXT NOT NULL,
  sender_city VARCHAR(100) NOT NULL,
  sender_state VARCHAR(100) NOT NULL,
  sender_zip VARCHAR(20) NOT NULL,
  sender_country VARCHAR(100) NOT NULL,
  
  -- Recipient details
  recipient_name VARCHAR(100) NOT NULL,
  recipient_email VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20),
  recipient_address TEXT NOT NULL,
  recipient_city VARCHAR(100) NOT NULL,
  recipient_state VARCHAR(100) NOT NULL,
  recipient_zip VARCHAR(20) NOT NULL,
  recipient_country VARCHAR(100) NOT NULL,
  
  -- Shipment details
  package_type VARCHAR(50) NOT NULL,
  weight NUMERIC(10, 2) NOT NULL,
  
  -- Store dimensions as separate fields for better querying
  length NUMERIC(10, 2),
  width NUMERIC(10, 2),
  height NUMERIC(10, 2),
  
  description TEXT,
  declared_value NUMERIC(10, 2),
  delivery_notes TEXT,
  
  -- Shipping options
  shipping_method VARCHAR(50) NOT NULL,
  service_type VARCHAR(50) NOT NULL,
  insurance BOOLEAN DEFAULT FALSE,
  signature_required BOOLEAN DEFAULT FALSE,
  
  -- System fields
  estimated_delivery_date TIMESTAMP NOT NULL,
  shipping_cost NUMERIC(10, 2) NOT NULL,
  special_instructions TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tracking History Table
CREATE TABLE tracking_history (
  id SERIAL PRIMARY KEY,
  shipment_id INTEGER REFERENCES shipments(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL,
  location VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);


-- Shipment Status History Table
CREATE TABLE shipment_status (
  id SERIAL PRIMARY KEY,
  shipment_id INTEGER REFERENCES shipments(id),
  status VARCHAR(20) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add this at the end of your schema.sql file
GRANT ALL PRIVILEGES ON TABLE users TO projectuser;
GRANT ALL PRIVILEGES ON TABLE shipments TO projectuser;
GRANT ALL PRIVILEGES ON TABLE shipment_status TO projectuser;
-- Insert an admin user (password: admin123)
INSERT INTO users (name, email, password, address, phone, role)
VALUES ('Admin User', 'admin@courier.com', '$2b$10$BQzeAHY5CJjgX8QwQpJJMeG.AUzXtU5ft6MwB/3MULhHT3Wx1XyLO', 'Admin Office', '1234567890', 'admin');