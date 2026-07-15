# Meta CRM System - Complete Business Ecosystem

A modern, production-ready CRM system that integrates with Meta's complete business ecosystem (Facebook, Instagram, WhatsApp, Messenger) with AI-powered communication center and sales assistant.

## 🌟 Features

### Meta Business Ecosystem Integration
- ✅ Meta Business Account connection (Username/Password login)
- ✅ Automatic asset detection (Facebook Pages, Instagram, WhatsApp, Messenger, Ads)
- ✅ No manual API key configuration required

### AI Communication Center
- ✅ Unified inbox for all platforms (WhatsApp, Instagram DM, Facebook Messenger, Page Messages)
- ✅ Multi-language support (Azerbaijani, Turkish, Russian, English)
- ✅ AI-powered message analysis and responses

### AI Sales Assistant
- ✅ Customer intent detection
- ✅ Price calculation
- ✅ Quotation generation
- ✅ Order management
- ✅ Appointment scheduling
- ✅ Human operator handoff

### Unified Customer Profile
- ✅ Automatic customer profile merging across platforms
- ✅ Complete conversation timeline
- ✅ Purchase history and reviews

### Meta Ads Intelligence
- ✅ Campaign performance monitoring
- ✅ Automated optimization recommendations
- ✅ Analytics dashboard (CTR, CPC, CPM, ROAS, etc.)
- ✅ No budget changes without approval

## 🏗️ Tech Stack

- **Backend**: Node.js + Express + PostgreSQL + Redis
- **Frontend**: React + Tailwind CSS + React Query
- **AI**: OpenAI + Anthropic + Google Gemini + Azure OpenAI
- **Real-time**: WebSocket (Socket.io)
- **Task Queue**: Bull
- **Containerization**: Docker + Docker Compose

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/Azveb/meta-crm-system.git
cd meta-crm-system

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Initialize database
npm run db:init

# Start development
npm run dev
```

## 🐳 Docker Setup

```bash
docker-compose up -d
```

## 📁 Project Structure

```
meta-crm-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.jsx
├── database/
│   └── schema.sql
├── docker-compose.yml
└── package.json
```

## 📄 License

MIT