# Professional Portfolio - Fullstack Application

A modern, responsive portfolio application built with Next.js 15, NestJS, and MongoDB. Features a dynamic content management system, JWT authentication, and comprehensive admin dashboard.

## 🚀 Features

### Frontend (Next.js 15 + React 19)
- **Modern UI/UX**: Clean, responsive design with TailwindCSS
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Dynamic Content**: Real-time data fetching from backend APIs
- **Reusable Components**: Modular UI component library
- **SEO Optimized**: Meta tags, OpenGraph, and Twitter cards
- **Performance**: Optimized images, lazy loading, and caching
- **Animations**: Smooth transitions with Framer Motion

### Backend (NestJS + MongoDB)
- **RESTful APIs**: Complete CRUD operations for all entities
- **JWT Authentication**: Secure token-based authentication
- **File Upload**: Image upload system with validation
- **API Documentation**: Comprehensive Swagger documentation
- **Validation**: Global validation pipes with class-validator
- **Error Handling**: Structured error responses and logging
- **Database**: MongoDB with Mongoose ODM

### Admin Dashboard
- **Content Management**: Full CRUD for projects, experience, technologies
- **Contact Management**: View and manage contact form submissions
- **Profile Management**: Update portfolio information and settings
- **Statistics**: Dashboard with analytics and metrics
- **File Management**: Upload and manage portfolio images

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: TailwindCSS 4
- **Language**: TypeScript
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Theme**: next-themes

### Backend
- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer
- **Language**: TypeScript

### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Database**: MongoDB 7.0
- **Environment**: Node.js 18

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or cloud)
- Docker & Docker Compose (for containerized deployment)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd potfolio
```

### 2. Environment Setup

#### Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
PORT=3000
FRONTEND_URL=http://localhost:4000
```

#### Frontend Environment
```bash
cd frontend
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 4. Database Setup

Start MongoDB locally or use a cloud service like MongoDB Atlas.

### 5. Run the Application

#### Development Mode

**Backend** (Terminal 1):
```bash
cd backend
npm run start:dev
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

#### Production Mode with Docker
```bash
docker-compose up -d
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3000/api
- **API Base URL**: http://localhost:3000

### Main Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token

#### Projects
- `GET /projects` - Get all projects
- `GET /projects/paginated` - Get paginated projects
- `POST /projects` - Create project
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

#### Experience
- `GET /experience` - Get all experience
- `POST /experience` - Create experience
- `PATCH /experience/:id` - Update experience
- `DELETE /experience/:id` - Delete experience

#### Technologies
- `GET /technologies` - Get all technologies
- `POST /technologies` - Create technology
- `PATCH /technologies/:id` - Update technology
- `DELETE /technologies/:id` - Delete technology

#### Contact
- `GET /contact` - Get all contacts
- `POST /contact` - Create contact message
- `PATCH /contact/:id/read` - Mark as read
- `DELETE /contact/:id` - Delete contact

#### Users & Profile
- `GET /users/:id/profile` - Get user profile
- `PUT /users/:id/profile` - Update profile
- `GET /users/portfolio/public` - Get public portfolio

#### File Upload
- `POST /upload/image` - Upload image
- `GET /upload/:filename` - Get uploaded file

## 🏗 Project Structure

```
potfolio/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── projects/       # Projects CRUD
│   │   ├── experience/     # Experience CRUD
│   │   ├── technologies/   # Technologies CRUD
│   │   ├── contact/        # Contact form
│   │   ├── upload/         # File upload
│   │   ├── dashboard/      # Admin dashboard
│   │   └── common/         # Shared utilities
│   ├── uploads/            # Uploaded files
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   └── components/    # React components
│   ├── components/        # UI components
│   ├── contexts/          # React contexts
│   ├── utils/             # Utility functions
│   ├── Dockerfile
│   └── package.json
├── nginx/                 # Nginx configuration
├── docker-compose.yml     # Docker orchestration
└── README.md
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm run start:dev          # Development with hot reload
npm run build             # Build for production
npm run start:prod        # Run production build
npm run test              # Run tests
npm run test:e2e          # Run e2e tests
```

### Frontend Development
```bash
cd frontend
npm run dev               # Development server
npm run build             # Build for production
npm run start             # Run production build
npm run lint              # Run ESLint
npm run type-check        # TypeScript type checking
```

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

Services:
- **Frontend**: http://localhost:4000
- **Backend**: http://localhost:3000
- **MongoDB**: localhost:27017
- **Nginx**: http://localhost (if enabled)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting (via Nginx)
- Security headers
- File upload validation
- Environment variable protection

## 🎨 UI Components

### Available Components
- **Button**: Multiple variants and sizes
- **Card**: Flexible card layouts
- **Badge**: Status and category badges
- **Input/Textarea**: Form inputs with validation
- **Modal**: Overlay dialogs
- **LoadingSpinner**: Loading states
- **ErrorBoundary**: Error handling
- **ThemeToggle**: Dark/light mode switch

### Usage Example
```tsx
import { Button, Card, Badge } from '@/components/ui';

<Card>
  <Card.Header>
    <Card.Title>Project Title</Card.Title>
  </Card.Header>
  <Card.Content>
    <Badge variant="primary">React</Badge>
    <Button onClick={handleClick}>View Project</Button>
  </Card.Content>
</Card>
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔍 SEO Optimization

- Dynamic meta tags
- OpenGraph support
- Twitter Cards
- Structured data
- Sitemap generation
- Optimized images

## 🚀 Performance

- Image optimization with Next.js
- Lazy loading components
- API response caching
- Gzip compression
- CDN-ready static assets
- Database indexing

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm run test              # Jest tests
npm run test:watch       # Watch mode
```

## 📊 Monitoring

- Application health checks
- Error logging
- Performance metrics
- API response times
- Database query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the code examples

## 🔄 Updates

### Version 1.0.0
- Initial release with full portfolio functionality
- Admin dashboard implementation
- Docker containerization
- Comprehensive API documentation

---

**Built with ❤️ using modern web technologies**
