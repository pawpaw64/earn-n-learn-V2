
-- 1. First ensure users table exists (this should already exist)
-- If not, you'll need to create it first

-- 2. Create posts table (modified)
CREATE TABLE IF NOT EXISTS campus_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('question', 'discussion', 'announcement', 'poll') NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tags JSON,
  privacy ENUM('public', 'followers', 'groups') DEFAULT 'public',
  attachment_url VARCHAR(255),
  attachment_type VARCHAR(50),
  is_solved BOOLEAN DEFAULT FALSE,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_type (type),
  INDEX idx_created_at (created_at),
  INDEX idx_privacy (privacy)
) ENGINE=InnoDB;

-- 3. Create poll options table
CREATE TABLE IF NOT EXISTS campus_poll_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  option_text VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES campus_posts(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id)
) ENGINE=InnoDB;

-- 4. Create poll votes table
CREATE TABLE IF NOT EXISTS campus_poll_votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  option_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (option_id) REFERENCES campus_poll_options(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_poll_vote (option_id, user_id),
  INDEX idx_option_id (option_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- 5. Create tags table
CREATE TABLE IF NOT EXISTS campus_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(50),
  posts_count INT DEFAULT 0,
  followers_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_category (category)
) ENGINE=InnoDB;

-- 6. Create comments table
CREATE TABLE IF NOT EXISTS campus_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  parent_id INT,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES campus_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES campus_comments(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id),
  INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB;

-- 7. Create post likes table
CREATE TABLE IF NOT EXISTS campus_post_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES campus_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_like (post_id, user_id)
) ENGINE=InnoDB;

-- 8. Create comment likes table
CREATE TABLE IF NOT EXISTS campus_comment_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comment_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (comment_id) REFERENCES campus_comments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_comment_like (comment_id, user_id)
) ENGINE=InnoDB;

-- 9. Create tag followers table
CREATE TABLE IF NOT EXISTS campus_tag_followers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tag_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tag_id) REFERENCES campus_tags(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_tag_follow (tag_id, user_id)
) ENGINE=InnoDB;
