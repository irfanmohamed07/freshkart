-- Migration script to add shipping_address and phone columns to orders table
-- Run this if your database already exists and you need to add these columns

-- Add shipping_address column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'shipping_address'
    ) THEN
        ALTER TABLE orders ADD COLUMN shipping_address TEXT;
    END IF;
END $$;

-- Add phone column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'phone'
    ) THEN
        ALTER TABLE orders ADD COLUMN phone VARCHAR(50);
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;



