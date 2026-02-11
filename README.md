# PersonaMirror Agent

**Open-source persona automation framework with LLM-agnostic design.**

Build your AI-powered social media persona that learns your voice, generates content, and maintains consistent engagement across platforms.

## 🚀 Features

- **🔐 Security-First**: Rate limiting, input sanitization, audit logging, encrypted API key storage
- **🤖 LLM Agnostic**: Use OpenAI, Anthropic, or local Ollama models
- **📝 Content Queue**: Human-in-the-loop approval before posting
- **📊 Analytics**: Track engagement, costs, and content performance
- **🔌 Platform Connectors**: LinkedIn, X/Twitter, Instagram support
- **🐳 Production Ready**: Docker, Redis, PostgreSQL, BullMQ job queue

## 📁 Project Structure

```
personamirror/
├── apps/
│   ├── api/              # Express API server
│   ├── agent/            # BullMQ background workers
│   └── web/              # SvelteKit frontend
├── packages/
│   ├── llm-bridge/       # Multi-provider LLM abstraction
│   ├── persona-schema/   # TypeScript types & validation
│   ├── platform-adapters/# Social platform adapters
│   └── shared-utils/     # Logging, validation, security
├── migrations/           # Supabase SQL migrations
└── docker-compose.dev.yml
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/persona-mirror/personamirror.git
cd personamirror
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development services**
```bash
pnpm docker:up
```

5. **Run database migrations**
```bash
pnpm db:migrate
```

6. **Start development server**
```bash
pnpm dev
```

The API will be running at `http://localhost:3001`

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/personamirror

# Redis
REDIS_URL=redis://localhost:6379

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# Platform APIs (optional)
LINKEDIN_CLIENT_ID=your-linkedin-id
LINKEDIN_CLIENT_SECRET=your-linkedin-secret
```

## 📡 API Endpoints

### Health & Monitoring
- `GET /health` - System health check
- `GET /health/detailed` - Detailed diagnostics
- `GET /health/live` - Kubernetes liveness probe
- `GET /health/ready` - Kubernetes readiness probe

### Personas
- `POST /api/personas/extract` - Extract persona from posts
- `GET /api/personas` - List your personas
- `GET /api/personas/:id` - Get specific persona
- `DELETE /api/personas/:id` - Archive persona

### Content
- `POST /api/content/generate` - Generate content
- `POST /api/content/validate` - Validate content for platform

### Queue
- `GET /api/queue` - List content queue
- `GET /api/queue/:id` - Get queue item
- `PUT /api/queue/:id` - Update queue item
- `POST /api/queue/:id/approve` - Approve for posting
- `DELETE /api/queue/:id` - Delete queue item

## 🛡️ Security

- **Rate Limiting**: 100 requests per 15 minutes per user
- **Input Sanitization**: XSS and SQL injection protection
- **API Key Encryption**: Client-side encryption before storage
- **Row Level Security**: Database-level access control
- **Audit Logging**: All actions logged with timestamps
- **CORS**: Configurable origin restrictions
- **Helmet.js**: Security headers (CSP, HSTS, XSS protection)

## 🧪 Development

### Running Tests

```bash
# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# All tests
pnpm test
```

### Code Quality

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build all packages
pnpm build
```

### Database Operations

```bash
# Run migrations
pnpm db:migrate

# Reset database
pnpm db:reset
```

## 🐳 Docker

### Development Stack

```bash
# Start services
pnpm docker:up

# Stop services
pnpm docker:down

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

Services included:
- PostgreSQL 15 (port 5432)
- Redis 7 (port 6379)

## 📖 Architecture

### Security Layers
1. **Helmet.js** - Security headers
2. **Rate Limiting** - Redis-backed rate limiting
3. **Auth Middleware** - JWT validation with Supabase
4. **Input Sanitization** - XSS and SQL injection prevention
5. **RLS Policies** - Database-level access control
6. **Audit Logging** - Comprehensive security logging

### Job Queue (BullMQ)
- **Redis-backed** - Reliable job processing
- **Retry Logic** - Exponential backoff on failures
- **Scheduled Jobs** - Cron-based automation
- **Dead Letter Queue** - Failed job handling

### LLM Bridge
- **Multi-Provider** - OpenAI, Anthropic, Ollama
- **Cost Tracking** - Per-request cost calculation
- **Retry Logic** - Automatic retries with backoff
- **Circuit Breaker** - Failover protection
- **Usage Metrics** - Token and cost tracking

## 📝 Database Schema

### Core Tables
- `users` - User profiles
- `personas` - Extracted personas with tone rules
- `content_queue` - Content approval workflow
- `api_keys` - Encrypted API credentials
- `audit_logs` - Security audit trail
- `llm_usage` - Cost tracking per provider

See `migrations/` for complete schema.

## 🚀 Deployment

### Railway (Backend)

1. Connect GitHub repo to Railway
2. Add environment variables
3. Deploy automatically on push

### Vercel (Frontend)

1. Import GitHub repo
2. Set framework to SvelteKit
3. Configure environment variables
4. Deploy

### Docker Production

```bash
# Build production image
docker build -t personamirror-api -f apps/api/Dockerfile .

# Run with environment
docker run -p 3001:3001 --env-file .env personamirror-api
```

## 📈 Monitoring

### Health Checks
- `/health` - Overall system health
- `/health/detailed` - Service-specific health
- `/health/live` - Kubernetes liveness
- `/health/ready` - Kubernetes readiness

### Logging
- **Structured JSON** logs with Winston
- **Daily rotation** with 14-day retention
- **Error tracking** with separate error logs
- **Request tracing** with unique request IDs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Update documentation
- Follow conventional commits

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🔗 Links

- [Documentation](./docs/)
- [API Reference](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Security Guide](./docs/SECURITY.md)

## 💬 Support

- [GitHub Issues](https://github.com/persona-mirror/personamirror/issues)
- [Discord Community](https://discord.gg/personamirror)

---

**Built with ❤️ by Roshan Ravani**

*Ship it. Stop planning.*
