
-- Enhanced project management tables

-- Project tasks table
CREATE TABLE IF NOT EXISTS project_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  status ENUM('pending', 'in_progress', 'completed', 'verified', 'rejected') DEFAULT 'pending',
  assigned_to INT,
  created_by INT NOT NULL,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project_tasks_project (project_id),
  INDEX idx_project_tasks_assigned (assigned_to),
  INDEX idx_project_tasks_status (status)
);

-- Project resources table
CREATE TABLE IF NOT EXISTS project_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('file', 'link', 'document', 'image', 'video') NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  size VARCHAR(20),
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project_resources_project (project_id),
  INDEX idx_project_resources_category (category)
);

-- Project time entries table
CREATE TABLE IF NOT EXISTS project_time_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  task_id INT,
  user_id INT NOT NULL,
  description TEXT NOT NULL,
  hours DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES project_tasks(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project_time_project (project_id),
  INDEX idx_project_time_user (user_id),
  INDEX idx_project_time_date (date)
);

-- Project comments table
CREATE TABLE IF NOT EXISTS project_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  type ENUM('general', 'update', 'question', 'issue') DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project_comments_project (project_id),
  INDEX idx_project_comments_user (user_id)
);

-- Project activity log table
CREATE TABLE IF NOT EXISTS project_activity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  activity_type ENUM('task_update', 'resource_shared', 'time_logged', 'comment_added', 'milestone_update', 'status_change') NOT NULL,
  description TEXT NOT NULL,
  task_id INT NULL,
  resource_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES project_tasks(id) ON DELETE SET NULL,
  FOREIGN KEY (resource_id) REFERENCES project_resources(id) ON DELETE SET NULL,
  INDEX idx_project_activity_project (project_id),
  INDEX idx_project_activity_type (activity_type)
);
