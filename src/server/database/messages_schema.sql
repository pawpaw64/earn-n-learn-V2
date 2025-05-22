
-- Messages Schema

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NULL,
  creator_id INT NOT NULL,
  is_group TINYINT(1) DEFAULT 0,
  last_message TEXT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Conversation participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  user_id INT NOT NULL,
  is_admin TINYINT(1) DEFAULT 0,
  joined_at DATETIME NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY conv_user (conversation_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  sender_id INT NULL,
  content TEXT NOT NULL,
  attachment_url VARCHAR(255) NULL,
  is_system_message TINYINT(1) DEFAULT 0,
  sent_at DATETIME NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);
