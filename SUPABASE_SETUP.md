# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Evertwine app.

## Prerequisites

- Node.js and npm installed
- Expo CLI installed
- A Supabase account (sign up at https://supabase.com)

## Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in the project details:
   - Name: `evertwine` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the region closest to your users
4. Click "Create New Project"
5. Wait for the project to be provisioned (this takes a few minutes)

## Step 2: Get Your Project Credentials

1. Once your project is created, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL**: This is your `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public**: This is your `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root of the project (if it doesn't exist)
2. Add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit the `.env` file to version control. It's already in `.gitignore`.

## Step 4: Set Up Database Schema

### 🚀 Quick Setup (Recommended)

**Use this if you want a completely fresh database:**

1. Go to your Supabase dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the **entire contents** of **`supabase-fresh-setup.sql`** from the project root
5. Paste it into the SQL editor
6. Click **Run**

✅ This single script will:

- Drop any existing tables (if they exist)
- Create all tables fresh
- Enable Row Level Security
- Create all policies
- Create all indexes
- Show you a success message with next steps

⚠️ **WARNING**: This will delete all existing data in these tables!

**The script includes:**

- 8 database tables (users, posts, meetups, happy_hours, etc.)
- Row Level Security policies for data protection
- Performance indexes
- Proper foreign key relationships

## Step 5: Enable Phone Authentication (Optional)

If you want to use phone authentication:

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Click on **Phone**
3. Enable phone authentication
4. Configure your phone provider (Twilio is recommended):
   - Sign up for a Twilio account
   - Get your Twilio Account SID and Auth Token
   - Get a Twilio phone number
   - Add these credentials to Supabase
5. Save the configuration

## Step 6: Create Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Click **New Bucket**
3. Create the following buckets (all public):
   - `profile-pictures`
   - `post-images`
   - `meetup-images`
   - `happy-hour-images`

For each bucket:

- Name: (use the names above)
- Public bucket: **checked** ✓
- Click **Create Bucket**

### Set Bucket Policies

For each bucket, you need to set up policies:

1. Click on the bucket name
2. Go to **Policies** tab
3. Click **New Policy**
4. Select **For full customization** > **Create Policy**
5. Add the following policies:

**Upload Policy:**

```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bucket-name-here');
```

**Download Policy (for public buckets):**

```sql
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bucket-name-here');
```

Replace `'bucket-name-here'` with the actual bucket name.

## Step 7: Install Dependencies

Run the following command to install all dependencies:

```bash
npm install
```

## Step 8: Start the App

```bash
npm start
```

## Database Schema Overview

The following tables are created:

### Core Tables

- **users**: User profiles and authentication data
- **posts**: User posts and updates
- **post_comments**: Comments on posts
- **meetups**: Community meetups and events
- **happy_hours**: Happy hour events at venues
- **message_rooms**: Chat rooms for direct and group messaging
- **messages**: Individual messages in rooms
- **notifications**: User notifications

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- Users can view all public data
- Users can only modify their own data
- Messages are only visible to participants
- Notifications are only visible to recipients

## Testing the Setup

1. Run the app: `npm start`
2. Try signing up with email or phone
3. Complete the onboarding process
4. Test creating a post or meetup
5. Check that data appears in your Supabase dashboard

## Troubleshooting

### Authentication Issues

- **"Invalid API key"**: Check that your `.env` file has the correct credentials
- **Phone authentication not working**: Verify Twilio is configured correctly
- **Session not persisting**: Clear app data and async storage

### Database Issues

- **"relation does not exist"**: Make sure you ran the `supabase-schema.sql` script
- **"permission denied"**: Check your RLS policies are set up correctly
- **"invalid input syntax for type uuid"**: Ensure you're using valid UUIDs

### Storage Issues

- **"Bucket not found"**: Verify you created all storage buckets
- **Upload fails**: Check bucket policies allow authenticated uploads
- **Images not loading**: Verify buckets are set to public

## API Documentation

### Authentication Service (`SupabaseAuthService`)

```typescript
// Sign in with phone
SupabaseAuthService.signInWithPhone(phoneNumber);
SupabaseAuthService.verifyPhoneOTP(phone, token);

// Sign in with email
SupabaseAuthService.signInWithEmail(email, password);
SupabaseAuthService.signUpWithEmail(email, password);

// Get current user
SupabaseAuthService.getCurrentUser();

// Sign out
SupabaseAuthService.signOut();
```

### Data Service (`SupabaseDataService`)

```typescript
// Users
SupabaseDataService.getUser(uid);
SupabaseDataService.createUser(user);
SupabaseDataService.updateUser(uid, updates);

// Posts
SupabaseDataService.getPosts();
SupabaseDataService.createPost(post);
SupabaseDataService.updatePost(id, updates);

// Meetups
SupabaseDataService.getMeetups();
SupabaseDataService.createMeetup(meetup);
SupabaseDataService.updateMeetup(id, updates);

// Happy Hours
SupabaseDataService.getHappyHours();
SupabaseDataService.createHappyHour(event);

// Messages
SupabaseDataService.getMessages(roomId);
SupabaseDataService.sendMessage(message);

// Notifications
SupabaseDataService.getNotifications(userId);
```

### Storage Service (`SupabaseStorageService`)

```typescript
// Upload images
SupabaseStorageService.uploadProfilePicture(userId, uri, index);
SupabaseStorageService.uploadPostImage(postId, uri);
SupabaseStorageService.uploadMeetupImage(meetupId, uri);

// Delete files
SupabaseStorageService.deleteFile(bucket, path);
```

## Migration from Firebase

This app has been migrated from Firebase to Supabase. Key changes:

1. **Authentication**: Firebase Auth → Supabase Auth
2. **Database**: Firestore → PostgreSQL
3. **Storage**: Firebase Storage → Supabase Storage
4. **Realtime**: Firebase Realtime Database → Supabase Realtime

All Firebase dependencies have been removed.

## Support

For issues or questions:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the RLS policies in the SQL Editor
- Check the browser console for errors
- Verify your environment variables are correct

## Next Steps

- [ ] Set up email templates for authentication
- [ ] Configure custom domains for storage
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Add database indexes for performance
- [ ] Set up monitoring and alerts
