
-- bKash transactions table
CREATE TABLE IF NOT EXISTS bkash_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  wallet_transaction_id INT,
  payment_id VARCHAR(100) UNIQUE,
  trx_id VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BDT',
  intent VARCHAR(20) DEFAULT 'sale',
  merchant_invoice_number VARCHAR(100),
  status ENUM('created', 'completed', 'cancelled', 'failed') DEFAULT 'created',
  bkash_status VARCHAR(50),
  payment_type ENUM('topup', 'withdrawal') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (wallet_transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
  INDEX idx_payment_id (payment_id),
  INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB;

-- bKash user accounts table
CREATE TABLE IF NOT EXISTS bkash_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  account_holder_name VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_account (user_id, account_number)
) ENGINE=InnoDB;
