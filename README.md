# Project name: 
Pet Squad 🐾

# Purpose: 
This project connects pet seekers with adoptable animals, making the adoption process smooth and simple to use. Beyond adoption, it also lets the community fund pet-care donation campaigns with secure card payments, so pets in need can get medical care, food, and shelter while they wait for a home.

# Live URL:   
https://pet-squad-3ea76.web.app

# Server-Code:   
https://github.com/Rain44556/pet-squad-server


# Key Features:

**Pet Listings:** Browse adoptable pets with detailed profiles, filters, and sorting.

**Search & Filters:** Find pets by category, age, and adoption status.

**User Authentication:** Secure login & registration using JWT and Firebase Authentication.

**Database Management:** Uses MongoDB for pet, user, adoption, and donation data.

**Data Fetching:** Powered by TanStack Query (including infinite-scroll pagination) for optimized API interactions.

**Modern UI:** Built with ShadCN UI, Tailwind CSS, Framer Motion, and React.js for a sleek, responsive, animated design.

**Adoption Requests:** Users can submit adoption requests, and pet owners can accept or decline them.

**Donation Campaigns:** Create and browse pet-care donation campaigns, with live progress tracking and pause/resume controls for campaign owners.

**Secure Payments:** Donate to any campaign via Stripe, with donation history and refund support.

**Admin Panel:** Manage users, pets, and donation campaigns; promote users to admin.

**Mobile-Friendly:** Fully responsive design for all devices.


# Backend Architecture:

The server (`pet-squad-server`) is organized into layers so each concern lives in one place:

* `routes/` — maps HTTP paths to controllers per resource (users, pets, adoption, donation campaigns, donations, auth)

* `controllers/` — handles request/response and authorization checks

* `services/` — talks to MongoDB collections

* `middlewares/` — JWT verification, admin checks, and ownership checks

* `config/db.js` — MongoDB connection and shared helpers


# npm packages:

Core Packages-
* react 
* react-dom
* react-router-dom

Authentication & Security-
* jsonwebtoken (JWT)
* firebase 

Database & Backend-
* nodejs
* MongoDB
* express 
* cors
* dotenv

Payments-
* stripe
* @stripe/react-stripe-js
* @stripe/stripe-js

Data Fetching & State Management-
* @tanstack/react-query 
* @tanstack/react-table
* axios 

UI & Styling-
* tailwindcss
* @radix-ui + shadcn/ui components
* framer-motion (motion)
* lucide-react
* swiper

 Additional Utilities-
* react-hook-form 
* formik
* sweetalert2
* react-toastify
* react-modal
* react-select
* react-helmet-async