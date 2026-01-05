-- ============================================================================
-- SPYAJ Marketing Database Schema
-- PostgreSQL (Supabase) Database Setup
-- ============================================================================
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Paste this entire file and run it
-- 4. The default admin credentials are:
--    Email: admin@spyaj.com
--    Password: Admin@123 (CHANGE THIS AFTER FIRST LOGIN!)
--
-- ============================================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ADMIN USERS (Authentication)
-- ============================================================================
-- Stores admin user accounts for CMS access
-- Only admins can manage products, categories, and content

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create default admin account
-- Password: Admin@123 (bcrypt hash)
-- IMPORTANT: Change this password immediately after first login!
INSERT INTO admin_users (email, password_hash, name, role) VALUES
('admin@spyaj.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4uSi6YSJSBu6aGge', 'SPYAJ Admin', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 2. CATEGORIES
-- ============================================================================
-- Product categories for organizing the catalog

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories from existing data
INSERT INTO categories (name, slug, description) VALUES
('Industrial', 'industrial', 'Industrial equipment and machinery'),
('Electronics', 'electronics', 'Electronic components and devices'),
('Fashion', 'fashion', 'Fashion and apparel products'),
('Raw Materials', 'raw-materials', 'Raw materials and supplies'),
('Health & Beauty', 'health-beauty', 'Health and beauty products'),
('Chemicals', 'chemicals', 'Chemical products and compounds'),
('Machinery', 'machinery', 'Heavy machinery and equipment'),
('Construction', 'construction', 'Construction materials and tools'),
('Agriculture', 'agriculture', 'Agricultural products and equipment'),
('Textiles', 'textiles', 'Textile materials and fabrics'),
('Apparel & Fashion', 'apparel-fashion', 'Clothing and fashion accessories'),
('Hospital & Medical', 'hospital-medical', 'Medical equipment and supplies'),
('Gifts & Crafts', 'gifts-crafts', 'Gift items and handicrafts'),
('Packaging & Paper', 'packaging-paper', 'Packaging materials and paper products'),
('Home Supplies', 'home-supplies', 'Home and household supplies'),
('Mineral & Metals', 'mineral-metals', 'Minerals and metal products'),
('Pipes, Tubes & Fittings', 'pipes-tubes-fittings', 'Pipes, tubes and fittings')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. SELLERS (Admin-managed, no public registration)
-- ============================================================================
-- Seller/supplier profiles - managed only by admin

CREATE TABLE IF NOT EXISTS sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    tier VARCHAR(20) DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    is_verified BOOLEAN DEFAULT false,
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    response_rate VARCHAR(10),
    response_time VARCHAR(50),
    delivery_success VARCHAR(10),
    location VARCHAR(200),
    joined_year INT,
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    certifications TEXT[],
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample sellers from existing data
INSERT INTO sellers (slug, name, description, tier, is_verified, rating, response_rate, response_time, delivery_success, location, joined_year, certifications) VALUES
('global-metals-co', 'Global Metals Co.', 'Premier supplier of high-grade industrial steel and components, serving clients worldwide since 2010.', 'Gold', true, 4.8, '98%', '< 2 hours', '99.5%', 'Pune, Maharashtra', 2010, ARRAY['ISO 9001:2015', 'Export House Status', 'Green Mfg']),
('metro-steel-works', 'Metro Steel Works', 'Specializes in seamless pipes, tubes, and custom fittings for the construction and energy sectors.', 'Silver', true, 4.6, '95%', '< 4 hours', '98%', 'Mumbai, Maharashtra', 2015, ARRAY['ISO 9001']),
('textile-hub', 'Textile Hub', 'Leading manufacturer and exporter of premium cotton yarns and synthetic fabrics.', 'Gold', true, 4.9, '99%', '< 30 mins', '99.9%', 'Surat, Gujarat', 2012, ARRAY['GOTS Certified', 'OEKO-TEX']),
('ecoenergy-systems', 'EcoEnergy Systems', 'Sustainable energy solutions provider specializing in solar panels and inverters.', 'Bronze', true, 4.5, '90%', '< 6 hours', '97%', 'Bangalore, Karnataka', 2019, ARRAY['Solar Keymark'])
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 4. PRODUCTS
-- ============================================================================
-- Product catalog - managed only by admin

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Pricing (flexible format for B2B: "₹1,25,000", "₹450/m", "₹85/kg")
    price VARCHAR(50) NOT NULL,
    price_numeric DECIMAL(15,2), -- For sorting/filtering
    currency VARCHAR(10) DEFAULT 'INR',
    unit VARCHAR(50), -- 'piece', 'kg', 'meter', 'set', etc.
    min_order_qty INT DEFAULT 1,
    
    -- Relations
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES sellers(id) ON DELETE SET NULL,
    
    -- Images (JSON array: [{"url": "...", "alt": "..."}])
    images JSONB DEFAULT '[]',
    
    -- Stats
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INT DEFAULT 0,
    orders_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    
    -- Display options
    badge VARCHAR(50), -- 'Best Seller', 'Trending', 'New', 'Top Rated', etc.
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- ============================================================================
-- 5. CONTACT FORM SUBMISSIONS
-- ============================================================================
-- Stores all contact form submissions for admin review

CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contact info
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(200),
    
    -- Message
    subject VARCHAR(100),
    message TEXT NOT NULL,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'resolved', 'spam')),
    assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    admin_notes TEXT,
    
    -- Metadata for security/analytics
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    
    -- Email notification status
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);

-- ============================================================================
-- 6. QUOTE REQUESTS (RFQ)
-- ============================================================================
-- Stores all quote/RFQ requests from users

CREATE TABLE IF NOT EXISTS quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contact info
    contact_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(200),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Request details
    product_name VARCHAR(300) NOT NULL,
    category VARCHAR(100),
    quantity VARCHAR(100),
    target_budget VARCHAR(100),
    requirements TEXT,
    delivery_location VARCHAR(200),
    
    -- Attachments (JSON array of file URLs)
    attachments JSONB DEFAULT '[]',
    
    -- Product reference (if quote requested from product page)
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'quoted', 'accepted', 'rejected', 'expired')),
    assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    admin_notes TEXT,
    
    -- Quote response
    quoted_price VARCHAR(100),
    quoted_at TIMESTAMP WITH TIME ZONE,
    quote_valid_until TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    source VARCHAR(50), -- 'product_page', 'rfq_page', 'landing_page', 'get_quote'
    
    -- Email notification status
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_created ON quote_requests(created_at DESC);

-- ============================================================================
-- 7. SITE CONTENT (CMS)
-- ============================================================================
-- Editable content for landing pages and site-wide text/images

CREATE TABLE IF NOT EXISTS site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Unique identifier for this content piece
    key VARCHAR(100) UNIQUE NOT NULL,
    
    -- Content type and value
    content_type VARCHAR(20) DEFAULT 'text' CHECK (content_type IN ('text', 'html', 'image', 'json')),
    value TEXT NOT NULL,
    
    -- Organization
    page VARCHAR(100), -- Which page this belongs to
    section VARCHAR(100), -- Which section of the page
    
    -- Admin help
    description VARCHAR(500), -- What this content is for
    
    -- Tracking
    updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default editable content
INSERT INTO site_content (key, content_type, value, page, section, description) VALUES
('hero_title', 'text', 'Connect. Trade. Grow.', 'landing', 'hero', 'Main hero section title'),
('hero_subtitle', 'text', 'India''s Most Trusted B2B Marketplace', 'landing', 'hero', 'Hero section subtitle'),
('hero_cta_primary', 'text', 'Explore Products', 'landing', 'hero', 'Primary CTA button text'),
('hero_cta_secondary', 'text', 'Get a Quote', 'landing', 'hero', 'Secondary CTA button text'),
('about_title', 'text', 'About SPYAJ Marketing', 'about', 'main', 'About page title'),
('about_description', 'html', '<p>SPYAJ Marketing is India''s premier B2B marketplace connecting buyers with verified suppliers across industries.</p>', 'about', 'main', 'About page main content'),
('contact_email', 'text', 'support@spyaj.com', 'global', 'contact', 'Support email address'),
('contact_phone', 'text', '+91 (123) 456-7890', 'global', 'contact', 'Support phone number'),
('contact_address', 'text', '123 Business, Industrial Zone, Pune, Maharashtra, India - 364001', 'global', 'contact', 'Company address'),
('footer_tagline', 'text', 'Your trusted partner in B2B trade', 'global', 'footer', 'Footer tagline')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- 8. AUDIT LOGS
-- ============================================================================
-- Track all admin actions for security and accountability

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    admin_email VARCHAR(255),
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout', etc.
    entity_type VARCHAR(50), -- 'product', 'category', 'quote', 'contact', etc.
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- ============================================================================
-- 9. EMAIL LOGS
-- ============================================================================
-- Track all outgoing emails for debugging

CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    template VARCHAR(100),
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
    related_entity_type VARCHAR(50), -- 'contact', 'quote'
    related_entity_id UUID,
    error_message TEXT,
    smtp_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_created ON email_logs(created_at DESC);

-- ============================================================================
-- 10. SESSIONS (for NextAuth)
-- ============================================================================
-- Store admin sessions

CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON admin_sessions(user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sellers_updated_at ON sellers;
CREATE TRIGGER update_sellers_updated_at 
    BEFORE UPDATE ON sellers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at 
    BEFORE UPDATE ON contact_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_quote_requests_updated_at ON quote_requests;
CREATE TRIGGER update_quote_requests_updated_at 
    BEFORE UPDATE ON quote_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at 
    BEFORE UPDATE ON site_content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR DASHBOARD
-- ============================================================================

-- Dashboard statistics view
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
    (SELECT COUNT(*) FROM categories WHERE is_active = true) as total_categories,
    (SELECT COUNT(*) FROM sellers WHERE is_active = true) as total_sellers,
    (SELECT COUNT(*) FROM contact_submissions WHERE status = 'new') as new_contacts,
    (SELECT COUNT(*) FROM quote_requests WHERE status = 'open') as open_quotes,
    (SELECT COUNT(*) FROM quote_requests WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as quotes_this_week,
    (SELECT COUNT(*) FROM contact_submissions WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as contacts_this_week;

-- Recent activity view
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
    'quote' as type,
    id,
    contact_name as title,
    product_name as subtitle,
    status,
    created_at
FROM quote_requests
UNION ALL
SELECT 
    'contact' as type,
    id,
    name as title,
    subject as subtitle,
    status,
    created_at
FROM contact_submissions
ORDER BY created_at DESC
LIMIT 20;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Supabase specific
-- ============================================================================
-- Enable RLS on sensitive tables
-- Note: API access will use service role key which bypasses RLS

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Products, categories, sellers are public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active categories" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active sellers" ON sellers
    FOR SELECT USING (is_active = true);

-- Contact and quotes - no public read, only insert
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert contacts" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert quotes" ON quote_requests
    FOR INSERT WITH CHECK (true);

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- 
-- After running this script:
-- 1. Copy your DATABASE_URL from Supabase (Settings > Database > Connection string)
-- 2. Add it to your .env file
-- 3. Run: npx prisma generate
-- 4. Run: npx prisma db pull (to sync Prisma schema)
--
-- Default admin login:
--   Email: admin@spyaj.com
--   Password: Admin@123
--
-- IMPORTANT: Change the admin password after first login!
-- ============================================================================
