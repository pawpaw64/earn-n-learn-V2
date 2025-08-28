-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dbEarn_learn;

USE dbEarn_learn;

-- Users table
CREATE TABLE IF NOT EXISTS users (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    bio TEXT,
    student_id VARCHAR(50),
    university VARCHAR(100),
    course VARCHAR(100),
    program VARCHAR(100),
    graduation_year VARCHAR(10),
    mobile VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
                                      id INT AUTO_INCREMENT PRIMARY KEY,
                                      user_id INT NOT NULL,
                                      name VARCHAR(100) NOT NULL,
    description TEXT,
    acquired_from VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- Portfolio items table
CREATE TABLE IF NOT EXISTS portfolio_items (
                                               id INT AUTO_INCREMENT PRIMARY KEY,
                                               user_id INT NOT NULL,
                                               title VARCHAR(100) NOT NULL,
    description TEXT,
    url VARCHAR(255),
    type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_websites (
                                             id INT AUTO_INCREMENT PRIMARY KEY,
                                             user_id INT NOT NULL,
                                             title VARCHAR(100) NOT NULL,
    description TEXT,
    url VARCHAR(255),
    type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
                                    id INT AUTO_INCREMENT PRIMARY KEY,
                                    user_id INT NOT NULL,
                                    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    payment VARCHAR(100),
    deadline DATE,
    requirements TEXT,
    location VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- Job applications table
CREATE TABLE IF NOT EXISTS applications (
                                            id INT AUTO_INCREMENT PRIMARY KEY,
                                            job_id INT NOT NULL,
                                            user_id INT NOT NULL,
                                            cover_letter TEXT NOT NULL,
                                            phone VARCHAR(20),
    resume_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Pending',
    escrow_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;


-- Skills marketplace table (updated with image_url)
CREATE TABLE IF NOT EXISTS skill_marketplace (
                                                 id INT AUTO_INCREMENT PRIMARY KEY,
                                                 user_id INT NOT NULL,
                                                 skill_name VARCHAR(100) NOT NULL,
    description TEXT,
    pricing VARCHAR(100),
    availability VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- Material marketplace table (updated with image_url and deadline)
CREATE TABLE IF NOT EXISTS material_marketplace (
                                                    id INT AUTO_INCREMENT PRIMARY KEY,
                                                    user_id INT NOT NULL,
                                                    title VARCHAR(100) NOT NULL,
    description TEXT,
    conditions VARCHAR(50),
    price VARCHAR(100),
    availability VARCHAR(50),
    image_url VARCHAR(255),
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
                                        id INT AUTO_INCREMENT PRIMARY KEY,
                                        invoice_number VARCHAR(20) NOT NULL,
    user_id INT NOT NULL,
    client VARCHAR(100),
    title VARCHAR(100),
    amount DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'Pending',
    issued_date DATE,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- Skill applications/contacts table
CREATE TABLE IF NOT EXISTS skill_contacts (
                                              id INT AUTO_INCREMENT PRIMARY KEY,
                                              skill_id INT NOT NULL,
                                              user_id INT NOT NULL,
                                              message TEXT,
                                              status VARCHAR(20) DEFAULT 'Contact Initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skill_marketplace(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- Material contacts table
CREATE TABLE IF NOT EXISTS material_contacts (
                                                 id INT AUTO_INCREMENT PRIMARY KEY,
                                                 material_id INT NOT NULL,
                                                 user_id INT NOT NULL,
                                                 message TEXT,
                                                 status VARCHAR(20) DEFAULT 'Contact Initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (material_id) REFERENCES material_marketplace(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
                                             id INT AUTO_INCREMENT PRIMARY KEY,
                                             user_id INT NOT NULL,
                                             title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id INT,
    reference_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;