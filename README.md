# Bolttech Carental - Modern Car Rental Platform

A modern, component-based car rental platform built for Bolttech Barcelona's fullstack assessment. Features enterprise-grade architecture, clean code principles, and modern UI design.

## Tech Stack

- **Frontend**: React 19.0.0, TypeScript 5.7.2, Tailwind CSS v4, React Icons
- **Backend**: Node.js 22+, Express, TypeScript
- **Database**: MySQL 8.0+ with TypeORM
- **Testing**: Jest

## Features

### Core Functionality
- **Smart Car Search**: Real-time availability with intelligent filtering
- **Seasonal Pricing**: Dynamic pricing based on Peak/Mid/Off seasons
- **Instant Booking**: One-click booking with comprehensive validation
- **Real-time Feedback**: Instant success/error notifications


## Architecture Overview

### Frontend Structure
```
client/src/
├── components/           # Reusable UI components
│   ├── Header.tsx       # Site branding & navigation
│   ├── SearchForm.tsx   # Car search functionality
│   ├── StatusMessage.tsx# Success/error notifications
│   ├── AvailableCars.tsx# Car listing & booking
│   ├── BookingHistory.tsx# User booking management
│   └── index.ts         # Component exports
├── services/            # API layer
│   ├── api.ts          # HTTP client & API calls
│   └── index.ts        # Service exports
├── types/              # TypeScript definitions
│   └── index.ts        # All interfaces & types
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

### Backend Structure
```
server/src/
├── controllers/         # API route handlers
├── services/           # Business logic layer
├── entities/           # TypeORM database models
├── dtos/              # Data transfer objects
├── middleware/        # Express middleware
├── migrations/        # Database migrations
├── seeds/             # Database seeders
└── __tests__/         # Test suites
```

## Quick Start

### Prerequisites
- **Node.js** v22+ 
- **MySQL** 8.0+
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mindfulMachineLath/bolttech-test.git
   cd bolttech-carental
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Run migrations & seed data
   npm run migration:run
   npm run seed:cars
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## UI Components

### Design System
- **Color Palette**: Professional orange-gray theme
- **Typography**: Inter font family for modern readability
- **Icons**: React Icons (Font Awesome) for consistency
- **Layout**: Responsive grid system with glassmorphism effects
- **Animations**: Smooth transitions and hover effects

### Component Library

#### `<Header />`
```tsx
// Site branding with professional styling
<Header />
```

#### `<SearchForm />`
```tsx
// Car search with validation
<SearchForm 
  form={formData}
  isLoading={loading}
  onFormChange={handleChange}
  onSubmit={handleSubmit}
/>
```

#### `<AvailableCars />`
```tsx
// Car listing with booking functionality
<AvailableCars 
  availableCars={cars}
  isLoading={loading}
  onBook={handleBooking}
/>
```

## API Reference

### Base URL: `http://localhost:3000/api/v1`

#### **Search Available Cars**
```http
POST /available-cars
Content-Type: application/json

{
  "email": "user@example.com",
  "start_date": "2024-01-15",
  "end_date": "2024-01-20",
  "expire_date": "2025-12-31"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "available": [
      {
        "car_id": 1,
        "brand": "BMW",
        "model_name": "X3",
        "count": 3,
        "total_price": "750.00",
        "average_price": "150.00"
      }
    ],
    "bookingList": {
      "bookings": []
    },
    "user_id": 123
  }
}
```

#### **Create Booking**
```http
POST /bookings
Content-Type: application/json

{
  "user_id": 123,
  "car_id": 1,
  "start_date": "2024-01-15",
  "end_date": "2024-01-20",
  "total_price": 750.00,
  "average_price": 150.00
}
```

## Database Schema

### Tables

#### **Models**
| Field | Type | Description |
|-------|------|-------------|
| `model_id` | INT (PK) | Unique model identifier |
| `model_name` | VARCHAR | Car model name |
| `price_peak` | DECIMAL | Peak season price |
| `price_mid` | DECIMAL | Mid season price |
| `price_off` | DECIMAL | Off season price |

#### **Cars**
| Field | Type | Description |
|-------|------|-------------|
| `car_id` | INT (PK) | Unique car identifier |
| `model_id` | INT (FK) | Reference to model |
| `brand` | VARCHAR | Car brand name |

#### **Bookings**
| Field | Type | Description |
|-------|------|-------------|
| `book_id` | INT (PK) | Unique booking identifier |
| `user_id` | INT (FK) | Reference to user |
| `car_id` | INT (FK) | Reference to car |
| `start_date` | DATE | Booking start date |
| `end_date` | DATE | Booking end date |
| `total_price` | DECIMAL | Total booking cost |
| `average_price` | DECIMAL | Average daily price |

#### **Users**
| Field | Type | Description |
|-------|------|-------------|
| `user_id` | INT (PK) | Unique user identifier |
| `name` | VARCHAR | User full name |
| `email` | VARCHAR | User email address |
| `password` | VARCHAR | Encrypted password |
| `expire_date` | DATE | License expiry date |

## Testing

### Test Suite
```bash
cd server
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## Error Handling

### Error Codes
| Code | Description | Action |
|------|-------------|--------|
| `INVALID_DATE_RANGE` | Invalid booking dates | Check date logic |
| `INVALID_LICENSE_DATE` | Expired license | Update license info |
| `BOOKING_CONFLICT` | Overlapping bookings | Choose different dates |
| `CAR_UNAVAILABLE` | No cars available | Try different dates |


### Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=bolttech_carental_db

# Server
PORT=3000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000
```

## Future Roadmap

### Phase 2 - Enhanced Features
- [ ] **Authentication**: SSO, Google Auth, JWT tokens
- [ ] **Advanced Calendar**: Interactive date picker with availability
- [ ] **Payment Integration**: Stripe, PayPal support
- [ ] **Email Notifications**: Booking confirmations, reminders
- [ ] **Advanced Search**: Filters, sorting, recommendations

### Phase 3 - Enterprise Features
- [ ] **Admin Dashboard**: User management, analytics
- [ ] **Business Intelligence**: Reports, insights, metrics
- [ ] **Multi-language**: i18n support
- [ ] **Mobile App**: React Native companion app
- [ ] **AI Integration**: Smart recommendations, pricing

