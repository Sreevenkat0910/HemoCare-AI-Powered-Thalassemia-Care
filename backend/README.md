# Hemocare Backend API

A robust Node.js + Express + TypeScript backend for the Hemocare Healthcare Platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Patient, doctor, and admin user types
- **Database Integration**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, input validation
- **Error Handling**: Comprehensive error handling and logging
- **TypeScript**: Full TypeScript support with strict type checking

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ODM**: Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS, rate limiting

## 📋 Prerequisites

- Node.js 16+
- MongoDB 5.0+
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the environment template and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/hemocare_db
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/hemocare_db

# JWT
JWT_SECRET=your_super_secret_key_here
```

### 3. Database Setup

Install and start MongoDB:

**Option 1: Local MongoDB**
```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Or download from https://www.mongodb.com/try/download/community
```

**Option 2: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/atlas
- Create a free cluster
- Get your connection string

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Patients
- `GET /api/patients/dashboard` - Patient dashboard data

### Health
- `GET /api/health/metrics` - Health metrics

### Doctors
- `GET /api/doctors/dashboard` - Doctor dashboard data

## 🗄️ Database Models

### User Model
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String (Hashed)
- `firstName`: String
- `lastName`: String
- `role`: Enum ('patient', 'doctor', 'admin')
- `phoneNumber`: String (Optional)
- `dateOfBirth`: Date (Optional)
- `gender`: Enum ('male', 'female', 'other')
- `isActive`: Boolean
- `emailVerified`: Boolean
- `lastLoginAt`: Date (Optional)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express

## 🧪 Testing

```bash
npm test
```

## 📦 Build

```bash
npm run build
```

## 🚀 Production

```bash
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── index.ts         # Main server file
├── dist/                # Compiled JavaScript
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm run watch` - Watch mode for TypeScript compilation
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | Local MongoDB connection string | `mongodb://localhost:27017/hemocare_db` |
| `MONGODB_URI_PROD` | Production MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/hemocare_db` |
| `JWT_SECRET` | JWT signing secret | `fallback_secret` |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
