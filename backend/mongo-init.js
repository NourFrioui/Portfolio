// MongoDB initialization script for Docker
db = db.getSiblingDB('portfolio');

// Create collections
db.createCollection('users');
db.createCollection('projects');
db.createCollection('experiences');
db.createCollection('technologies');
db.createCollection('contacts');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.projects.createIndex({ title: 1 });
db.projects.createIndex({ createdAt: -1 });
db.experiences.createIndex({ startDate: -1 });
db.technologies.createIndex({ name: 1 }, { unique: true });
db.contacts.createIndex({ createdAt: -1 });
db.contacts.createIndex({ isRead: 1 });

// Insert default admin user (password: admin123)
db.users.insertOne({
  username: 'admin',
  email: 'admin@portfolio.com',
  password: '$2b$10$8K1p/a0dUrziIFOd2os7UOJ8owEWKdOaM7lR6Pk6Q5E2ZqZzZqZzq', // admin123
  role: 'ADMIN',
  fullName: 'Portfolio Admin',
  title: 'Full Stack Developer',
  bio: 'Passionate developer with expertise in modern web technologies',
  location: 'Remote',
  availableForWork: true,
  yearsOfExperience: 5,
  hourlyRate: 50,
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB'],
  languages: ['English', 'French'],
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Database initialized successfully!');
