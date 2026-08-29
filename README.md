<div align="center">

# 🐾 Pet Squad

**Connecting loving homes with pets who need them.**

Browse adoptable pets, submit adoption requests, and fund pet-care donation campaigns — all in one modern, responsive platform.

[![Live Site](https://img.shields.io/badge/Live-pet--squad-6C5CE7?style=for-the-badge&logo=firebase&logoColor=white)](https://pet-squad-3ea76.web.app)
[![Server Repo](https://img.shields.io/badge/Server-pet--squad--server-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/noor00111/pet-squad-server)

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)

</div>

---

## 📖 Purpose

Pet Squad connects pet seekers with adoptable animals, making the adoption process smooth and simple to use. Beyond adoption, it also lets the community fund pet-care donation campaigns with secure card payments, so pets in need can get medical care, food, and shelter while they wait for a home.

---

## 🔗 Quick Links

| Resource | Link |
|---|---|
| 🌐 Live Site | [pet-squad-3ea76.web.app](https://pet-squad-3ea76.web.app) |
| 🖥️ Server Repository | [pet-squad-server](https://github.com/noor00111/pet-squad-server) |

---

## 📸 Website Look

<div align="center">

### 🏠 Home Page
<img src="src/assets/ss/home.png" alt="Home Page" width="90%" />

### ℹ️ About Page
<img src="src/assets/ss/about-page.png" alt="About Page" width="90%" />

### 🐶 Not Yet Adopted Pets
<img src="src/assets/ss/not-adopted-pets.png" alt="Not Adopted Pets" width="90%" />

### 💝 Donation Campaign
<img src="src/assets/ss/donation-campaign.png" alt="Donation Campaign" width="90%" />

<br/>

<table>
<tr>
<td align="center"><b>📝 Sign Up</b><br/><img src="src/assets/ss/signup.png" alt="Sign Up Page" width="100%" /></td>
<td align="center"><b>➕ Add a Pet</b><br/><img src="src/assets/ss/add-pet-form.png" alt="Add Pet Form" width="100%" /></td>
</tr>
<tr>
<td align="center"><b>🐾 My Added Pets</b><br/><img src="src/assets/ss/my-added-pets.png" alt="My Added Pets" width="100%" /></td>
<td align="center"><b>💳 My Donations</b><br/><img src="src/assets/ss/my-donation.png" alt="My Donations" width="100%" /></td>
</tr>
</table>

### 🛠️ Admin Dashboard
<img src="src/assets/ss/admin-dashboard.png" alt="Admin Dashboard" width="90%" />

</div>

---

## ✨ Key Features

- 🐕 **Pet Listings** — Browse adoptable pets with detailed profiles, filters, and sorting.
- 🔍 **Search & Filters** — Find pets by category, age, and adoption status.
- 🔐 **User Authentication** — Secure login & registration using JWT and Firebase Authentication.
- 🗄️ **Database Management** — Uses MongoDB for pet, user, adoption, and donation data.
- ⚡ **Data Fetching** — Powered by TanStack Query (including infinite-scroll pagination) for optimized API interactions.
- 🎨 **Modern UI** — Built with ShadCN UI, Tailwind CSS, Framer Motion, and React.js for a sleek, responsive, animated design.
- 📋 **Adoption Requests** — Users can submit adoption requests, and pet owners can accept or decline them.
- 💰 **Donation Campaigns** — Create and browse pet-care donation campaigns, with live progress tracking and pause/resume controls for campaign owners.
- 💳 **Secure Payments** — Donate to any campaign via Stripe, with donation history and refund support.
- 🛠️ **Admin Panel** — Manage users, pets, and donation campaigns; promote users to admin.
- 📱 **Mobile-Friendly** — Fully responsive design for all devices.

---

## 🏗️ Backend Architecture

The server (`pet-squad-server`) is organized into layers so each concern lives in one place:

```
routes/        → maps HTTP paths to controllers per resource (users, pets, adoption, donation campaigns, donations, auth)
controllers/   → handles request/response and authorization checks
services/      → talks to MongoDB collections
middlewares/   → JWT verification, admin checks, and ownership checks
config/db.js   → MongoDB connection and shared helpers
```

---

## 📦 Tech Stack & Packages

<table>
<tr>
<td valign="top" width="50%">

**Core**
- react
- react-dom
- react-router-dom

**Authentication & Security**
- jsonwebtoken (JWT)
- firebase

**Database & Backend**
- nodejs
- MongoDB
- express
- cors
- dotenv

**Payments**
- stripe
- @stripe/react-stripe-js
- @stripe/stripe-js

</td>
<td valign="top" width="50%">

**Data Fetching & State Management**
- @tanstack/react-query
- @tanstack/react-table
- axios

**UI & Styling**
- tailwindcss
- @radix-ui + shadcn/ui components
- framer-motion (motion)
- lucide-react
- swiper

**Additional Utilities**
- react-hook-form
- formik
- sweetalert2
- react-toastify
- react-modal
- react-select
- react-helmet-async

</td>
</tr>
</table>

