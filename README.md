# 🚗 Smart Ride Sharing System

<div align="center">

![Smart Ride Sharing](https://img.shields.io/badge/Smart-Ride%20Sharing-purple?style=for-the-badge&logo=car&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange?style=for-the-badge&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Auth-red?style=for-the-badge&logo=jsonwebtokens)

**A full-stack carpooling & ride-sharing platform where drivers post rides and passengers search, book, and pay — all in one place.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Docs](#-api-endpoints)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About the Project

**Smart Ride Sharing System** is a dynamic carpooling web application that connects drivers and passengers for shared journeys. Drivers can post available rides, and passengers can search, book, and pay for seats — reducing travel costs and carbon emissions.

> 🌱 Share Rides. Save Money. Travel Smart.

---

## ✨ Features

### 🔐 Authentication
- OTP-based login via Email
- JWT token authentication
- Role-based access: **Driver / Passenger / Admin**
- Secure password change

### 🚗 Driver
- Post new rides (source, destination, time, seats, price/km)
- View and manage posted rides
- Accept / Reject booking requests
- Mark rides as completed or cancelled
- View earnings & ride history
- See passenger reviews and ratings

### 🧍 Passenger
- Search rides by source, destination & date
- Advanced filters (min seats, max price, sort by rating/price)
- Book rides with seat selection
- View booking status (Pending / Approved / Rejected)
- Cancel bookings
- Rate & review drivers after ride completion
- View booking history & spending stats

### 💰 Payments
- Dynamic fare calculation (base fare + distance charge)
- Razorpay payment integration
- Payment history for both drivers and passengers
- Driver wallet / earnings dashboard

### 🔔 Notifications
- Real-time booking updates
- Ride cancellation alerts
- Payment success notifications

### 🛠️ Admin Dashboard
- Total users, active rides, completed rides
- Payment statistics
- User management table

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java 17, Spring Boot 3.x |
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Database** | MySQL 8.x |
| **ORM** | Spring Data JPA / Hibernate |
| **Auth** | JWT + OTP (Email) |
| **Payment** | Razorpay |
| **Email** | Spring Mail (Gmail SMTP) |
| **Icons** | Lucide React |
| **Build Tool** | Maven |

---

## 📁 Project Structure

```
smart-ride-sharing-system/
│
├── ridesharing/                        # 🟢 Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rideshare/
│   │   │   │   ├── controller/         # REST Controllers
│   │   │   │   ├── service/            # Business Logic
│   │   │   │   ├── repository/         # JPA Repositories
│   │   │   │   ├── model/              # Entity Classes
│   │   │   │   ├── dto/                # Data Transfer Objects
│   │   │   │   ├── config/             # Security, JWT Config
│   │   │   │   └── util/               # Helper Utilities
│   │   │   └── resources/
│   │   │       └── application.properties.example
│   │   └── test/
│   └── pom.xml
│
├── ridesharing-frontend/               # 🔵 React Frontend
│   ├── src/
│   │   ├── components/                 # Reusable UI Components
│   │   ├── pages/                      # Page Components
│   │   ├── context/                    # React Context (Auth)
│   │   ├── services/                   # API Call Functions
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- ☕ Java 17+
- 📦 Maven 3.8+
- 🟢 Node.js 18+ & npm
- 🐬 MySQL 8+
- 📬 Gmail account (for OTP emails)
- 💳 Razorpay account (for payments)

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/smart-ride-sharing-system.git

# 2. Navigate to backend
cd smart-ride-sharing-system/ridesharing

# 3. Copy and configure properties
cp src/main/resources/application.properties.example src/main/resources/application.properties

# 4. Edit application.properties with your actual values
# (DB credentials, JWT secret, email, Razorpay keys)

# 5. Create MySQL database
mysql -u root -p
CREATE DATABASE ridesharing;
EXIT;

# 6. Run the Spring Boot application
mvn spring-boot:run
```

> ✅ Backend runs on `http://localhost:8080`

---

### Frontend Setup

```bash
# 1. Navigate to frontend
cd smart-ride-sharing-system/ridesharing-frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

> ✅ Frontend runs on `http://localhost:5173`

---

## 🔑 Environment Variables

Create `application.properties` from the example file and fill in your values:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ridesharing
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

# JWT
jwt.secret=YOUR_JWT_SECRET_KEY
jwt.expiration=86400000

# Email (OTP)
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_GMAIL_APP_PASSWORD

# Razorpay
razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET
```

---

## 📡 API Endpoints

### 🔐 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/verify-otp-login` | Verify OTP & login |

### 🚗 Rides
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rides/create/{driverId}` | Create a ride |
| GET | `/api/rides/all` | Get all rides |
| GET | `/api/rides/search` | Search rides |
| GET | `/api/rides/search/filtered` | Filtered search |
| POST | `/api/rides/book/{rideId}` | Book a ride |
| PUT | `/api/rides/complete/{rideId}` | Complete a ride |
| DELETE | `/api/rides/cancel/{rideId}` | Cancel a ride |
| GET | `/api/rides/history/driver/{driverId}` | Driver ride history |

### 📋 Booking Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ride-requests/user/{userId}` | User bookings |
| GET | `/api/ride-requests/ride/{rideId}` | Ride requests |
| PUT | `/api/ride-requests/approve/{id}` | Approve request |
| PUT | `/api/ride-requests/reject/{id}` | Reject request |
| DELETE | `/api/ride-requests/cancel/{id}` | Cancel booking |

### 💰 Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-order` | Create payment order |
| POST | `/api/payments/verify` | Verify payment |
| GET | `/api/payments/wallet/{driverId}` | Driver wallet |
| GET | `/api/payments/history/passenger/{id}` | Passenger history |
| GET | `/api/payments/history/driver/{id}` | Driver history |

### ⭐ Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews/add/{rideId}/{userId}` | Add review |
| GET | `/api/reviews/driver/{driverId}` | Get driver reviews |

### 🔔 Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/user/{userId}` | Get notifications |
| PUT | `/api/notifications/read-all/{userId}` | Mark all as read |

### 📊 Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/driver/{driverId}` | Driver statistics |
| GET | `/api/stats/passenger/{userId}` | Passenger statistics |

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "✨ Add your feature"

# 4. Push to the branch
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@Sweekrithi Shetty](https://github.com/sweekrithishetty28)
- LinkedIn: [Sweekrithi Shetty](www.linkedin.com/in/sweekrithi-shetty28)

---


<div align="center">

⭐ **If you found this helpful, please give it a star!** ⭐

Made with ❤️ by Sweekrithi Shetty

</div>
