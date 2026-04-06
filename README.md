# FOSSEE Workshop Booking — Modern Redesign

This is a complete redesign of the FOSSEE Workshop Booking system, transitioning from a legacy server-rendered Django application to a modern, high-performance React Single Page Application (SPA).

## Redesign Goals
- **Modern UI/UX**: Indigo-themed design with glassmorphism and smooth transitions.
- **Mobile First**: Built with responsive layouts specifically for student access.
- **Accessibility**: Semantic HTML and keyboard-navigable components.
- **Performance**: Optimized React build served statically by Django.

---

## Reasoning & Design Decisions

### 1. What design principles guided your improvements?
- **Visual Hierarchy**: Used clear typography (Inter font) and weight to distinguish primary actions (Propose/Accept) from secondary metadata.
- **Consistency**: Implemented a unified design system in `index.css` with indigo tokens, ensuring every card and button feels part of the same ecosystem.
- **Context-Aware UI**: Roles (Instructor/Coordinator) are strictly enforced in the frontend and backend, with dedicated dashboards that surface the most critical tasks first.
- **Glassmorphism**: Subtle background blurs on cards create a sense of depth and modernity without compromising readability.

### 2. How did you ensure responsiveness across devices?
- **Flex & Grid Layouts**: Replaced static tables with responsive grids that collapse into cards on mobile (375px+).
- **Mobile-First Components**: The Navbar and Dashboard tables use horizontal scrolling or stacking to remain usable on small screens.
- **Viewport units**: Used relative units and `min-max` constraints to ensure the UI scales gracefully from phone to desktop.

### 3. What trade-offs did you make between the design and performance?
- **Session Auth over JWT**: Chose to stick with Django's native session-cookie authentication. This avoided the overhead of JWT management and complex refresh logic, keeping the bundle size smaller and security robust.
- **Vite over CRA**: Used Vite for the build process, resulting in significantly faster Hot Module Replacement (HMR) and a smaller production bundle.
- **Icons**: Selective use of `react-icons` to avoid loading massive icon fonts.

### 4. What was the most challenging part of the task and how did you approach it?
- **The Challenge**: Bridging the gap between the legacy Django URL structure and a React catch-all route without breaking internal Django Admin access.
- **The Approach**: Implemented a sophisticated Django URL configuration using a regex catch-all `.*$` placed *after* the API and Admin routes. This ensures that traditional Django functionality remains intact while React handles all user-facing routing.

---

## Visual Showcase (Before & After)

### Registration Page (Before vs. After)
Comparing the legacy Bootstrap form with the modern React glassmorphism design.

| Legacy (Before) | Modern (After) |
| :---: | :---: |
| ![Legacy Registration](/docs/screenshots/legacy_register.png) | ![Modern Registration](/docs/screenshots/modern_register.png) |

---

### Dashboard & Tracking (Before vs. After)
Comparing the legacy table-based dashboard with the modern interactive design.

| Legacy Dashboard (Before) | Modern Dashboard (After) |
| :---: | :---: |
| ![Legacy Dashboard](/docs/screenshots/legacy_dashboard.png) | ![Modern Dashboard](/docs/screenshots/Screenshot 2026-04-06 141210.png) |

---

### Comparison of Key Features

| Page | Before (Legacy) | After (Modern React) |
|---|---|---|
| **Dashboard** | Simple Bootstrap tables, limited visual hierarchy. | Modern cards, status badges, and prioritized task lists. |
| **Login** | Basic HTML form on white background. | Centered glassmorphism card with indigo accents and animations. |
| **Workshop Details** | Text-heavy static table. | Structured layout with sidebar actions and integrated discussion system. |

---

## Setup & Local Development

### Prerequisites
- Python 3.8+
- Node.js 18+

### 1. Backend Setup (Django)
```bash
# Install dependencies
pip install -r requirements.txt

# Migrate database
python manage.py migrate

# Start the server
python manage.py runserver
```

### 2. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```
The React app will be available at `http://localhost:5173`. API calls are proxied to the Django backend.

### 3. Production Build
```bash
cd frontend
npm run build
```
Django will serve the built files automatically from `frontend/dist`.
