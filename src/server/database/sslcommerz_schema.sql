-- Pending escrow transactions table for SSLCommerz processing
CREATE TABLE IF NOT EXISTS pending_escrow_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id VARCHAR(100) NOT NULL UNIQUE,
  job_id INT,
  skill_id INT,
  material_id INT,
  provider_id INT NOT NULL,
  client_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
  FOREIGN KEY (skill_id) REFERENCES skill_marketplace(id) ON DELETE SET NULL,
  FOREIGN KEY (material_id) REFERENCES material_marketplace(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Update transactions table to support SSLCommerz reference types
ALTER TABLE transactions MODIFY COLUMN reference_type VARCHAR(50);

-- Add index for faster lookups
CREATE INDEX idx_transactions_reference ON transactions(reference_id, reference_type);
CREATE INDEX idx_pending_escrow_transaction_id ON pending_escrow_transactions(transaction_id);