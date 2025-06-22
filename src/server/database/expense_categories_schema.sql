
-- Expense categories table for better financial tracking
CREATE TABLE IF NOT EXISTS expense_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6B7280',
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insert default categories
INSERT IGNORE INTO expense_categories (name, description, color, icon) VALUES
('Education', 'Educational expenses, courses, learning materials', '#3B82F6', 'graduation-cap'),
('Transport', 'Transportation costs, travel, commute', '#EF4444', 'car'),
('Food', 'Food and dining expenses', '#F59E0B', 'utensils'),
('Utilities', 'Utility bills, internet, electricity', '#10B981', 'zap'),
('Entertainment', 'Entertainment, movies, games', '#8B5CF6', 'play'),
('Withdrawals', 'Cash withdrawals and transfers', '#6B7280', 'arrow-up'),
('Escrow Deposits', 'Money held in escrow for transactions', '#0EA5E9', 'shield'),
('Other', 'Miscellaneous expenses', '#6B7280', 'more-horizontal');

-- Transaction categories junction table
CREATE TABLE IF NOT EXISTS transaction_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_transaction_category (transaction_id, category_id)
) ENGINE=InnoDB;
