-- Create appointments table for service bookings
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    shop_id INT NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    vehicle_info TEXT,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- Create indexes for appointments
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_shop_id ON appointments(shop_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Add category column to products if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'category'
    ) THEN
        ALTER TABLE products ADD COLUMN category VARCHAR(50);
    END IF;
END $$;

COMMENT ON TABLE appointments IS 'Stores service appointment bookings';
COMMENT ON COLUMN appointments.service_type IS 'Type of service: car_wash, detailing, repair, maintenance, etc.';
COMMENT ON COLUMN appointments.status IS 'Status: pending, confirmed, completed, cancelled';
