# AI-Integrated Event Approval and Management System
## Technical Specification Document

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
│  ┌─────────────────────┐  ┌─────────────────────┐                      │
│  │   React Web App     │  │   Flutter Mobile    │                      │
│  │   (Admin/Faculty)   │  │   (Students/Club)  │                      │
│  └──────────┬──────────┘  └──────────┬──────────┘                      │
│             │                        │                                  │
│             └──────────┬─────────────┘                                  │
│                        ▼                                                  │
│             ┌─────────────────────┐                                      │
│             │   API Gateway       │                                      │
│             │   (Node.js)         │                                      │
│             └──────────┬──────────┘                                      │
└────────────────────────┼────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Auth Layer  │  │  AI Engine    │  │  File Store │
│  (JWT)       │  │  (Rule-based) │  │  (S3/Firebase)│
└──────────────┘  └──────────────┘  └──────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────┐
│                  DATABASE LAYER                       │
│              PostgreSQL (Primary)                     │
└──────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Web Frontend | React.js | 18.x |
| Mobile App | Flutter | 3.x |
| Backend API | Node.js + Express | 18.x |
| Database | PostgreSQL | 15.x |
| Authentication | JWT + RBAC | - |
| File Storage | Firebase Storage / AWS S3 | - |
| AI Engine | Node.js (Rule-based) | - |
| Future ML | Python (Flask/FastAPI) | - |

---

## 2. DATABASE SCHEMA DESIGN

### 2.1 Core Tables

```
sql
-- =====================================================
-- USER & AUTHENTICATION TABLES
-- =====================================================

-- Users table (base table for all roles)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    roll_no VARCHAR(50),  -- For students
    department VARCHAR(50),
    section VARCHAR(10),
    role VARCHAR(20) NOT NULL CHECK (role IN ('club', 'faculty', 'admin', 'principal', 'student')),
    is_active BOOLEAN DEFAULT TRUE,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Club members (linking users to clubs)
CREATE TABLE club_members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
    position VARCHAR(50),  -- President, Secretary, Treasurer, Member
    is_faculty_incharge BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CLUB MANAGEMENT TABLES
-- =====================================================

CREATE TABLE clubs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    club_type VARCHAR(50),  -- Technical, Cultural, Sports, Social
    logo_url TEXT,
    faculty_incharge_id INTEGER REFERENCES users(id),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ACADEMIC CALENDAR TABLES
-- =====================================================

CREATE TABLE academic_calendar (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN 
        ('semester_start', 'semester_end', 'exam', 'holiday', 'placement', 'cultural', 'sports', 'other')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_blocked_for_events BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- VENUE MANAGEMENT TABLES
-- =====================================================

CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    building VARCHAR(100),
    floor INTEGER,
    capacity INTEGER NOT NULL,
    venue_type VARCHAR(50) CHECK (venue_type IN ('auditorium', 'hall', 'room', 'ground', 'lab', 'other')),
    amenities TEXT[],  -- Array: ['projector', 'sound_system', 'ac', 'stage']
    restrictions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE venue_bookings (
    id SERIAL PRIMARY KEY,
    venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(venue_id, booking_date, start_time, end_time)
);

-- =====================================================
-- LOGISTICS & MANPOWER TABLES
-- =====================================================

CREATE TABLE logistics_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50),  -- 'infrastructure', 'technical', 'electrical', 'other'
    unit_cost DECIMAL(10, 2) NOT NULL,
    available_quantity INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE manpower_types (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),  -- 'technical', 'security', 'housekeeping', 'helper'
    cost_per_hour DECIMAL(10, 2) NOT NULL,
    max_available INTEGER DEFAULT 10
);

CREATE TABLE event_logistics (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    logistics_item_id INTEGER REFERENCES logistics_items(id),
    quantity_required INTEGER NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE TABLE event_manpower (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    manpower_type_id INTEGER REFERENCES manpower_types(id),
    count_required INTEGER NOT NULL,
    hours_required DECIMAL(5, 2),
    cost DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
);

-- =====================================================
-- EVENT MANAGEMENT TABLES (CORE)
-- =====================================================

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    club_id INTEGER REFERENCES clubs(id),
    proposed_by INTEGER REFERENCES users(id),
    
    -- Date & Venue
    proposed_date DATE NOT NULL,
    proposed_start_time TIME NOT NULL,
    proposed_end_time TIME NOT NULL,
    venue_id INTEGER REFERENCES venues(id),
    
    -- Status Tracking
    status VARCHAR(30) DEFAULT 'draft' CHECK (status IN (
        'draft', 'submitted', 'faculty_approved', 'faculty_rejected',
        'admin_approved', 'admin_rejected', 'principal_approved', 'principal_rejected',
        'published', 'completed', 'cancelled'
    )),
    
    -- AI Suggestions
    ai_suggested_dates DATE[],
    ai_suggested_venues INTEGER[],
    ai_confidence_score DECIMAL(5, 2),
    
    -- Budget
    estimated_budget DECIMAL(12, 2),
    approved_budget DECIMAL(12, 2),
    actual_expense DECIMAL(12, 2),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    faculty_approval_at TIMESTAMP,
    admin_approval_at TIMESTAMP,
    principal_approval_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Approval workflow table
CREATE TABLE event_approvals (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    approver_role VARCHAR(20) NOT NULL,
    approver_id INTEGER REFERENCES users(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    comments TEXT,
    approval_order INTEGER NOT NULL,  -- 1: Faculty, 2: Admin, 3: Principal
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PARTICIPANT & REGISTRATION TABLES
-- =====================================================

CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    registration_type VARCHAR(20) DEFAULT 'participant' CHECK (registration_type IN ('participant', 'organizer', 'judge', 'guest')),
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'absent', 'cancelled')),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance_records (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    attendance_status VARCHAR(20) DEFAULT 'present' CHECK (attendance_status IN ('present', 'absent', 'late')),
    marked_by INTEGER REFERENCES users(id),
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CERTIFICATE TABLE
-- =====================================================

CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    certificate_type VARCHAR(50) NOT NULL CHECK (certificate_type IN ('participation', 'winner', 'organizer', 'appreciation')),
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pdf_url TEXT
);

-- =====================================================
-- DOCUMENTS TABLE
-- =====================================================

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('proposal', 'approval_letter', 'bill', 'report', 'photo', 'other')),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    uploaded_by INTEGER REFERENCES users(id),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- REPORTS & ANALYTICS TABLES
-- =====================================================

CREATE TABLE event_reports (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    submitted_by INTEGER REFERENCES users(id),
    summary TEXT,
    outcomes TEXT,
    issues_faced TEXT,
    suggestions TEXT,
    participant_count INTEGER,
    media_urls TEXT[],
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_club ON events(club_id);
CREATE INDEX idx_events_date ON events(proposed_date);
CREATE INDEX idx_venue_bookings ON venue_bookings(venue_id, booking_date);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_registrations_event ON event_registrations(event_id);
```

---

## 3. API STRUCTURE

### 3.1 REST API Endpoints

```
BASE URL: /api/v1

================================================================================
AUTHENTICATION
================================================================================
POST   /auth/register          - Register new user
POST   /auth/login             - Login (returns JWT)
POST   /auth/logout            - Logout
POST   /auth/refresh           - Refresh token
GET    /auth/me                - Get current user profile
PUT    /auth/profile           - Update profile

================================================================================
CLUBS
================================================================================
GET    /clubs                  - List all clubs
POST   /clubs                  - Create new club
GET    /clubs/:id              - Get club details
PUT    /clubs/:id              - Update club
GET    /clubs/:id/members      - Get club members
POST   /clubs/:id/join         - Join club request

================================================================================
EVENTS (Core)
================================================================================
GET    /events                 - List events (filtered by role)
POST   /events                 - Create new event
GET    /events/:id             - Get event details
PUT    /events/:id             - Update event
DELETE /events/:id             - Delete event

POST   /events/:id/submit      - Submit for approval
POST   /events/:id/approve    - Approve event (faculty/admin/principal)
POST   /events/:id/reject      - Reject event

GET    /events/:id/approvals   - Get approval history
GET    /events/:id/logistics   - Get logistics for event
GET    /events/:id/documents   - Get documents for event
POST   /events/:id/documents   - Upload document

================================================================================
AI ASSISTANT
================================================================================
POST   /ai/suggest-date        - AI suggest best dates
POST   /ai/suggest-venue        - AI suggest available venues
POST   /ai/check-conflicts     - Check for conflicts
GET    /ai/academic-calendar   - Get academic calendar
POST   /ai/analyze-budget      - Analyze budget requirements

================================================================================
VENUES
================================================================================
GET    /venues                 - List all venues
POST   /venues                 - Create venue (admin)
GET    /venues/:id             - Get venue details
PUT    /venues/:id             - Update venue
GET    /venues/:id/availability - Check venue availability
POST   /venues/:id/book        - Book venue

================================================================================
LOGISTICS & MANPOWER
================================================================================
GET    /logistics              - List available logistics
GET    /manpower               - List manpower types
POST   /event/:id/logistics    - Add logistics to event
POST   /event/:id/manpower     - Add manpower to event

================================================================================
REGISTRATION & ATTENDANCE
================================================================================
POST   /events/:id/register    - Register for event
GET    /events/:id/registrants - Get registered users
POST   /events/:id/attendance  - Mark attendance
GET    /events/:id/attendance - Get attendance records

================================================================================
CERTIFICATES
================================================================================
POST   /certificates/generate  - Generate certificate
GET    /certificates/:id       - Get certificate details
GET    /certificates/event/:id - Get all certificates for event

================================================================================
REPORTS & ANALYTICS
================================================================================
GET    /analytics/dashboard    - Get role-specific dashboard data
GET    /analytics/events      - Event analytics
GET    /analytics/venues      - Venue utilization
GET    /analytics/budget      - Budget analysis

================================================================================
DOCUMENTS
================================================================================
GET    /documents/:id          - Get document
DELETE /documents/:id          - Delete document
```

### 3.2 Request/Response Examples

```
json
// POST /api/v1/events - Create Event
{
  "title": "Tech Symposium 2024",
  "description": "Annual technical symposium",
  "club_id": 1,
  "proposed_date": "2024-03-15",
  "proposed_start_time": "09:00",
  "proposed_end_time": "17:00",
  "venue_id": 1,
  "estimated_budget": 50000,
  "logistics": [
    {"item_id": 1, "quantity": 50},
    {"item_id": 2, "quantity": 2}
  ],
  "manpower": [
    {"type_id": 1, "count": 5, "hours": 8}
  ]
}

// POST /api/v1/ai/suggest-date - AI Suggest Date
{
  "preferred_date": "2024-03-15",
  "duration_hours": 8,
  "expected_participants": 200,
  "venue_type": "auditorium"
}

// Response:
{
  "suggested_dates": [
    {"date": "2024-03-15", "confidence": 0.85, "reasons": ["No academic conflict"]},
    {"date": "2024-03-18", "confidence": 0.75, "reasons": ["Venue available"]},
    {"date": "2024-03-20", "confidence": 0.60, "reasons": ["Low venue utilization"]}
  ],
  "conflicts": [
    {"type": "academic", "description": "Mid-term exams on March 16-17"}
  ]
}
```

---

## 4. FOLDER STRUCTURE

### 4.1 Backend (Node.js)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   ├── auth.js              # JWT configuration
│   │   └── constants.js         # App constants
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── clubController.js
│   │   ├── eventController.js
│   │   ├── venueController.js
│   │   ├── logisticsController.js
│   │   ├── aiController.js
│   │   ├── analyticsController.js
│   │   └── certificateController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── roleMiddleware.js    # RBAC checks
│   │   ├── validateMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Club.js
│   │   ├── Event.js
│   │   ├── Venue.js
│   │   ├── Logistics.js
│   │   └── index.js             # Sequelize/Prisma models
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── clubRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── venueRoutes.js
│   │   ├── aiRoutes.js
│   │   └── analyticsRoutes.js
│   │
│   ├── services/
│   │   ├── aiService.js         # AI logic (rule-based)
│   │   ├── emailService.js
│   │   ├── notificationService.js
│   │   └── certificateService.js
│   │
│   ├── utils/
│   │   ├── dateUtils.js
│   │   ├── validationUtils.js
│   │   └── responseUtils.js
│   │
│   └── app.js                   # Express app entry
│
├── package.json
├── .env.example
└── README.md
```

### 4.2 Frontend (React)

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   │
│   │   ├── events/
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventForm.jsx
│   │   │   ├── EventList.jsx
│   │   │   └── EventDetails.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── ClubDashboard.jsx
│   │   │   ├── FacultyDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── PrincipalDashboard.jsx
│   │   │
│   │   └── ai/
│   │       ├── AISuggestions.jsx
│   │       └── ConflictAlert.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Events.jsx
│   │   ├── EventDetails.jsx
│   │   ├── CreateEvent.jsx
│   │   ├── Venues.jsx
│   │   ├── Analytics.jsx
│   │   └── Profile.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── EventContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useEvents.js
│   │   └── useAI.js
│   │
│   ├── services/
│   │   ├── api.js               # Axios instance
│   │   ├── authService.js
│   │   ├── eventService.js
│   │   └── aiService.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── validators.js
│   │
│   ├── styles/
│   │   ├── variables.css
│   │   ├── global.css
│   │   └── components.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

### 4.3 Mobile (Flutter)

```
mobile/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   │
│   ├── core/
│   │   ├── constants/
│   │   ├── theme/
│   │   ├── utils/
│   │   └── widgets/
│   │
│   ├── data/
│   │   ├── models/
│   │   ├── repositories/
│   │   └── providers/
│   │
│   ├── services/
│   │   ├── api_service.dart
│   │   ├── auth_service.dart
│   │   └── ai_service.dart
│   │
│   ├── screens/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── events/
│   │   ├── profile/
│   │   └── dashboard/
│   │
│   └── widgets/
│       ├── event_card.dart
│       ├── custom_button.dart
│       └── loading_indicator.dart
│
├── pubspec.yaml
└── firebase_options.dart
```

---

## 5. AI MODULE DESIGN

### 5.1 Rule-Based Engine (Mandatory)

```
javascript
// backend/src/services/aiService.js

class AIService {
    
    // Check for conflicts in proposed date
    async checkDateConflicts(proposedDate, venueId, duration) {
        const conflicts = [];
        
        // 1. Check academic calendar
        const academicEvents = await AcademicCalendar.find({
            start_date: { $lte: proposedDate },
            end_date: { $gte: proposedDate },
            is_blocked_for_events: true
        });
        
        if (academicEvents.length > 0) {
            conflicts.push({
                type: 'academic',
                severity: 'high',
                message: `Academic event: ${academicEvents[0].title}`,
                description: 'Proposed date conflicts with academic calendar'
            });
        }
        
        // 2. Check venue availability
        const venueBookings = await VenueBooking.find({
            venue_id: venueId,
            booking_date: proposedDate,
            status: { $in: ['pending', 'confirmed'] }
        });
        
        if (venueBookings.length > 0) {
            conflicts.push({
                type: 'venue',
                severity: 'high',
                message: 'Venue already booked',
                description: 'Another event is scheduled at this venue'
            });
        }
        
        // 3. Check faculty availability
        const facultyEvents = await Event.find({
            proposed_date: proposedDate,
            status: { $in: ['faculty_approved', 'admin_approved', 'principal_approved'] }
        });
        
        return conflicts;
    }
    
    // Suggest best dates
    async suggestDates(preferences) {
        const suggestions = [];
        const { preferredDate, duration, branch, year } = preferences;
        
        // Generate candidate dates (next 30 days)
        const candidateDates = this.generateCandidateDates(preferredDate, 30);
        
        for (const date of candidateDates) {
            const score = await this.calculateDateScore(date, preferences);
            
            if (score > 0.4) {
                suggestions.push({
                    date: date,
                    confidence: score,
                    reasons: await this.getReasons(date, preferences),
                    venue_suggestions: await this.suggestVenues(date, preferences)
                });
            }
        }
        
        return suggestions.sort((a, b) => b.confidence - a.confidence);
    }
    
    // Calculate confidence score for a date
    async calculateDateScore(date, preferences) {
        let score = 1.0;
        
        // Academic calendar check (weight: 0.3)
        const academicConflict = await this.checkAcademicConflict(date);
        if (academicConflict) score *= 0.1;
        
        // Venue availability check (weight: 0.3)
        const venueAvailable = await this.checkVenueAvailability(date, preferences.venueType);
        if (!venueAvailable) score *= 0.2;
        
        // Historical data check (weight: 0.2)
        const historicalScore = await this.checkHistoricalData(date);
        score *= (0.5 + historicalScore * 0.5);
        
        // Day preference (weight: 0.2)
        const dayScore = this.checkDayPreference(date);
        score *= dayScore;
        
        return Math.min(score, 1.0);
    }
    
    // Check venue availability
    async checkVenueAvailability(date, venueType) {
        const venues = await Venue.find({ 
            venue_type: venueType,
            is_active: true 
        });
        
        for (const venue of venues) {
            const booking = await VenueBooking.findOne({
                venue_id: venue.id,
                booking_date: date,
                status: { $in: ['pending', 'confirmed'] }
            });
            
            if (!booking) return true;
        }
        
        return false;
    }
    
    // Suggest venues
    async suggestVenues(date, preferences) {
        const { capacity, venueType, requiredAmenities } = preferences;
        
        const venues = await Venue.find({
            venue_type: venueType,
            capacity: { $gte: capacity },
            is_active: true
        });
        
        const suggestions = [];
        
        for (const venue of venues) {
            const isAvailable = await this.checkSpecificVenueAvailability(venue.id, date);
            const amenityMatch = this.checkAmenities(venue.amenities, requiredAmenities);
            
            if (isAvailable) {
                suggestions.push({
                    venue: venue,
                    availability_score: amenityMatch ? 0.9 : 0.7,
                    reason: amenityMatch ? 'All amenities available' : 'Partial amenities'
                });
            }
        }
        
        return suggestions;
    }
    
    // Analyze budget
    async analyzeBudget(eventDetails) {
        const { logistics, manpower, participantCount } = eventDetails;
        
        let totalCost = 0;
        const breakdown = [];
        
        // Calculate logistics cost
        for (const item of logistics) {
            const itemDetails = await LogisticsItem.findById(item.item_id);
            const cost = itemDetails.unit_cost * item.quantity;
            totalCost += cost;
            breakdown.push({
                item: itemDetails.name,
                quantity: item.quantity,
                unit_cost: itemDetails.unit_cost,
                total: cost
            });
        }
        
        // Calculate manpower cost
        for (const staff of manpower) {
            const staffDetails = await ManpowerType.findById(staff.type_id);
            const cost = staffDetails.cost_per_hour * staff.hours;
            totalCost += cost;
            breakdown.push({
                item: staffDetails.role_name,
                hours: staff.hours,
                rate: staffDetails.cost_per_hour,
                total: cost
            });
        }
        
        // Add contingency (10%)
        const contingency = totalCost * 0.1;
        totalCost += contingency;
        
        return {
            estimated_total: totalCost,
            contingency: contingency,
            breakdown: breakdown,
            per_participant_cost: totalCost / participantCount
        };
    }
}

module.exports = new AIService();
```

### 5.2 ML Extension (Future Scope)

```
python
# Future: Python ML Service (Flask/FastAPI)

from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

app = Flask(__name__)

# Load trained model (trained on historical event data)
model = joblib.load('event_success_model.pkl')
le = LabelEncoder()

@app.route('/api/v1/ml/predict-attendance', methods=['POST'])
def predict_attendance():
    """
    Predict expected attendance based on:
    - Event type
    - Day of week
    - Time of year
    - Club reputation score
    - Historical data
    """
    data = request.json
    
    features = pd.DataFrame([{
        'event_type_encoded': le.fit_transform([data['event_type']])[0],
        'day_of_week': pd.to_datetime(data['date']).dayofweek,
        'month': pd.to_datetime(data['date']).month,
        'club_reputation': data.get('club_score', 0.5),
        'is_holiday_nearby': check_nearby_holidays(data['date']),
        'previous_year_attendance': data.get('historical_attendance', 0)
    }])
    
    prediction = model.predict(features)
    
    return jsonify({
        'predicted_attendance': int(prediction[0]),
        'confidence_interval': [int(prediction[0] * 0.8), int(prediction[0] * 1.2)]
    })

@app.route('/api/v1/ml/venue-utilization', methods=['GET'])
def analyze_venue_utilization():
    """
    Analyze venue utilization patterns
    """
    # Analysis logic here
    pass

@app.route('/api/v1/ml/event-success-score', methods=['POST'])
def event_success_score():
    """
    Rank dates by probability of event success
    """
    # ML prediction logic here
    pass

if __name__ == '__main__':
    app.run(port=5000)
```

---

## 6. ROLE-BASED ACCESS CONTROL (RBAC)

### 6.1 Permission Matrix

| Feature | Club | Faculty | Admin | Principal | Student |
|---------|------|---------|-------|-----------|---------|
| Create Event | ✓ | - | ✓ | - | - |
| Edit Own Event | ✓ | - | ✓ | - | - |
| Delete Draft | ✓ | - | ✓ | - | - |
| Submit for Approval | ✓ | - | ✓ | - | - |
| View All Events | - | ✓ | ✓ | ✓ | - |
| Approve (Faculty) | - | ✓ | - | - | - |
| Approve (Admin) | - | - | ✓ | - | - |
| Approve (Principal) | - | - | - | ✓ | - |
| Manage Venues | - | - | ✓ | - | - |
| Manage Logistics | - | - | ✓ | - | - |
| Register for Event | - | - | - | - | ✓ |
| View Analytics | Limited | ✓ | ✓ | Full | - |
| Generate Certificates | ✓ | ✓ | ✓ | - | - |
| Upload Documents | ✓ | ✓ | ✓ | - | - |

---

## 7. SECURITY IMPLEMENTATION

### 7.1 Authentication Flow

```
1. User Login
   │
   ▼
2. Validate credentials against database
   │
   ▼
3. Generate JWT tokens (access + refresh)
   │
   ▼
4. Store tokens securely (httpOnly cookies)
   │
   ▼
5. Include access token in API requests
   │
   ▼
6. Verify token on each protected route
   │
   ▼
7. Check role permissions
```

### 7.2 Security Best Practices

```
javascript
// Backend Security Middleware
const securityMiddleware = {
    // Rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    },
    
    // CORS configuration
    cors: {
        origin: process.env.ALLOWED_ORIGINS.split(','),
        credentials: true
    },
    
    // Helmet for security headers
    helmet: {
        contentSecurityPolicy: true,
        crossOriginEmbedderPolicy: true
    },
    
    // Input sanitization
    sanitize: {
        escape: true,
        trim: true,
        stripLow: true
    }
};

// Password hashing
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
};

// JWT token generation
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
};
```

---

## 8. EVENT WORKFLOW STATE MACHINE

```
┌─────────┐
│  DRAFT  │ (Club creates event)
└────┬────┘
     │ submit
     ▼
┌─────────────┐
│  SUBMITTED  │ (Waiting for Faculty)
└────┬────────┘
     │ faculty approve
     ▼
┌───────────────────┐     │ faculty reject
│ FACULTY_APPROVED  │◄───┘
└────┬──────────────┘
     │ admin approve
     ▼
┌─────────────────┐     │ admin reject
│  ADMIN_APPROVED │◄────┘
└────┬────────────┘
     │ principal approve
     ▼
┌─────────────────────┐     │ principal reject
│ PRINCIPAL_APPROVED │◄────┘
└────┬────────────────┘
     │ publish
     ▼
┌───────────┐
│ PUBLISHED │ (Open for registration)
└────┬──────┘
     │ complete
     ▼
┌──────────┐
│COMPLETED │
└──────────┘
```

---

## 9. DEVELOPMENT ROADMAP

### Phase 1: Foundation (Weeks 1-2)
- [ ] Setup Node.js + Express backend
- [ ] Configure PostgreSQL database
- [ ] Implement authentication (JWT)
- [ ] Create basic user CRUD
- [ ] Setup React frontend project

### Phase 2: Core Features (Weeks 3-4)
- [ ] Event CRUD operations
- [ ] Role-based dashboards
- [ ] Basic approval workflow
- [ ] Venue management
- [ ] Login/Signup pages

### Phase 3: AI Integration (Weeks 5-6)
- [ ] Rule-based AI engine
- [ ] Date conflict detection
- [ ] Venue suggestion system
- [ ] Budget auto-calculation

### Phase 4: Advanced Features (Weeks 7-8)
- [ ] Document upload system
- [ ] Registration module
- [ ] Attendance tracking
- [ ] Certificate generation

### Phase 5: Mobile & Analytics (Weeks 9-10)
- [ ] Flutter mobile app
- [ ] Analytics dashboards
- [ ] Reporting system

### Phase 6: Testing & Deployment (Weeks 11-12)
- [ ] Unit & integration testing
- [ ] Security audit
- [ ] Deployment (Vercel/Render + Railway)

---

## 10. VIVA-READY EXPLANATIONS

### Q: How does the AI conflict detection work?
**A:** The system checks three levels:
1. **Academic Calendar** - Queries the academic_calendar table for blocked dates (exams, holidays)
2. **Venue Booking** - Checks venue_bookings table for existing confirmed/pending bookings
3. **Staff Availability** - Verifies if required manpower is available on the proposed date

### Q: How do you prevent double booking?
**A:** We use a database-level UNIQUE constraint on (venue_id, booking_date, start_time, end_time). Additionally, the application checks availability before allowing any booking.

### Q: How does the approval workflow ensure accountability?
**A:** Each approval creates a record in the event_approvals table with:
- Approver ID (who approved)
- Timestamp (when approved)
- Comments (reason for decision)
- Status (approved/rejected)
This creates a complete audit trail.

### Q: How is the budget auto-calculated?
**A:** The system maintains a logistics_items table with unit costs and a manpower_types table with hourly rates. When an event submits logistics/manpower requirements, it multiplies quantities by unit costs and sums them up.

---

## 11. QUICK START COMMANDS

```
bash
# Backend Setup
cd backend
npm init -y
npm install express pg sequelize cors helmet dotenv bcryptjs jsonwebtoken express-validator multer
npm install -D nodemon

# Database
# Install PostgreSQL and run migrations in database/migrations/

# Frontend Setup
cd frontend
npm create vite@latest . -- --template react
npm install axios react-router-dom react-hook-form chart.js react-hot-toast
npm install -D tailwindcss postcss autoprefixer

# Run Development
# Backend: npm run dev (port 5000)
# Frontend: npm run dev (port 5173)

# Environment Variables (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/eventdb
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

---

## Document Version
- **Version:** 1.0
- **Last Updated:** 2024
- **Author:** System Architect
- **Status:** Ready for Implementation
