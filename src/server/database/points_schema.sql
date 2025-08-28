-- Points and Leaderboard System Schema

USE dbEarn_learn;

-- User points table
CREATE TABLE IF NOT EXISTS user_points (
                                           id INT AUTO_INCREMENT PRIMARY KEY,
                                           user_id INT NOT NULL,
                                           points INT DEFAULT 0,
                                           tasks_completed_points INT DEFAULT 0,
                                           skills_shared_points INT DEFAULT 0,
                                           community_participation_points INT DEFAULT 0,
                                           lending_activity_points INT DEFAULT 0,
                                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_points (user_id)
    ) ENGINE=InnoDB;

-- Points history table
CREATE TABLE IF NOT EXISTS points_history (
                                              id INT AUTO_INCREMENT PRIMARY KEY,
                                              user_id INT NOT NULL,
                                              points_earned INT NOT NULL,
                                              activity_type ENUM('task_completed', 'skill_shared', 'community_participation', 'lending_activity') NOT NULL,
    description TEXT,
    reference_id INT,
    reference_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_activity_type (activity_type)
    ) ENGINE=InnoDB;

-- User achievements/badges table
CREATE TABLE IF NOT EXISTS user_achievements (
                                                 id INT AUTO_INCREMENT PRIMARY KEY,
                                                 user_id INT NOT NULL,
                                                 achievement_type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_achievement (user_id, achievement_type)
    ) ENGINE=InnoDB;

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
                                             id INT AUTO_INCREMENT PRIMARY KEY,
                                             user_id INT NOT NULL,
                                             email_notifications BOOLEAN DEFAULT TRUE,
                                             task_reminders BOOLEAN DEFAULT TRUE,
                                             skill_match_alerts BOOLEAN DEFAULT TRUE,
                                             dark_mode BOOLEAN DEFAULT FALSE,
                                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_settings (user_id)
    ) ENGINE=InnoDB;

-- Insert default points record for existing users
INSERT IGNORE INTO user_points (user_id, points)
SELECT id, 0 FROM users;

-- Insert default settings for existing users
INSERT IGNORE INTO user_settings (user_id)
SELECT id FROM users;