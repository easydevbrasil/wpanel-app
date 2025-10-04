# wPanel - Admin Dashboard

## Overview

wPanel is a modern administrative dashboard application built with React and Express, featuring real-time system metrics monitoring via WebSocket connections. The application provides a professional admin interface with gradient-enhanced visual design, supporting both light and dark themes. It includes authentication, dashboard visualization with animated gauge cards, and CRUD pages for managing clients (Clientes) and suppliers (Fornecedores).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, configured with HMR (Hot Module Replacement)
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query (React Query)** for server state management and data fetching

**UI Component System**
- **shadcn/ui** component library (New York style variant) built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- Component aliases configured via TypeScript path mapping (`@/components`, `@/lib`, `@/hooks`)

**Design System**
- Hybrid approach combining data clarity with distinctive brand identity
- Signature gradient system (purple-to-blue) for headers, sidebars, and CTAs
- Custom color palette supporting both light and dark modes via CSS custom properties
- Typography: Inter for UI elements, JetBrains Mono for data/metrics
- Responsive design with mobile-first breakpoints

**State Management**
- React Context API for theme management (ThemeProvider)
- React Context for authentication state (AuthProvider)
- Local component state with React hooks
- WebSocket connection for real-time metrics updates

**Key UI Patterns**
- Collapsible sidebar navigation with desktop/mobile responsive behavior
- Real-time gauge visualizations using SVG for system metrics (CPU, RAM, Storage)
- Modal dialogs for CRUD operations
- Toast notifications for user feedback
- Table and grid view toggles for data presentation

### Backend Architecture

**Server Framework**
- **Express.js** as the HTTP server framework
- **Node.js** runtime with ES modules (`"type": "module"`)
- Development uses `tsx` for TypeScript execution; production uses compiled JavaScript

**Session Management**
- **express-session** with MemoryStore for session persistence
- Session-based authentication (no JWT tokens)
- Cookie configuration with httpOnly flag and environment-based secure flag
- 24-hour session expiration

**Real-Time Communication**
- **Socket.IO** server for WebSocket connections
- Broadcasts system metrics (CPU, RAM, storage, cloud storage) to connected clients
- Uses `systeminformation` library to gather server metrics
- Metrics broadcast on interval to all connected clients

**API Structure**
- RESTful endpoints under `/api` prefix
- Authentication endpoints: `/api/login`, `/api/logout`, `/api/user`
- Simple hardcoded authentication (admin/admin123) - suitable for demonstration
- Session validation for protected routes

**Development Features**
- Request/response logging middleware with timing metrics
- Vite integration in development mode for SSR-like setup
- Static file serving in production from `dist/public`

### Data Storage Solutions

**Database Setup**
- **Drizzle ORM** configured for PostgreSQL dialect
- **Neon Database** serverless PostgreSQL via `@neondatabase/serverless`
- WebSocket connection pooling for database queries
- Schema location: `shared/schema.ts`
- Migration output directory: `./migrations`

**Schema Design**
- Users table with UUID primary keys (auto-generated)
- Username/password fields (plaintext in current implementation)
- Zod schemas generated from Drizzle schema for validation

**Storage Abstraction**
- `IStorage` interface defining CRUD operations
- `MemStorage` in-memory implementation for development/testing
- Database connection ready but application currently uses in-memory storage
- Separation of concerns allows easy swap to database persistence

**Data Validation**
- Drizzle-Zod integration for type-safe schema validation
- Form validation using `@hookform/resolvers` with Zod schemas

### Authentication & Authorization

**Authentication Strategy**
- Session-based authentication (no tokens)
- Sessions stored in memory (development) with MemoryStore
- Credentials validated against hardcoded admin user
- Session data includes userId and username

**Authorization Pattern**
- Route protection via session checking
- Frontend: AuthProvider context checks authentication status on mount
- Backend: Session middleware validates requests
- Unauthenticated users redirected to login page
- Protected routes check `req.session.userId` presence

**Security Considerations**
- Current implementation uses hardcoded credentials (demonstration purposes)
- Passwords stored in plaintext (should be hashed in production)
- Session secret should be environment-specific
- HTTPS recommended for production (secure cookies)

### External Dependencies

**UI Component Libraries**
- Radix UI primitives (accordion, dialog, dropdown, select, etc.)
- Embla Carousel for carousel components
- Lucide React for icon system
- class-variance-authority & clsx for conditional styling

**Data Visualization**
- Custom SVG-based gauge components
- Socket.IO client for real-time metric streaming

**Development Tools**
- Replit-specific plugins (vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner)
- PostCSS with Tailwind CSS and Autoprefixer
- TypeScript with strict mode enabled

**System Utilities**
- `systeminformation` for server metrics (CPU, RAM, disk usage)
- `child_process` exec for potential system commands
- `date-fns` for date formatting and manipulation

**Database & ORM**
- Drizzle Kit for schema migrations
- Neon serverless PostgreSQL driver
- ws (WebSocket library) for database connections

**Session & Storage**
- `memorystore` for session persistence in development
- `connect-pg-simple` available for PostgreSQL session store (not currently active)