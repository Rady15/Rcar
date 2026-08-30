-- ==========================================================
-- AL-RUFQAH CAR RENTAL (مجموعة الرفقة لتأجير السيارات)
-- PRODUCTION POSTGRESQL DATABASE SCHEMA (v2.0)
-- Target: PostgreSQL 14+ / Supabase / Cloud SQL / RDS
-- ==========================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'staff', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE car_status AS ENUM ('available', 'rented', 'maintenance', 'reserved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE car_category AS ENUM ('economy', 'compact', 'sedan', 'suv', 'luxury', 'family', 'commercial', 'electric');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('confirmed', 'active', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE roadside_status AS ENUM ('pending', 'dispatched', 'in_progress', 'resolved', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE roadside_priority AS ENUM ('normal', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Branches Table (الفروع ومكاتب المطارات)
CREATE TABLE IF NOT EXISTS branches (
    id VARCHAR(64) PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    city_ar VARCHAR(100) NOT NULL,
    city_en VARCHAR(100) NOT NULL,
    branch_type VARCHAR(50) NOT NULL DEFAULT 'downtown', -- 'airport', 'downtown', 'express'
    terminal VARCHAR(50),
    address_ar TEXT NOT NULL,
    address_en TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    working_hours_ar VARCHAR(100) NOT NULL,
    working_hours_en VARCHAR(100) NOT NULL,
    is_24_hours BOOLEAN NOT NULL DEFAULT true,
    has_self_service_kiosk BOOLEAN NOT NULL DEFAULT true,
    has_vip_lounge BOOLEAN NOT NULL DEFAULT false,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.9,
    google_map_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table (المستخدمون، الموظفون، الإدارة)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(50) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    id_type VARCHAR(50) NOT NULL DEFAULT 'national_id',
    id_number VARCHAR(50) NOT NULL,
    nationality VARCHAR(100) NOT NULL DEFAULT 'سعودي',
    license_number VARCHAR(50) NOT NULL,
    loyalty_tier VARCHAR(50) NOT NULL DEFAULT 'silver',
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    avatar_url TEXT,
    branch_id VARCHAR(64) REFERENCES branches(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    total_rentals_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Vehicles Fleet Table (أسطول السيارات)
CREATE TABLE IF NOT EXISTS cars (
    id VARCHAR(64) PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model_year INTEGER NOT NULL,
    category car_category NOT NULL,
    plate_number VARCHAR(50) UNIQUE NOT NULL,
    image_url TEXT NOT NULL,
    daily_price NUMERIC(10, 2) NOT NULL,
    weekly_price NUMERIC(10, 2) NOT NULL,
    monthly_price NUMERIC(10, 2) NOT NULL,
    seats INTEGER NOT NULL DEFAULT 5,
    luggage INTEGER NOT NULL DEFAULT 2,
    doors INTEGER NOT NULL DEFAULT 4,
    transmission VARCHAR(20) NOT NULL DEFAULT 'auto',
    fuel_type VARCHAR(20) NOT NULL DEFAULT 'petrol',
    engine_capacity VARCHAR(50) NOT NULL,
    features_ar TEXT[] DEFAULT '{}',
    features_en TEXT[] DEFAULT '{}',
    is_popular BOOLEAN DEFAULT false,
    is_special_offer BOOLEAN DEFAULT false,
    discount_percentage INTEGER DEFAULT 0,
    available_quantity INTEGER NOT NULL DEFAULT 1,
    min_driver_age INTEGER NOT NULL DEFAULT 21,
    deposit_required NUMERIC(10, 2) NOT NULL DEFAULT 0,
    included_mileage_per_day INTEGER NOT NULL DEFAULT 300,
    status car_status NOT NULL DEFAULT 'available',
    current_branch_id VARCHAR(64) REFERENCES branches(id) ON DELETE SET NULL,
    current_odometer INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Protection Plans (باقات الحماية والتأمين)
CREATE TABLE IF NOT EXISTS protection_plans (
    id VARCHAR(64) PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    price_per_day NUMERIC(10, 2) NOT NULL DEFAULT 0,
    deductible NUMERIC(10, 2) NOT NULL DEFAULT 0,
    features_ar TEXT[] DEFAULT '{}',
    features_en TEXT[] DEFAULT '{}',
    is_recommended BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bookings & Contracts Table (الحجوزات والعقود الإلكترونية)
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY, -- e.g. RUF-89241
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    car_id VARCHAR(64) NOT NULL REFERENCES cars(id) ON DELETE RESTRICT,
    pickup_branch_id VARCHAR(64) NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    return_branch_id VARCHAR(64) NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    pickup_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    return_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    number_of_days INTEGER NOT NULL,
    protection_plan_id VARCHAR(64) REFERENCES protection_plans(id),
    selected_addons JSONB DEFAULT '{}',
    customer_info JSONB NOT NULL,
    payment_info JSONB NOT NULL,
    status booking_status NOT NULL DEFAULT 'confirmed',
    tamm_authorized BOOLEAN NOT NULL DEFAULT false,
    tamm_authorization_number VARCHAR(100),
    pickup_inspected BOOLEAN NOT NULL DEFAULT false,
    return_inspected BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Vehicle Inspection Reports (محاضر فحص واستلام وتسليم السيارات)
CREATE TABLE IF NOT EXISTS inspection_reports (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    car_id VARCHAR(64) NOT NULL REFERENCES cars(id) ON DELETE RESTRICT,
    inspection_type VARCHAR(20) NOT NULL, -- 'pickup' or 'return'
    inspector_name VARCHAR(255) NOT NULL,
    inspection_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    odometer INTEGER NOT NULL,
    fuel_level VARCHAR(20) NOT NULL, -- '1/4', '2/4', '3/4', '4/4', 'full'
    cleanliness VARCHAR(20) NOT NULL DEFAULT 'clean',
    tires_condition VARCHAR(20) NOT NULL DEFAULT 'good',
    ac_working BOOLEAN NOT NULL DEFAULT true,
    spare_tire_present BOOLEAN NOT NULL DEFAULT true,
    scratches_or_dents TEXT[] DEFAULT '{}',
    signature_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Roadside Emergency Assistance Tickets (بلاغات المساعدة وطوارئ الطريق)
CREATE TABLE IF NOT EXISTS roadside_tickets (
    id VARCHAR(64) PRIMARY KEY,
    ticket_number VARCHAR(64) UNIQUE NOT NULL,
    caller_name VARCHAR(255) NOT NULL,
    caller_phone VARCHAR(50) NOT NULL,
    car_model VARCHAR(100) NOT NULL,
    plate_number VARCHAR(50) NOT NULL,
    issue_type VARCHAR(50) NOT NULL, -- 'flat_tyre', 'battery', 'towing', 'fuel', 'accident', 'lockout'
    city VARCHAR(100) NOT NULL,
    location_description TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    status roadside_status NOT NULL DEFAULT 'pending',
    priority roadside_priority NOT NULL DEFAULT 'normal',
    assigned_unit VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 8. Blog & Automotive News Table (المدونة والمقالات)
CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title_ar VARCHAR(500) NOT NULL,
    title_en VARCHAR(500) NOT NULL,
    excerpt_ar TEXT NOT NULL,
    excerpt_en TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'guides',
    cover_image TEXT NOT NULL,
    author_name_ar VARCHAR(255) NOT NULL,
    author_name_en VARCHAR(255) NOT NULL,
    author_role_ar VARCHAR(255),
    author_role_en VARCHAR(255),
    author_avatar TEXT,
    read_time_minutes INTEGER NOT NULL DEFAULT 5,
    likes INTEGER NOT NULL DEFAULT 0,
    views INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Corporate RFPs & Fleet Leasing Inquiries (طلبات الشركات)
CREATE TABLE IF NOT EXISTS corporate_inquiries (
    id VARCHAR(64) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    fleet_size VARCHAR(100) NOT NULL,
    rental_duration VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'new', -- 'new', 'in_review', 'proposal_sent', 'contract_signed', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Promo Codes & Offers Table (أكواد الخصم والعروض الترويجية)
CREATE TABLE IF NOT EXISTS promo_codes (
    code VARCHAR(50) PRIMARY KEY,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    discount_percentage INTEGER NOT NULL,
    valid_until DATE NOT NULL,
    max_usages INTEGER DEFAULT 1000,
    usage_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. System Audit Logs (سجل العمليات الإدارية)
CREATE TABLE IF NOT EXISTS system_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Ultra Fast Query Execution
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_category ON cars(category);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_roadside_status ON roadside_tickets(status);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(is_published, published_at);
