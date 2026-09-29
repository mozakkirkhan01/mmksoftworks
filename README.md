# MMK Softworks

> **Building Smart Software for Growing Businesses across India.**  
> *Ideas → Code → Impact*

[![Angular](https://img.shields.io/badge/Angular-19+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com/)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-7928CA?style=for-the-badge)](https://lenis.darkroom.engineering/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mmksoftworks.vercel.app)

**Live Production Website**: [https://mmksoftworks.vercel.app](https://mmksoftworks.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Solutions & Services](#solutions--services)
- [Key Architectural Highlights](#key-architectural-highlights)
  - [Interactive 3D Robot Mascot (WebGL & GLB)](#1-interactive-3d-robot-mascot-webgl--glb)
  - [Zero-Churn Smooth Scrolling (Lenis + GSAP)](#2-zero-churn-smooth-scrolling-lenis--gsap)
  - [GPU-Accelerated Custom Cursor](#3-gpu-accelerated-custom-cursor)
  - [Modern Angular 19 Architecture](#4-modern-angular-19-architecture)
- [Technology Stack](#technology-stack)
- [Project Directory Structure](#project-directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
  - [Building for Production](#building-for-production)
  - [Building the 3D GLB Robot Model](#building-the-3d-glb-robot-model)
- [Deployment Configuration](#deployment-configuration)
- [Company Information & Contact](#company-information--contact)

---

## Overview

**MMK Softworks** is an enterprise technology company based in Bokaro Steel City, Jharkhand, India. We engineer end-to-end custom ERP systems, business process automation tools, and modern high-performance web platforms for growing businesses, educational institutions, healthcare facilities, and logistics providers.

Our corporate web platform is built from the ground up to showcase engineering excellence, featuring:
- A real-time, bone-rigged 3D GLB character mascot (**MMK Bot**) with interactive physics and gestures.
- Buttery 60–120 FPS momentum smooth scrolling synchronized with cinematic GSAP ScrollTrigger reveals.
- Responsive, accessible design with glassmorphic UI components, dynamic theme switching, and client-side routing.

---

## Solutions & Services

### Enterprise Solutions
- **School ERP**: Student lifecycles, automated fee management, exam grading, attendance tracking, and parent communication portal.
- **Travel ERP**: Tour itinerary management, booking engines, fleet dispatching, hotel vouchers, and automated invoices.
- **Retail & Inventory ERP**: Multi-store POS, real-time inventory tracking, vendor management, GST billing, and low-stock alerts.
- **Hospital & Clinic ERP**: Patient EHR records, OPD/IPD scheduling, laboratory reports, doctor rounds, and pharmacy billing.
- **Cooperative Society ERP**: Member ledgers, fixed/recurring deposits, loan disbursements, EMI calculation, and dividend distribution.
- **Custom ERP Solutions**: Tailor-made workflow automation built around unique operational workflows.

### Digital Engineering Services
- **Full-Stack Web Development**: High-conversion modern web apps, PWAs, and enterprise dashboards.
- **Business Process Automation**: Workflow orchestration eliminating manual data entry and operational bottlenecks.
- **API & Third-Party Integration**: Payment gateways (Razorpay, UPI), WhatsApp Business API, SMS, transactional email, and accounting systems.
- **Reporting & Analytics**: Executive dashboards, financial analytics, and operational metrics.
- **24/7 SLA Maintenance & Support**: High-availability cloud monitoring and security patch management.

---

## Key Architectural Highlights

### 1. Interactive 3D Robot Mascot (WebGL & GLB)
- **Model Asset**: [`src/assets/models/robot.glb`](src/assets/models/robot.glb)
- **Generator Script**: [`scripts/build-robot-glb.js`](scripts/build-robot-glb.js)
- **Features**:
  - Fully articulated bone hierarchy: `Hips` → `Spine` → `Chest` → `Neck` → `Head`, plus independent left/right shoulder, arm, forearm, hand, thigh, shin, and sneaker boot bones.
  - Three distinct procedural animations:
    - `Idle`: Natural breathing, organic body floating, and subtle head tilts.
    - `Wave`: Friendly, forward-oriented waving gesture that keeps the hand strictly in front of the body.
    - `Dance`: Coordinated head bobs, chest sways, and rhythmic alternating arm pumps.
  - Real-time cursor tracking: Procedural spherical interpolation (`lerp`) turning the robot's head and eyes toward the user's cursor.
  - ACESFilmic tone-mapping and PBR materials with emissive cyan neon accents.

### 2. Zero-Churn Smooth Scrolling (Lenis + GSAP)
- **Service**: [`src/app/core/services/smooth-scroll.service.ts`](src/app/core/services/smooth-scroll.service.ts)
- **Features**:
  - Leverages **Lenis** momentum scrolling with a custom exponential easing curve (`(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`).
  - **Zone Isolation**: Lenis and the `gsap.ticker` RAF loop are executed strictly outside Angular's `NgZone` (`runOutsideAngular`), preventing Angular from firing 60–120 unnecessary Change Detection cycles per second during scroll.
  - **CSS Harmonization**: Uses modern `overflow-x: clip` and removes competing native `scroll-behavior: smooth` to eliminate frame jitter and rubber-banding.
  - **Navigation Integration**: Automatically resets scroll position and refreshes `ScrollTrigger` instances upon Angular router `NavigationEnd`.
  - **Anchor Offsets**: Smoothly offsets in-page navigation (e.g. `#contact-section`) by `-80px` to clear the fixed top navigation bar.

### 3. GPU-Accelerated Custom Cursor
- **Component**: [`src/app/shared/components/custom-cursor/custom-cursor.component.ts`](src/app/shared/components/custom-cursor/custom-cursor.component.ts)
- **Features**:
  - Decoupled from Angular Zone change detection.
  - Employs direct DOM updates and a spring-lerp trailing outer ring via a dedicated `requestAnimationFrame` loop.
  - Uses CSS `will-change: transform` and `translate3d` for hardware compositing.
  - Automatically switches into interactive state when hovering over links, buttons, and clickable elements.

### 4. Modern Angular 19 Architecture
- Standalone components throughout (`imports: [CommonModule, RouterLink, ...]`).
- Modern Angular Signals (`signal<T>()`, `update()`, `set()`) for local reactive state.
- Tree-shakable singleton services provided in root.
- Clean separation of core data, reusable shared UI components, and lazy-loaded page modules.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Angular 19+ (Standalone Components, Signals, Application Builder) |
| **Language** | TypeScript 5.9, HTML5, SCSS (Sass Dart) |
| **3D & WebGL** | Three.js (r186), GLTFLoader, Procedural Keyframe Animations |
| **Animations** | GSAP 3.12, ScrollTrigger |
| **Smooth Scroll** | Lenis 1.1+ |
| **Icons & Media** | SVG Vectors, Optimized WebP/PNG Assets |
| **Deployment** | Vercel Serverless Platform, GitHub Actions |

---

## Project Directory Structure

```text
mmksoftworks/
├── angular.json                 # Angular CLI workspace configuration
├── package.json                 # Dependencies and build scripts
├── tsconfig.json                # TypeScript root configuration
├── tsconfig.app.json            # Application TypeScript configuration
├── vercel.json                  # Vercel production deployment and SPA rewrites
├── scripts/
│   └── build-robot-glb.js       # Node.js script generating the rigged 3D GLB robot
├── public/                      # Static fonts, documents, and public assets
└── src/
    ├── index.html               # Main HTML entry point
    ├── main.ts                  # Angular bootstrap file
    ├── styles/                  # Global style architecture
    │   ├── styles.scss          # Core entry point (Lenis, resets, global themes)
    │   ├── _variables.scss      # Theme tokens, cyan/navy palette, typography
    │   └── _typography.scss     # Font declarations and responsive scales
    ├── assets/
    │   ├── logo.png             # Official MMK Softworks brand logo
    │   ├── robot.png            # Mascot visual fallbacks
    │   └── models/
    │       └── robot.glb        # Rigged 3D GLB robot model asset
    └── app/
        ├── app.component.ts     # Root shell (Navbar, Main Content, Footer, Cursor)
        ├── app.config.ts        # App configuration (Router, Zone change detection)
        ├── app.routes.ts        # Application routes & lazy module definitions
        ├── core/                # Core singletons and business services
        │   ├── models/          # TypeScript interfaces (Solution, Project, Industry)
        │   └── services/
        │       ├── animation.service.ts      # GSAP Context helper service
        │       ├── seo.service.ts            # Dynamic title & meta tag management
        │       ├── smooth-scroll.service.ts  # Lenis + GSAP Ticker scroll engine
        │       └── theme.service.ts          # Dark/Light theme coordinator
        ├── shared/              # Reusable UI widgets and mock datasets
        │   ├── components/
        │   │   ├── navbar/                   # Responsive header with animated dropdowns
        │   │   ├── footer/                   # Corporate footer with direct contact links
        │   │   └── custom-cursor/            # GPU-accelerated interactive cursor
        │   └── data/                         # Enterprise data sources
        │       ├── industries.data.ts
        │       ├── projects.data.ts
        │       ├── services.data.ts
        │       ├── solutions.data.ts
        │       └── technology.data.ts
        └── pages/               # Routed page views
            ├── home/            # Landing page (Hero, Workflow, Ecosystem, Tech Stack)
            ├── about/           # Company story, leadership, values, and timeline
            ├── what-we-do/      # Strategic service offerings & process
            ├── services/        # Detailed breakdown of digital services
            ├── solutions/       # Detailed breakdown of ERP solutions
            ├── technology/      # Full-stack architectural breakdown
            ├── industries/      # Industry-specific application overviews
            ├── projects/        # Client case studies and showcase
            └── career/          # Open positions and culture
```

---

## Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher (tested with Node 24)
- **npm**: `v10.x` or higher

### Installation
Clone the repository and install all project dependencies:
```bash
git clone https://github.com/mozakkirkhan01/mmksoftworks.git
cd mmksoftworks
npm install
```

### Running the Development Server
Start the local Angular development server:
```bash
npm start
# or
ng serve --port 4200
```
Open your browser and navigate to `http://localhost:4200`. The application supports live reloading on code changes.

### Building for Production
To compile and optimize the production bundle:
```bash
npm run build
```
The compiled output will be written to `dist/mmksoftworks/browser`.

### Building the 3D GLB Robot Model
To recompile or tune the 3D GLB robot character model and its keyframe animation tracks:
```bash
node scripts/build-robot-glb.js
```
This updates the binary model file directly at `src/assets/models/robot.glb`.

---

## Deployment Configuration

The application is deployed on **Vercel** with full client-side routing support.

### `vercel.json`
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/mmksoftworks/browser",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Deploying Updates
```bash
# Push to main branch (triggers automated CI/CD deployment):
git push origin main

# Or deploy immediately via Vercel CLI:
vercel --prod
```

---

## Company Information & Contact

**MMK Softworks**  
*Building Smart Software for Growing Businesses across India.*

- **Headquarters**: Bokaro Steel City, Jharkhand, India
- **Phone**: [+91 88047 91446](tel:8804791446) / [+91 72771 89618](tel:7277189618)
- **Email**: [hello@mmksoftworks.com](mailto:hello@mmksoftworks.com)
- **Website**: [https://mmksoftworks.vercel.app](https://mmksoftworks.vercel.app)

---

&copy; MMK Softworks. All rights reserved.