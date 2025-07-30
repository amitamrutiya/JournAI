# 📝 JournAI

**JournAI** is an AI-powered journaling and mood tracking application that helps you reflect on your thoughts, track your emotions, and gain insights into your mental wellness journey.

## ✨ What is JournAI?

JournAI combines the traditional practice of journaling with modern AI technology to provide:
- **Smart Writing Assistant**: AI-powered suggestions and prompts to help you express your thoughts
- **Mood Tracking**: Track your emotions and see patterns over time
- **Personalized Insights**: Get AI-generated summaries and reflections on your journal entries
- **Secure & Private**: Your thoughts are safely stored and protected

## 🏗️ Project Structure

This project consists of two main parts:

```
JournAI/
├── client/          # Frontend (what users see and interact with)
├── server/          # Backend (handles data and AI processing)
├── k8s-manifests/   # Deployment configurations
└── docs/            # Documentation
```

### Frontend (Client)
- **Technology**: Next.js with React and TypeScript
- **Purpose**: The user interface where people write journals and view insights
- **Features**: Modern web app with authentication, text editor, and dashboard

### Backend (Server)
- **Technology**: Node.js with Express and TypeScript
- **Purpose**: Handles data storage, user authentication, and AI processing
- **Database**: PostgreSQL with Prisma ORM

## 🚀 Quick Start

### Prerequisites

Before you begin, make sure you have installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Docker](https://www.docker.com/) (for easy setup)
- [Git](https://git-scm.com/)

### Option 1: Using Docker (Recommended for Beginners)

1. **Clone the repository**
   ```bash
   git clone https://github.com/amitamrutiya/JournAI.git
   cd JournAI
   ```

2. **Start the application**
   ```bash
   ./start-dev.sh
   ```

   This will:
   - Build both frontend and backend
   - Start the database
   - Launch the application

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Option 2: Manual Setup

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/amitamrutiya/JournAI.git
   cd JournAI
   make install
   ```

2. **Set up environment variables**
   - Copy `.env.example` files in both `client/` and `server/` directories
   - Rename them to `.env.local` and `.env` respectively
   - Fill in the required values (database URL, API keys, etc.)

3. **Start development servers**
   ```bash
   make dev
   ```

## 🛠️ Available Commands

We use a Makefile to simplify common tasks:

| Command | What it does |
|---------|-------------|
| `make help` | Show all available commands |
| `make install` | Install all dependencies |
| `make dev` | Start both frontend and backend in development mode |
| `make build` | Build both applications for production |
| `make test` | Run tests |
| `make clean` | Remove all build files and dependencies |
| `make docker-up` | Start application using Docker |
| `make prisma-studio` | Open database viewer |

## 🔧 Development

### Frontend Development
```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Check code quality
```

### Backend Development
```bash
cd server
npm run dev          # Start development server
npm run build        # Build for production
npm run prisma:studio # View database
npm run seed         # Add sample data
```

## 📱 Features

- **✍️ Rich Text Editor**: Write your thoughts with a beautiful, distraction-free editor
- **🎭 Mood Tracking**: Select and track your emotions with each entry
- **🤖 AI Insights**: Get AI-generated summaries and insights from your journal entries
- **📊 Analytics**: View patterns in your mood and writing habits
- **🔐 Secure Authentication**: Safe login with Clerk authentication
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🌙 Dark/Light Mode**: Choose your preferred theme

## 🔒 Privacy & Security

- All journal entries are encrypted and securely stored
- User authentication is handled by Clerk (industry-standard security)
- AI processing is done securely without storing personal data permanently
- You own your data and can export it anytime

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test them
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

## 📚 Technology Stack

### Frontend
- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **Clerk**: Authentication and user management

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **TypeScript**: Type-safe JavaScript
- **Prisma**: Database toolkit and ORM
- **PostgreSQL**: Relational database

### DevOps & Tools
- **Docker**: Containerization
- **Kubernetes**: Container orchestration
- **Vitest**: Testing framework
- **Playwright**: End-to-end testing
- **ESLint & Prettier**: Code formatting and linting

## 🚀 Deployment

The application can be deployed using:
- **Docker Compose**: For simple deployments
- **Kubernetes**: For production-scale deployments (configurations in `k8s-manifests/`)
- **Vercel**: For frontend hosting
- **Railway**: For backend hosting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Voice journaling
- [ ] Advanced AI insights and recommendations
- [ ] Collaborative journaling features
- [ ] Multi-language support

## 👥 Authors

- **Amit Amrutiya** - [GitHub](https://github.com/amitamrutiya)

## 🙏 Acknowledgments

- Thanks to all contributors who help improve JournAI
- Inspired by the mental health and wellness community
- Built with amazing open-source technologies

---

**Happy Journaling! 📖✨**

Made with ❤️ for better mental wellness and self-reflection.
