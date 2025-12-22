-- ALTER TABLE commands to add shipping_address and phone columns to orders table
-- Run these commands in your PostgreSQL database if the table already exists

-- Add shipping_address column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;

-- Add phone column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;



