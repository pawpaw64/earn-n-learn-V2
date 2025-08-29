-- Insert predefined skills data
INSERT IGNORE INTO predefined_skills (name, category, description) VALUES
-- Programming Languages
('JavaScript', 'Programming', 'Dynamic programming language for web development'),
('Python', 'Programming', 'Versatile programming language for various applications'),
('Java', 'Programming', 'Object-oriented programming language'),
('C++', 'Programming', 'System programming language'),
('C#', 'Programming', 'Microsoft .NET programming language'),
('TypeScript', 'Programming', 'Typed superset of JavaScript'),
('Go', 'Programming', 'Google developed systems language'),
('Rust', 'Programming', 'Systems programming language focused on safety'),
('PHP', 'Programming', 'Server-side scripting language'),
('Ruby', 'Programming', 'Dynamic programming language'),

-- Web Development
('React', 'Web Development', 'JavaScript library for building user interfaces'),
('Angular', 'Web Development', 'TypeScript-based web application framework'),
('Vue.js', 'Web Development', 'Progressive JavaScript framework'),
('Node.js', 'Web Development', 'JavaScript runtime for server-side development'),
('Express.js', 'Web Development', 'Web framework for Node.js'),
('HTML5', 'Web Development', 'Markup language for web pages'),
('CSS3', 'Web Development', 'Style sheet language for web design'),
('Sass/SCSS', 'Web Development', 'CSS preprocessor'),
('Tailwind CSS', 'Web Development', 'Utility-first CSS framework'),
('Bootstrap', 'Web Development', 'CSS framework for responsive design'),

-- Database
('MySQL', 'Database', 'Relational database management system'),
('PostgreSQL', 'Database', 'Advanced relational database'),
('MongoDB', 'Database', 'NoSQL document database'),
('Redis', 'Database', 'In-memory data structure store'),
('SQLite', 'Database', 'Lightweight relational database'),
('Oracle Database', 'Database', 'Enterprise relational database'),

-- Cloud & DevOps
('AWS', 'Cloud & DevOps', 'Amazon Web Services cloud platform'),
('Google Cloud', 'Cloud & DevOps', 'Google Cloud Platform'),
('Microsoft Azure', 'Cloud & DevOps', 'Microsoft cloud computing platform'),
('Docker', 'Cloud & DevOps', 'Containerization platform'),
('Kubernetes', 'Cloud & DevOps', 'Container orchestration platform'),
('Jenkins', 'Cloud & DevOps', 'Continuous integration tool'),
('Git', 'Version Control', 'Distributed version control system'),
('GitHub', 'Version Control', 'Git repository hosting service'),

-- Data Science & AI
('Machine Learning', 'Data Science & AI', 'AI algorithms and model development'),
('Deep Learning', 'Data Science & AI', 'Neural network based learning'),
('TensorFlow', 'Data Science & AI', 'Machine learning framework'),
('PyTorch', 'Data Science & AI', 'Deep learning framework'),
('Pandas', 'Data Science & AI', 'Python data manipulation library'),
('NumPy', 'Data Science & AI', 'Numerical computing library'),
('Data Analysis', 'Data Science & AI', 'Extracting insights from data'),
('Statistical Analysis', 'Data Science & AI', 'Statistical methods and techniques'),

-- Design
('UI/UX Design', 'Design', 'User interface and experience design'),
('Figma', 'Design', 'Collaborative design tool'),
('Adobe Photoshop', 'Design', 'Image editing software'),
('Adobe Illustrator', 'Design', 'Vector graphics editor'),
('Sketch', 'Design', 'Digital design toolkit'),
('Wireframing', 'Design', 'Creating website/app blueprints'),
('Prototyping', 'Design', 'Creating interactive mockups'),

-- Mobile Development
('React Native', 'Mobile Development', 'Cross-platform mobile framework'),
('Flutter', 'Mobile Development', 'Google mobile UI framework'),
('iOS Development', 'Mobile Development', 'Native iOS app development'),
('Android Development', 'Mobile Development', 'Native Android app development'),
('Swift', 'Mobile Development', 'Programming language for iOS'),
('Kotlin', 'Mobile Development', 'Programming language for Android'),

-- Soft Skills
('Communication', 'Soft Skills', 'Effective verbal and written communication'),
('Leadership', 'Soft Skills', 'Guiding and motivating teams'),
('Problem Solving', 'Soft Skills', 'Analytical thinking and solution finding'),
('Project Management', 'Soft Skills', 'Planning and executing projects'),
('Time Management', 'Soft Skills', 'Efficiently managing time and tasks'),
('Teamwork', 'Soft Skills', 'Collaborating effectively with others'),
('Critical Thinking', 'Soft Skills', 'Analyzing and evaluating information'),
('Creativity', 'Soft Skills', 'Innovative thinking and idea generation'),

-- Languages
('English', 'Languages', 'English language proficiency'),
('Spanish', 'Languages', 'Spanish language proficiency'),
('French', 'Languages', 'French language proficiency'),
('German', 'Languages', 'German language proficiency'),
('Chinese', 'Languages', 'Chinese language proficiency'),
('Arabic', 'Languages', 'Arabic language proficiency'),

-- Business & Marketing
('Digital Marketing', 'Business & Marketing', 'Online marketing strategies'),
('SEO', 'Business & Marketing', 'Search engine optimization'),
('Social Media Marketing', 'Business & Marketing', 'Marketing through social platforms'),
('Content Marketing', 'Business & Marketing', 'Creating valuable content for audiences'),
('Business Analysis', 'Business & Marketing', 'Analyzing business processes'),
('Sales', 'Business & Marketing', 'Selling products and services'),
('Customer Service', 'Business & Marketing', 'Supporting and helping customers'),

-- Security
('Cybersecurity', 'Security', 'Protecting digital systems and data'),
('Ethical Hacking', 'Security', 'Authorized system penetration testing'),
('Network Security', 'Security', 'Securing network infrastructure'),
('Information Security', 'Security', 'Protecting information assets'),

-- Operating Systems
('Linux', 'Operating Systems', 'Unix-like operating system'),
('Windows', 'Operating Systems', 'Microsoft Windows operating system'),
('macOS', 'Operating Systems', 'Apple operating system'),

-- Backend
('API Development', 'Backend', 'Creating application programming interfaces'),
('Microservices', 'Backend', 'Distributed system architecture'),
('GraphQL', 'Backend', 'Query language for APIs'),
('REST APIs', 'Backend', 'Representational State Transfer APIs'),

-- Architecture
('System Design', 'Architecture', 'Designing scalable systems'),
('Software Architecture', 'Architecture', 'High-level software structure'),
('Clean Architecture', 'Architecture', 'Software design principles'),
('Design Patterns', 'Architecture', 'Reusable software design solutions');