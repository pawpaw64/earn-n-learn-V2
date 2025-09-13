-- Add category columns to existing tables
-- This script should be run after the main schema.sql

-- Add category to jobs table
ALTER TABLE jobs ADD COLUMN category VARCHAR(50) DEFAULT 'Academic Help';

-- Add category to skill_marketplace table  
ALTER TABLE skill_marketplace ADD COLUMN category VARCHAR(50) DEFAULT 'Academic Help';

-- Add category to material_marketplace table
ALTER TABLE material_marketplace ADD COLUMN category VARCHAR(50) DEFAULT 'Academic Help';

-- Add category to skills table (user skills)
ALTER TABLE skills ADD COLUMN category VARCHAR(50);

-- Update predefined_skills with the five main categories
UPDATE predefined_skills SET category = 'Academic Help' WHERE category IN ('Languages', 'Writing', 'Research', 'Tutoring', 'Study Skills');
UPDATE predefined_skills SET category = 'Coding' WHERE category IN ('Programming', 'Web Development', 'Mobile Development', 'Database', 'DevOps', 'Backend', 'Frontend');
UPDATE predefined_skills SET category = 'Design' WHERE category IN ('UI/UX Design', 'Graphic Design', 'Video Editing', 'Animation', 'Photography');
UPDATE predefined_skills SET category = 'Marketing' WHERE category IN ('Digital Marketing', 'Social Media', 'Content Marketing', 'SEO', 'Analytics');
UPDATE predefined_skills SET category = 'Freelance' WHERE category IN ('Business', 'Consulting', 'Project Management', 'Communication', 'Customer Service');

-- Add indexes for better performance on category filtering
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_skill_marketplace_category ON skill_marketplace(category);
CREATE INDEX idx_material_marketplace_category ON material_marketplace(category);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_predefined_skills_category ON predefined_skills(category);