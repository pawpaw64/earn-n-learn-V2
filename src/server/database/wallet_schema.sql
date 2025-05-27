
-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  last4 VARCHAR(4) NOT NULL,
  provider VARCHAR(50) DEFAULT 'card',
  expiry_month VARCHAR(2),
  expiry_year VARCHAR(4),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type ENUM('deposit', 'withdrawal', 'payment', 'escrow', 'release', 'dispute') NOT NULL,
  status ENUM('completed', 'pending', 'failed') NOT NULL DEFAULT 'completed',
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reference_id INT,
  reference_type VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Savings goals table
CREATE TABLE IF NOT EXISTS savings_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  deadline DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Escrow transactions table with progress tracking
CREATE TABLE IF NOT EXISTS escrow_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT,
  skill_id INT,
  material_id INT,
  provider_id INT NOT NULL,
  client_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending_acceptance', 'funds_deposited', 'in_progress', 'completed', 'released', 'disputed', 'refunded') NOT NULL DEFAULT 'pending_acceptance',
  description VARCHAR(255),
  accepted_by_provider BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMP NULL,
  progress_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
  FOREIGN KEY (skill_id) REFERENCES skill_marketplace(id) ON DELETE SET NULL,
  FOREIGN KEY (material_id) REFERENCES material_marketplace(id) ON DELETE SET NULL
) ENGINE=InnoDB;
