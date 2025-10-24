-- Create user_favorites table for storing user's favorite meetups and events
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
    item_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('meetup', 'event')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id, type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_item_id ON user_favorites(item_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_type ON user_favorites(type);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own favorites
CREATE POLICY "Users can view their own favorites" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own favorites
CREATE POLICY "Users can insert their own favorites" ON user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" ON user_favorites
    FOR DELETE USING (auth.uid() = user_id);
