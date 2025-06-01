
-- bKash transactions table
CREATE TABLE IF NOT EXISTS bkash_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  payment_id VARCHAR(255) NOT NULL,
  trx_id VARCHAR(255),
  merchant_invoice_number VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BDT',
  intent VARCHAR(20) DEFAULT 'sale',
  payment_status VARCHAR(50) DEFAULT 'Initiated',
  transaction_status VARCHAR(50) DEFAULT 'Initiated',
  customer_msisdn VARCHAR(15),
  payment_execute_time TIMESTAMP NULL,
  payment_create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_payment_id (payment_id),
  INDEX idx_merchant_invoice (merchant_invoice_number),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Update payment_methods table to support bKash
ALTER TABLE payment_methods 
ADD COLUMN bkash_account_number VARCHAR(15) NULL,
ADD COLUMN verification_status ENUM('pending', 'verified', 'failed') DEFAULT 'pending';
