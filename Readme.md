# 🖊️ JournAI - Writing Journal Page

A rich text journal writing interface with AI-powered mood analysis.

## ✨ Features

### 🧱 UI Components

1. **Top Navigation Bar**

   - App logo and name
   - Navigation links (Write, Calendar, Insights)
   - Auth-aware buttons (Login/Signup or Profile dropdown)

2. **Rich Text Editor (TipTap)**

   - Rich text formatting (Bold, Italic, Headers, Lists)
   - Placeholder text guidance
   - Character count (10,000 limit)
   - Clean, modern interface

3. **PDF Upload**

   - Upload PDF files to extract text
   - Automatic text extraction and editor population
   - Loading states and error handling

4. **AI Analysis (Gemini)**

   - Mood detection with emoji representation
   - Content summary generation
   - Detailed reasoning for mood analysis
   - Fallback responses for reliability

5. **Save Functionality**
   - Auth-gated saving
   - Login prompts for unauthenticated users
   - Success feedback and status indicators

## 🔌 API Endpoints

### Client-Side (Next.js API Routes)

- `POST /api/analyze-journal` - Gemini AI mood analysis
- `POST /api/pdf-extract` - PDF text extraction
- `POST /api/save-journal` - Save journal entry (auth required)
- `GET /api/get-user-session` - Get current user info

## 🛠️ Setup Instructions

### 1. Environment Variables

Create `.env.local` in the client directory:

```bash
# Required: Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Required: Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Optional: Clerk URLs (defaults work for most cases)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/write
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/write
```

### 2. Install Dependencies

```bash
cd client
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Access the Journal

Navigate to `http://localhost:3000/write`

## 🎯 Usage Flow

1. **Write/Upload**: Enter text manually or upload a PDF
2. **Analyze**: Click "Analyze with AI" to get mood insights
3. **Review**: View detected mood, summary, and reasoning
4. **Save**: Login and save the journal entry (if authenticated)

## 🔑 Key Features

- **Real-time Rich Text Editing**: TipTap editor with formatting toolbar
- **AI-Powered Analysis**: Gemini AI provides mood detection and insights
- **PDF Support**: Extract text from uploaded PDF files
- **Authentication Integration**: Clerk-based auth with protected save functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful fallbacks for API failures

## 📱 Navigation

- **Write** (`/write`) - Main journal writing interface
- **Calendar** (`/calendar`) - _Coming soon_
- **Insights** (`/insights`) - _Coming soon_

## 🎨 UI/UX Highlights

- Clean, modern interface with Tailwind CSS
- Dark/light theme support
- Loading states and feedback
- Emoji-enhanced mood display
- Gradient-styled AI analysis cards
- Mobile-responsive design

## 🚀 Next Steps

1. Connect to actual database (PostgreSQL via Prisma)
2. Implement Calendar view for journal history
3. Create Insights dashboard with mood analytics
4. Add more advanced PDF text extraction
5. Implement journal search and filtering
