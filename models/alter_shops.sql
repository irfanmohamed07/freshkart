-- Add category, rating, and is_official_dealer columns to shops table
-- This extends the existing schema without breaking it

-- Add category column (Mechanics, Parts Stores, Car Wash, Detailing, etc.)
ALTER TABLE shops ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Parts Stores';

-- Add rating column (1.0 to 5.0)
ALTER TABLE shops ADD COLUMN IF NOT EXISTS rating DECIMAL(2, 1) DEFAULT 4.0;

-- Add is_official_dealer column
ALTER TABLE shops ADD COLUMN IF NOT EXISTS is_official_dealer BOOLEAN DEFAULT FALSE;

-- Update existing shops with categories and ratings
UPDATE shops SET category = 'Parts Stores', rating = 4.5, is_official_dealer = TRUE WHERE id = 1;
UPDATE shops SET category = 'Mechanics', rating = 4.7, is_official_dealer = FALSE WHERE id = 2;
UPDATE shops SET category = 'Car Wash', rating = 4.3, is_official_dealer = FALSE WHERE id = 3;
UPDATE shops SET category = 'Detailing', rating = 4.6, is_official_dealer = TRUE WHERE id = 4;
