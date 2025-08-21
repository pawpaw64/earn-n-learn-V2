-- Add category column to jobs table
ALTER TABLE jobs ADD COLUMN category VARCHAR(50) DEFAULT 'freelance';

-- Add category column to skill_marketplace table  
ALTER TABLE skill_marketplace ADD COLUMN category VARCHAR(50) DEFAULT 'freelance';

-- Add category column to material_marketplace table
ALTER TABLE material_marketplace ADD COLUMN category VARCHAR(50) DEFAULT 'freelance';

-- Update existing records with default category if needed
UPDATE jobs SET category = 'freelance' WHERE category IS NULL;
UPDATE skill_marketplace SET category = 'freelance' WHERE category IS NULL;
UPDATE material_marketplace SET category = 'freelance' WHERE category IS NULL;