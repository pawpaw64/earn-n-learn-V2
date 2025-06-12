
-- Projects table (enhanced work assignments)
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  provider_id INT NOT NULL,
  client_id INT NOT NULL,
  source_type ENUM('job', 'skill', 'material') NOT NULL,
  source_id INT NOT NULL,
  project_type ENUM('fixed', 'hourly') DEFAULT 'fixed',
  total_amount DECIMAL(10,2),
  hourly_rate DECIMAL(10,2),
  current_phase INT DEFAULT 1,
  status ENUM('active', 'paused', 'completed', 'cancelled') DEFAULT 'active',
  start_date DATE DEFAULT (CURDATE()),
  expected_end_date DATE,
  actual_end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_provider_id (provider_id),
  INDEX idx_client_id (client_id),
  INDEX idx_status (status),
  INDEX idx_source (source_type, source_id)
) ENGINE=InnoDB;

-- Project milestones
CREATE TABLE IF NOT EXISTS project_milestones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  phase_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed', 'approved') DEFAULT 'pending',
  due_date DATE,
  completion_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- Project progress updates
CREATE TABLE IF NOT EXISTS project_updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  milestone_id INT,
  user_id INT NOT NULL,
  update_type ENUM('status_change', 'progress_update', 'milestone_complete', 'note') NOT NULL,
  message TEXT,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB;
