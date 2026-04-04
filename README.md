# Editor Portfolio

A full-stack portfolio website for a professional video editor, featuring a public-facing showcase and a React-based admin dashboard for complete content management.

---

## Project Overview

**Type:** Portfolio website + headless CMS  
**Target users:** Video editors showcasing their work; clients browsing their portfolio  
**Admin users:** Site owner managing all content through a private dashboard

The portfolio displays projects, videos, services, testimonials, and handles contact inquiries. All content is managed via a separate React admin panel backed by a Node.js/Express REST API and MongoDB.

---

## Features

### Public Portfolio
- **Home** — Hero section with 3D background (Three.js), featured projects, showreel video, stats, and CTA
- **Portfolio** — Filterable, paginated project grid with category filters and search
- **Project Detail** — Full project page with video player, before/after slider, tools used, and metadata
- **Services** — Services showcase with pricing and turnaround info
- **Testimonials** — Client testimonials grid
- **About** — Timeline and biography
- **Contact** — Contact form with email notifications
- **View tracking** — Increments project view count on each visit
- **SEO** — Per-page meta tags via React Helmet Async
- **Site settings** — All hero text, stats, social links, and SEO data managed from the admin

### Admin Dashboard
- **Dashboard** — Stats cards (project count, video count, inquiry count) + recent activity
- **Projects** — Create/edit/delete projects with media upload; drag-and-drop reorder
- **Videos** — Upload and manage standalone videos
- **Categories** — Manage content categories
- **Services** — Manage services, pricing, and turnaround info
- **Testimonials** — Manage client testimonials with video links
- **Inquiries** — View contact submissions, mark as read/replied
- **Media Library** — Browse and delete uploaded Cloudinary assets
- **Homepage Editor** — Edit hero content, CTA buttons, stats, social links
- **Site Settings** — SEO metadata, contact email, social profiles
- **Change Password** — Secure password update with token rotation

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js, Express 4.21 |
| **Database** | MongoDB (Mongoose 8.7) |
| **Auth** | JWT (access 15m + refresh 7d, httpOnly cookie) |
| **Media/Storage** | Cloudinary (multer-storage-cloudinary) |
| **Email** | Nodemailer |
| **Validation** | express-validator |
| **Security** | Helmet, express-mongo-sanitize, rate limiting, CORS |
| **Frontend** | React 18, Vite 5 |
| **Styling** | Tailwind CSS 3.4 |
| **Routing** | React Router DOM 6 |
| **Animation** | Framer Motion 10, GSAP 3.12 |
| **3D** | Three.js 0.159, React Three Fiber 8, Drei 9 |
| **Forms** | React Hook Form 7 |
| **HTTP Client** | Axios 1.6 |
| **SEO** | React Helmet Async 2 |
| **Admin Charts** | Recharts 3.8 |
| **Notifications** | React Hot Toast 2.4 |
| **Build** | Vite 5 (client + admin), nodemon (server dev) |

---

## Architecture

### High-Level

```
┌─────────────────────┐     ┌─────────────────────┐
│   Client (React)    │     │   Admin (React)      │
│   Port 5173         │     │   Port 5174          │
└────────┬────────────┘     └──────────┬──────────┘
         │                             │
         └──────────┬──────────────────┘
                    │  REST API (JSON)
         ┌──────────▼──────────┐
         │   Express Server    │
         │   Port 3000         │
         └──────┬──────┬───────┘
                │      │
    ┌───────────▼─┐  ┌─▼──────────┐
    │   MongoDB   │  │ Cloudinary │
    └─────────────┘  └────────────┘
```

### Backend Structure
- `app.js` — Middleware chain: Helmet → CORS → rate limiter → JSON parser → cookie parser → mongo-sanitize → Morgan → routes → error handler
- `server.js` — Connects to MongoDB then starts the HTTP server
- Controllers handle business logic; routes define endpoints and middleware chains
- All API responses use a standardized shape from `utils/apiResponse.js`

### Frontend Structure
- `SiteContext` — Loads site settings on boot (hero text, social links, SEO data) from `/api/settings`
- All public data fetching is done via Axios instances in `src/api/`
- Pages use Framer Motion for transitions; GSAP for scroll-driven animations; Three.js for the hero 3D scene

### Admin Structure
- `AuthContext` — Holds access token in memory; runs a silent token refresh on mount; schedules auto-refresh before expiry
- `axiosAdmin.js` — Axios instance with `Authorization` header interceptor; on 401, attempts token refresh before retrying
- `AdminRoute.jsx` — Wraps protected routes; redirects to `/login` if no valid session
- All admin pages are lazy-loaded

### Auth Flow
1. `POST /api/auth/login` — Validates credentials, returns access token in body + refresh token as httpOnly cookie
2. Client stores access token in memory (`AuthContext` state)
3. Each request sends `Authorization: Bearer <accessToken>`
4. `protect` middleware verifies JWT, loads admin from DB
5. `POST /api/auth/refresh` — Reads httpOnly cookie, rotates refresh token, returns new access token
6. Admin client auto-refreshes ~1 minute before expiry; retries 401 responses once after refresh
7. `POST /api/auth/logout` — Clears cookie, removes refresh token from DB

### Media/Upload Flow
1. Admin selects file in `ProjectEditor` or `VideoUploader`
2. `POST /api/admin/upload/image` or `/video` (multipart/form-data)
3. Multer parses the file; `multer-storage-cloudinary` streams it directly to Cloudinary
4. Cloudinary returns `public_id` and `secure_url`
5. URLs stored in MongoDB with the content document
6. Deletes go through `DELETE /api/admin/upload/:publicId` which calls `cloudinary.uploader.destroy()`

---

## Folder Structure

```
EDITOR-PORTFOLIO/
├── server/                  # Node.js/Express REST API
│   ├── server.js            # Entry point
│   ├── app.js               # Middleware + route registration
│   ├── seedAdmin.js         # One-time admin account seeder
│   ├── config/
│   │   ├── db.js            # Mongoose connection
│   │   ├── cloudinary.js    # Cloudinary SDK init
│   │   └── constants.js     # Roles, statuses, upload folders
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express route definitions
│   ├── controllers/         # Business logic handlers
│   ├── middleware/          # protect, adminOnly, upload, errorHandler, rateLimiter
│   ├── utils/               # AppError, apiResponse, generateToken, sendEmail, cloudinaryHelpers
│   └── validations/         # express-validator rule sets
│
├── client/                  # Public portfolio (React + Vite)
│   └── src/
│       ├── api/             # Axios API clients
│       ├── context/         # SiteContext (global settings)
│       ├── components/
│       │   ├── common/      # Navbar, Footer, CustomCursor, ScrollProgress
│       │   ├── home/        # Hero, Showreel, FeaturedProjects, TestimonialsPreview
│       │   ├── portfolio/   # ProjectGrid, ProjectCard, ProjectModal, BeforeAfterSlider
│       │   ├── three/       # HeroScene, FloatingParticles, LightRig (Three.js)
│       │   └── animations/  # TextReveal, ScrollReveal, MarqueeBar (GSAP)
│       ├── pages/           # Home, Portfolio, ProjectDetail, Services, Testimonials, Contact, About
│       ├── hooks/           # useMediaQuery, animation hooks
│       └── utils/           # GSAP init, Cloudinary URL helpers
│
└── admin/                   # Admin dashboard (React + Vite)
    └── src/
        ├── api/             # Axios admin clients (with auth interceptor)
        ├── context/         # AuthContext (token, refresh logic)
        ├── guards/          # AdminRoute (protected route wrapper)
        ├── components/
        │   ├── layout/      # AdminLayout, sidebar, header
        │   ├── forms/       # Reusable form inputs, media picker
        │   ├── modals/      # Delete confirmation
        │   └── ui/          # Buttons, badges, loaders
        ├── pages/           # Dashboard, Login, projects/, videos/, categories/,
        │                    # services/, testimonials/, inquiries/, media/,
        │                    # homepage/, settings/
        ├── hooks/           # useAuth, useApi, form/modal hooks
        └── utils/           # Date formatting, helpers
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- SMTP credentials (for contact email)

### 1. Clone and install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Install admin dependencies
cd ../admin && npm install
```

### 2. Configure environment variables

Create `.env` files in each directory (see [Environment Variables](#environment-variables) below).

### 3. Seed the admin account

```bash
cd server
npm run seed
```

This creates the initial admin user using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `server/.env`.

### 4. Run in development

Open three terminal windows:

```bash
# Terminal 1 — Backend (port 3000)
cd server && npm run dev

# Terminal 2 — Public portfolio (port 5173)
cd client && npm run dev

# Terminal 3 — Admin dashboard (port 5174)
cd admin && npm run dev
```

### 5. Production build

```bash
cd client && npm run build   # outputs to client/dist
cd admin && npm run build    # outputs to admin/dist
cd server && npm run start   # serves API
```

Serve the `dist` folders as static files (e.g., Nginx, Vercel, Netlify).

---

## Environment Variables

### `server/.env`

```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/editor-portfolio

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@example.com

# Admin Seed
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

### `client/.env`

```env
VITE_API_URL=http://localhost:3000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### `admin/.env`

```env
VITE_API_URL=http://localhost:3000/api
VITE_CLIENT_URL=http://localhost:5173
```

---

## Scripts

### Server

| Script | Description |
|---|---|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm run start` | Production start |
| `npm run seed` | Create initial admin account |

### Client / Admin

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |

---

## API Overview

All endpoints are prefixed with `/api`.

### Auth
| Method | Path | Access |
|---|---|---|
| POST | `/auth/login` | Public |
| POST | `/auth/refresh` | Public (cookie) |
| POST | `/auth/logout` | Protected |
| GET | `/auth/me` | Protected |
| PUT | `/auth/change-password` | Admin only |

### Projects
| Method | Path | Access |
|---|---|---|
| GET | `/projects` | Public (paginated, filterable) |
| GET | `/projects/featured` | Public |
| GET | `/projects/:slug` | Public |
| PATCH | `/projects/:slug/view` | Public |
| POST | `/projects` | Admin only |
| PUT | `/projects/:id` | Admin only |
| DELETE | `/projects/:id` | Admin only |
| PATCH | `/projects/reorder/batch` | Admin only |

### Videos
| Method | Path | Access |
|---|---|---|
| GET | `/videos` | Public |
| GET | `/videos/featured` | Public |
| POST | `/videos` | Admin only |
| PUT | `/videos/:id` | Admin only |
| DELETE | `/videos/:id` | Admin only |

### Categories / Services / Testimonials
Each follows the same pattern: `GET` (public), `POST/PUT/DELETE` (admin only).

### Contact
| Method | Path | Access |
|---|---|---|
| POST | `/contact` | Public (rate-limited) |
| GET | `/contact/inquiries` | Admin only |
| GET | `/contact/inquiries/:id` | Admin only |
| PATCH | `/contact/inquiries/:id/status` | Admin only |

### Settings
| Method | Path | Access |
|---|---|---|
| GET | `/settings` | Public |
| PUT | `/settings` | Admin only |

### Upload & Media
| Method | Path | Access |
|---|---|---|
| POST | `/admin/upload/image` | Admin only |
| POST | `/admin/upload/video` | Admin only |
| DELETE | `/admin/upload/:publicId` | Admin only |
| GET | `/admin/media` | Admin only |
| DELETE | `/admin/media/:publicId` | Admin only |

### Dashboard
| Method | Path | Access |
|---|---|---|
| GET | `/admin/dashboard/stats` | Admin only |

### Health
| Method | Path | Access |
|---|---|---|
| GET | `/health` | Public |

---

## Auth System

- **Access token:** Short-lived (15m), returned in response body, stored in memory (never localStorage)
- **Refresh token:** Long-lived (7d), stored as httpOnly cookie; up to 5 active tokens per admin in DB
- **Token rotation:** Every refresh call issues a new refresh token and invalidates the old one
- **Auto-refresh:** Admin client schedules refresh ~1 minute before access token expiry
- **Retry on 401:** Axios interceptor attempts one token refresh then retries the failed request
- **Logout:** Clears the cookie and removes the token from DB
- **Password change:** Invalidates all existing refresh tokens, forcing re-login on all devices
- **Protected routes:** `protect` middleware verifies JWT; `adminOnly` checks the admin role

---

## Media System

- **Storage provider:** Cloudinary
- **Upload path:** `multipart/form-data` → Multer → `multer-storage-cloudinary` → direct stream to Cloudinary
- **Folders:** Separate Cloudinary folders for images and videos (configured in `config/constants.js`)
- **Cleanup:** `cloudinaryHelpers.js` handles asset deletion by `public_id` when content is deleted
- **Media library:** Admin can browse all uploaded assets and delete unused files
- **URL building:** Client uses a helper in `utils/helpers.js` to construct optimized Cloudinary URLs

---

## Current Status

### Complete
- Full REST API with all CRUD operations
- JWT auth with refresh token rotation
- Cloudinary upload and media library
- Public portfolio pages (Home, Portfolio, ProjectDetail, Services, Testimonials, About, Contact)
- Admin dashboard with all management pages
- Contact form with email notifications
- Site settings system (hero, stats, social links, SEO)
- Drag-and-drop project reorder
- View tracking for projects

### Notes
- No automated tests are present
- No CI/CD configuration included
- The `seedAdmin.js` script must be run manually before first login
- Rate limiting is applied globally (100 req/15min) and more strictly on `/auth/login`
