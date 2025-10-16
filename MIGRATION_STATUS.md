# Supabase Migration Status

This document tracks the progress of the Firebase to Supabase migration.

## ✅ Completed

### Phase 1: Project Setup & Dependencies

- [x] Created new branch `feature/supabase-migration`
- [x] Uninstalled Firebase packages
- [x] Installed Supabase dependencies (`@supabase/supabase-js`, `react-native-url-polyfill`)
- [x] Created Supabase configuration file (`src/config/supabase.config.ts`)
- [x] Created environment variable template (`.env.example`)
- [x] Created database schema file (`supabase-schema.sql`)

### Phase 2: Core Services

- [x] Created `SupabaseAuthService` with phone and email authentication
- [x] Created comprehensive `SupabaseDataService` with CRUD operations for:
  - Users
  - Posts
  - Post Comments
  - Meetups
  - Happy Hours
  - Message Rooms
  - Messages
  - Notifications
- [x] Created `SupabaseStorageService` for image uploads
- [x] Updated `useAuthStore` to use Supabase
- [x] Updated `useMeetupStore` to use Supabase
- [x] Updated `AppNavigator` to initialize Supabase auth state

### Phase 3: Cleanup

- [x] Deleted `firebase.config.ts`
- [x] Deleted `src/services/firebase.ts`
- [x] Deleted `src/services/FirebaseDataService.ts`

### Phase 4: Documentation

- [x] Created comprehensive `SUPABASE_SETUP.md` guide
- [x] Created `MIGRATION_STATUS.md` (this file)

## 🔄 In Progress

None currently - ready for testing and screen updates.

## ⏳ Pending

### Phase 5: Screen Updates

The following screens need to be updated to use Supabase services instead of mock data or Firebase:

#### Authentication Screens

- [ ] `src/screens/auth/AuthHomeScreen.tsx` - Update to use SupabaseAuthService

#### Onboarding Screens

- [ ] `src/screens/onboarding/PhoneVerificationScreen.tsx` - Implement Supabase phone auth
- [ ] `src/screens/onboarding/ProfileSetupScreen.tsx` - Use SupabaseStorageService for profile pictures
- [ ] `src/screens/onboarding/OnboardingCompleteScreen.tsx` - Save user to Supabase database

#### Main Screens - Critical

- [ ] `src/screens/main/HomeScreen.tsx` - Fetch posts, meetups, happy hours from Supabase
- [ ] `src/screens/main/ExploreScreen.tsx` - Fetch content from Supabase
- [ ] `src/screens/main/ProfileScreen.tsx` - Fetch user profile from Supabase
- [ ] `src/screens/main/MessagesScreen.tsx` - Fetch message rooms from Supabase
- [ ] `src/screens/main/MessageDetailsScreen.tsx` - Fetch messages + realtime subscription
- [ ] `src/screens/main/NotificationsScreen.tsx` - Fetch notifications + realtime subscription

#### Main Screens - Posts

- [ ] `src/screens/main/CreatePostScreen.tsx` - Create posts with Supabase
- [ ] `src/screens/main/PostDetailsScreen.tsx` - Fetch post details from Supabase

#### Main Screens - Meetups

- [ ] `src/screens/main/CreateMeetupScreen.tsx` - Create meetups with Supabase
- [ ] `src/screens/main/CreateMeetupStep1Screen.tsx` - Use Supabase service
- [ ] `src/screens/main/CreateMeetupStep2Screen.tsx` - Use Supabase service
- [ ] `src/screens/main/CreateMeetupStep4Screen.tsx` - Use Supabase service
- [ ] `src/screens/main/MeetupDetailsScreen.tsx` - Fetch meetup details from Supabase
- [ ] `src/screens/main/EditMeetupScreen.tsx` - Update meetups with Supabase
- [ ] `src/screens/main/AllMeetupsScreen.tsx` - Fetch all meetups from Supabase

#### Main Screens - Happy Hours

- [ ] `src/screens/main/HappyHourDetailsScreen.tsx` - Fetch happy hour details from Supabase
- [ ] `src/screens/main/AllHappyHourEventsScreen.tsx` - Fetch all happy hours from Supabase

#### Main Screens - Other

- [ ] `src/screens/main/EditProfileScreen.tsx` - Update user profile with Supabase
- [ ] `src/screens/main/UserProfileScreen.tsx` - Fetch other users' profiles
- [ ] `src/screens/main/FavoritesScreen.tsx` - May need Supabase integration
- [ ] `src/screens/main/FollowingScreen.tsx` - Fetch following activity from Supabase
- [ ] `src/screens/main/ActivityFeedScreen.tsx` - Fetch activity from Supabase

### Phase 6: Realtime Features

- [ ] Add realtime subscriptions for messages (MessageDetailsScreen)
- [ ] Add realtime subscriptions for notifications
- [ ] Add realtime subscriptions for meetup participant updates
- [ ] Add realtime subscriptions for post likes/comments

### Phase 7: DataService Updates

- [ ] Update `src/services/DataService.ts` to use SupabaseDataService instead of mock data
- [ ] Remove developer mode or repurpose for Supabase vs Mock toggle

### Phase 8: Native Configuration

- [ ] Remove Firebase configuration from iOS (`GoogleService-Info.plist`)
- [ ] Remove Firebase configuration from Android (`google-services.json`)
- [ ] Update iOS Podfile to remove Firebase dependencies
- [ ] Update Android build.gradle files
- [ ] Run `cd ios && pod install` (if on Mac)

### Phase 9: Testing

- [ ] Test phone authentication flow
- [ ] Test email authentication flow
- [ ] Test session persistence across app restarts
- [ ] Test sign-out functionality
- [ ] Test user profile CRUD operations
- [ ] Test post creation and viewing
- [ ] Test meetup creation and viewing
- [ ] Test happy hour viewing
- [ ] Test message sending and receiving
- [ ] Test realtime message updates
- [ ] Test notification creation and viewing
- [ ] Test realtime notification updates
- [ ] Test image uploads (profile, posts, meetups)
- [ ] Test image viewing from Supabase Storage
- [ ] Test offline behavior
- [ ] Test error handling
- [ ] Test RLS policies (security)

### Phase 10: Final Steps

- [ ] Update main README.md with Supabase information
- [ ] Create pull request
- [ ] Code review
- [ ] Merge to main branch
- [ ] Deploy/release

## 📝 Notes

### Database Schema

- All tables use UUID as primary key (auto-generated)
- Row Level Security (RLS) is enabled on all tables
- Proper indexes are created for performance
- Foreign key relationships are set up
- Timestamps use `TIMESTAMP WITH TIME ZONE`

### Data Mapping

- Database uses snake_case (PostgreSQL convention)
- App uses camelCase (JavaScript/TypeScript convention)
- Mapping functions in SupabaseDataService handle conversion
- Dates are stored as ISO strings in DB, converted to Date objects in app

### Storage

- All buckets are public for now (images need to be accessible)
- Future: Consider private buckets with signed URLs for sensitive images
- Image uploads use base64 encoding via expo-file-system

### Authentication

- Phone auth requires Twilio setup in Supabase dashboard
- Email auth works out of the box
- Session persists in AsyncStorage via Supabase client config
- Auth state changes are monitored via subscription

### Known Issues

- None yet - migration just started

### Breaking Changes

- All Firebase imports must be updated to Supabase
- Authentication methods have different signatures
- Database queries use different syntax (SQL vs Firestore)
- Storage URLs are different format

## 🔗 Quick Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Database Schema](./supabase-schema.sql)

## 🎯 Priority Order

1. **High Priority** (Core functionality):

   - Auth screens (login/signup)
   - Home screen (feed)
   - Profile screen
   - Create post/meetup

2. **Medium Priority** (Social features):

   - Messages
   - Notifications
   - User profiles
   - Following/followers

3. **Low Priority** (Nice to have):
   - Activity feed
   - Favorites
   - Advanced filters
   - Analytics

## 📊 Progress

**Overall Progress**: 30% Complete

- Setup: 100% ✅
- Services: 100% ✅
- Stores: 50% (auth and meetup done, others may need updates)
- Screens: 0% (not started)
- Realtime: 0% (not started)
- Testing: 0% (not started)
- Documentation: 90% (mostly complete)

---

**Last Updated**: Created during initial migration
**Next Steps**: Begin updating authentication screens and HomeScreen
