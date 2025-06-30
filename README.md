# Smart IT Support Dashboard

An AI-powered IT helpdesk platform built with Next.js, Supabase, and Google Gemini AI.

## Features

- 🎫 **Smart Ticketing System** - Create, track, and manage support tickets
- 🤖 **AI Assistant** - Powered by Google Gemini for intelligent support
- 👥 **Role-Based Access** - Separate interfaces for users and administrators
- 📊 **Analytics Dashboard** - Performance metrics and insights
- 📁 **File Attachments** - Upload and manage ticket attachments
- 🔔 **Real-time Notifications** - Stay updated on ticket status changes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark/Light Mode** - Customizable theme preferences

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL), Server Actions
- **AI**: Google Gemini 2.0 Flash
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React

## Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd smart-it-support-dashboard
npm install
\`\`\`

### 2. Environment Setup

Create `.env.local` with your credentials:

\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

### 3. Database Setup

Run these SQL scripts in your Supabase dashboard:

1. `scripts/01-create-tables.sql` - Creates all required tables
2. `scripts/02-seed-data.sql` - Adds demo data
3. `scripts/03-helper-functions.sql` - Helper functions

### 4. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For End Users
- Submit support tickets with detailed descriptions
- Track ticket status and receive updates
- Chat with AI assistant for immediate help
- Upload files and screenshots

### For IT Administrators
- Manage all support tickets from central dashboard
- Assign tickets to team members
- View analytics and performance metrics
- Respond to tickets with internal notes

## API Keys Setup

### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and API keys from Settings → API

### Google Gemini AI
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Add it to your environment variables

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── actions/           # Server actions
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── admin/            # Admin dashboard components
│   ├── user/             # User dashboard components
│   ├── ai/               # AI chatbot components
│   └── setup/            # Setup and configuration
├── lib/                   # Utilities and configurations
│   ├── ai/               # AI service integration
│   ├── setup/            # Database setup utilities
│   └── types/            # TypeScript type definitions
└── scripts/              # Database scripts
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the setup guide in the application
- Review the system status dashboard
\`\`\`

Now let me create the complete next.config.mjs:
