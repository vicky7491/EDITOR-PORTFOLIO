# CLAUDE.md

## Project Summary
Full-stack video editor portfolio. Public React portfolio site + React admin dashboard + Node.js/Express REST API + MongoDB. Admin manages all content (projects, videos, services, testimonials, site settings, contact inquiries) via a private dashboard. Media stored on Cloudinary.

---

## Stack
- **Backend:** Node.js, Express 4, MongoDB (Mongoose 8), JWT, Cloudinary, Nodemailer, express-validator
- **Frontend (client):** React 18, Vite 5, Tailwind CSS 3, Framer Motion 10, GSAP 3, Three.js + React Three Fiber, React Router DOM 6, Axios, React Hook Form, React Helmet Async
- **Admin:** React 18, Vite 5, Tailwind CSS 3, Framer Motion, Recharts, Axios, React Hook Form

---

## Architecture Summary

```
client/ (port 5173) ─┐
                      ├─→ REST API (Express, port 3000) ─→ MongoDB
admin/  (port 5174) ─┘                                  ─→ Cloudinary
```

Three independent apps sharing a single backend. No monorepo tooling — each has its own `package.json`.

**Backend:** `app.js` registers middleware chain (Helmet → CORS → rate limiter → JSON/cookie → mongo-sanitize → Morgan → routes → error handler). `server.js` boots after MongoDB connects. All responses use `utils/apiResponse.js` shape.

**Client:** `SiteContext` loads global site settings on boot. Pages use Framer Motion transitions; GSAP scroll animations; Three.js hero 3D scene.

**Admin:** `AuthContext` holds access token in React state + schedules silent refresh. `axiosAdmin.js` injects `Authorization` header; retries once on 401 after refresh. All pages lazy-loaded behind `AdminRoute` guard.

---

## Key Flows

### Auth
1. `POST /api/auth/login` → access token in body + refresh token as httpOnly cookie
2. Client stores access token in memory only (never localStorage)
3. Requests: `Authorization: Bearer <accessToken>`
4. `protect` middleware: verify JWT → attach admin to `req`
5. `POST /api/auth/refresh` → rotates refresh token, returns new access token
6. Password change invalidates all refresh tokens (force re-login everywhere)
7. Up to 5 refresh tokens stored per admin in DB

### Upload/Media
1. Admin submits file via `POST /api/admin/upload/image|video` (multipart/form-data)
2. Multer + `multer-storage-cloudinary` → streams directly to Cloudinary
3. Returns `{ public_id, secure_url }` → stored in MongoDB document
4. Delete: `DELETE /api/admin/upload/:publicId` → `cloudinary.uploader.destroy()`

### Data Flow (public)
- Client fetches from `/api/projects`, `/api/settings`, etc. via `src/api/*.js` modules
- `SiteContext` caches settings globally on app boot
- No client-side state management library — React state + context only

---

## Folder Map

```
server/
  config/         db.js, cloudinary.js, constants.js
  models/         Admin, Project, Video, Service, Category, Testimonial, SiteSettings, ContactInquiry
  routes/         auth, project, video, category, service, testimonial, contact, settings, upload, dashboard, media
  controllers/    mirrors routes
  middleware/     protect.js, adminOnly.js, upload.js, errorHandler.js, rateLimiter.js
  utils/          AppError.js, apiResponse.js, generateToken.js, sendEmail.js, cloudinaryHelpers.js
  validations/    express-validator rule sets

client/src/
  api/            axiosInstance.js + per-resource modules
  context/        SiteContext.jsx
  components/     common/, home/, portfolio/, three/, animations/
  pages/          Home, Portfolio, ProjectDetail, Services, Testimonials, Contact, About
  hooks/          useMediaQuery + animation hooks
  utils/          gsap.js, helpers.js (Cloudinary URL builder)

admin/src/
  api/            axiosAdmin.js + per-resource modules
  context/        AuthContext.jsx
  guards/         AdminRoute.jsx
  components/     layout/, forms/, modals/, ui/
  pages/          Dashboard, Login, projects/, videos/, categories/, services/,
                  testimonials/, inquiries/, media/, homepage/, settings/
  hooks/          useAuth.js, useApi.js
```

---

## Conventions
- API base: `/api/*`; all admin-only routes additionally gated by `protect` + `adminOnly` middleware
- Projects addressed by `slug` on public routes, by `_id` on admin CRUD routes
- Standardized API response: `{ success, message, data, pagination? }` via `utils/apiResponse.js`
- Cloudinary `public_id` is the canonical reference for all media; never store raw filenames
- Vite path alias `@` maps to `src/` in both client and admin
- Access tokens: 15m; refresh tokens: 7d; httpOnly cookie name assumed `refreshToken`

---

## Current State

**Complete:**
- Full REST API + all CRUD operations
- JWT auth with refresh token rotation
- Cloudinary upload + media library management
- All public portfolio pages
- Full admin dashboard (all content management pages)
- Contact form + email notifications
- Site settings (hero, stats, social links, SEO)
- Drag-and-drop project reorder, view tracking

**Missing / Not present:**
- No automated tests (unit, integration, or e2e)
- No CI/CD configuration
- Admin account must be created via `cd server && npm run seed` before first login

---

## Constraints
- Do not move access token to localStorage — it is intentionally in-memory only
- Do not remove refresh token rotation — old token must be invalidated on each refresh
- `protect` middleware must remain on all write/admin routes
- Cloudinary deletions must go through `cloudinaryHelpers` to avoid orphaned assets
- `SiteSettings` is a singleton document — there is only one; do not allow creation of multiple
- Rate limiter on `/api/auth/login` is separate and stricter than the global limiter — keep both
