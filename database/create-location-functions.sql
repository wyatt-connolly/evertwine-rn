-- Create PostGIS functions for location-based queries
-- These functions provide efficient distance-based queries for meetups and events

-- Function to get nearby meetups using PostGIS
CREATE OR REPLACE FUNCTION get_nearby_meetups(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_km INTEGER DEFAULT 10,
    result_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    creator_id UUID,
    location JSONB,
    location_name TEXT,
    address TEXT,
    time TIMESTAMP WITH TIME ZONE,
    duration INTEGER,
    timezone TEXT,
    activity TEXT,
    activity_category TEXT,
    tags TEXT[],
    max_participants INTEGER,
    current_participants INTEGER,
    participants TEXT[],
    waitlist TEXT[],
    declined_users TEXT[],
    status TEXT,
    is_recurring BOOLEAN,
    recurring_pattern TEXT,
    requirements JSONB,
    cover_image TEXT,
    images TEXT[],
    views INTEGER,
    join_requests INTEGER,
    completion_rate DOUBLE PRECISION,
    engagement_score DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    distance_km DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.*,
        ST_Distance(
            ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')'),
            ST_GeogFromText('POINT(' || (m.location->>'longitude') || ' ' || (m.location->>'latitude') || ')')
        ) / 1000 AS distance_km
    FROM meetups m
    WHERE 
        m.location IS NOT NULL
        AND m.location->>'latitude' IS NOT NULL
        AND m.location->>'longitude' IS NOT NULL
        AND ST_DWithin(
            ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')'),
            ST_GeogFromText('POINT(' || (m.location->>'longitude') || ' ' || (m.location->>'latitude') || ')'),
            radius_km * 1000
        )
    ORDER BY distance_km ASC
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get nearby events using PostGIS
CREATE OR REPLACE FUNCTION get_nearby_events(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_km INTEGER DEFAULT 10,
    result_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    organizer_id UUID,
    organizer_name TEXT,
    organizer_avatar TEXT,
    venue TEXT,
    venue_type TEXT,
    location JSONB,
    location_name TEXT,
    address TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    timezone TEXT,
    category TEXT,
    subcategory TEXT,
    tags TEXT[],
    price DOUBLE PRECISION,
    currency TEXT,
    max_attendees INTEGER,
    current_attendees INTEGER,
    cover_image TEXT,
    images TEXT[],
    video_url TEXT,
    status TEXT,
    is_recurring BOOLEAN,
    recurring_pattern TEXT,
    features JSONB,
    views INTEGER,
    shares INTEGER,
    likes INTEGER,
    attendees TEXT[],
    waitlist TEXT[],
    interested_users TEXT[],
    check_ins TEXT[],
    whos_going TEXT[],
    discount TEXT,
    discount_percentage DOUBLE PRECISION,
    deal_time_window TEXT,
    special_menu_items TEXT[],
    deal_highlights TEXT[],
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    distance_km DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.*,
        ST_Distance(
            ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')'),
            ST_GeogFromText('POINT(' || (h.location->>'longitude') || ' ' || (h.location->>'latitude') || ')')
        ) / 1000 AS distance_km
    FROM happy_hours h
    WHERE 
        h.location IS NOT NULL
        AND h.location->>'latitude' IS NOT NULL
        AND h.location->>'longitude' IS NOT NULL
        AND ST_DWithin(
            ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')'),
            ST_GeogFromText('POINT(' || (h.location->>'longitude') || ' ' || (h.location->>'latitude') || ')'),
            radius_km * 1000
        )
    ORDER BY distance_km ASC
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for location-based queries
CREATE INDEX IF NOT EXISTS idx_meetups_location_gist ON meetups USING GIST (
    ST_GeogFromText('POINT(' || (location->>'longitude') || ' ' || (location->>'latitude') || ')')
) WHERE location IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_happy_hours_location_gist ON happy_hours USING GIST (
    ST_GeogFromText('POINT(' || (location->>'longitude') || ' ' || (location->>'latitude') || ')')
) WHERE location IS NOT NULL;
