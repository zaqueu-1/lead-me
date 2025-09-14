# Mini Seller Console (React + Tailwind)
A lightweight console application for lead triage and conversion to opportunities, built with React + Tailwind as part of a HW assignment for CoverPin.

## 🚀 Features

### ✅ MVP Implementation
- **Leads List**: Local JSON loading with search (name/company), filters (status/source) and sorting
- **Detail Panel**: Inline editing of status and email with validation
- **Opportunity Conversion**: Transform leads into opportunities with sales pipeline
- **UX States**: Loading, empty and error handling
- **LocalStorage Persistence**: Filters, sorting and view preferences

### 🎨 Extra Features
- **View Mode**: Toggle between cards and table
- **Dark Mode**: Complete dark theme
- **Responsive Layout**: Optimized design for desktop and mobile
- **CSV Import/Export**: Backup and import with duplicate detection
- **Search Debounce**: Optimized search with 200ms delay
- **Virtual Scrolling**: Performance optimization for large datasets

## 🛠️ Tech Stack
- **React 19.1.1** + **TypeScript 5.8.3**
- **Tailwind CSS 3.4.17** (styling)
- **Vite 7.1.2** (build tool)
- **Playwright** (E2E testing)
- **LocalStorage** (persistence)

## 📦 Installation & Setup

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run E2E tests
npx playwright test

# Test UI interface
npx playwright test --ui
```

### 🐳 Docker Setup

The project includes two Docker environments with different optimization levels:

#### Development Environment
- **Purpose**: Hot reload, debugging, development tools
- **Server**: Vite dev server with HMR
- **Port**: `5173`
- **Features**: Volume mounting, live code changes, development dependencies

```bash
# Run development environment
docker-compose up -d

# View logs
docker-compose logs -f leads-console-dev

# Stop environment
docker-compose down
```

#### Production Environment
- **Purpose**: Optimized build, production-ready deployment
- **Server**: Nginx with static files
- **Port**: `8080`
- **Features**: Multi-stage build, security headers, gzip compression, resource limits

```bash
# Run production environment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f leads-console-prod

# Stop environment
docker-compose -f docker-compose.prod.yml down
```

#### Environment Comparison
| Feature | Development | Production |
|---------|-------------|------------|
| **Build Time** | Fast (no build) | Slower (optimized build) |
| **Hot Reload** | ✅ Yes | ❌ No |
| **File Size** | Larger | Optimized |
| **Security** | Basic | Enhanced headers |
| **Performance** | Development tools | Production optimized |
| **Resource Usage** | Higher | Resource limited |

## 🧪 Testing

Complete E2E test suite with Playwright:
- ✅ 11 tests passing
- 🌐 Multi-browser (Chromium, Firefox, WebKit)
- 📱 Responsive validation
- 🔄 Complete interaction flows

```bash
# Run all tests
npx playwright test

# Chromium only
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug
```

## 📊 Data Structure

### Lead
```typescript
{
  id: string,
  name: string,
  company: string,
  email: string,
  source: 'website' | 'referral' | 'cold-call' | 'social-media',
  score: number (0-100),
  status: 'new' | 'contacted' | 'qualified' | 'lost'
}
```

### Opportunity
```typescript
{
  id: string,
  name: string,
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost',
  amount: number,
  accountName: string
}
```

## 🎯 Performance

- **< 200ms** filter response (with debounce)
- **< 100ms** view navigation
- **~100 leads** supported smoothly
- **Virtual scrolling** for larger datasets
- **Optimized loading** with skeletons

## 🏗️ Architecture

```
src/
├── components/     # React components
├── hooks/         # Custom hooks
├── types/         # TypeScript definitions
├── utils/         # Utilities (CSV, validation)
├── data/          # Mock data
└── styles/        # Global styles
```

---

**Developed as technical challenge - Mini Seller Console**  
*React + Tailwind + TypeScript + Playwright*
