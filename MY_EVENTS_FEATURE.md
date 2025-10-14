# My Events Feature

## Overview

Created a comprehensive "My Events" page that combines favorited content and joined meetups, accessible from the home dropdown menu.

## Changes Made

### 1. Home Screen Dropdown (`src/screens/main/HomeScreen.tsx`)

**Updated:**

- Renamed "Favorites" → "My Events"
- Changed icon from `star-outline` → `calendar-outline`

**Dropdown Menu:**

- ✅ For You (active)
- 📅 My Events → navigates to My Events page
- 🗺️ Map View → navigates to Map

### 2. Enhanced Favorites Screen → My Events (`src/screens/main/FavoritesScreen.tsx`)

**New Name:** "My Events" (combines favorites and joined)

**Two Tabs:**

1. **Favorites (8)** - Saved meetups (4) + saved happy hours (4) combined
2. **Joined (3)** - Meetups user is participating in

**Features Added:**

- **EnhancedMeetupCard** - Now shows images and rich styling like Home feed
- **Unfavorite Button** - Red button on Favorites tab cards to remove from favorites
- **Leave Meetup Button** - Gray button on Joined tab cards to leave meetups
- **Combined View** - Favorites tab shows both meetups and happy hours together
- **Mock Data** - Joined tab loads real data from `getUserJoinedMeetups()`

**Card Actions:**

- **Favorites Tab**:
  - Shows 4 favorite meetups + 4 favorite happy hours
  - Each card has "Unfavorite" button (red, heart-dislike icon)
  - Removes item from favorites when clicked
- **Joined Tab**:
  - Shows meetups where user is participant (not creator)
  - Each card has "Leave Meetup" button (gray, exit icon)
  - Shows alert when clicked (can be extended to actual leave logic)

### 3. Community Screen Improvements (`src/screens/main/AnimatedAvatarScreen.tsx`)

**Fixed:**

- Button text now uses `colors.onPrimary` for proper visibility
- Reduced card maxHeight from 180 to 285 for better navbar clearance
- Added bouncing scroll indicator (down arrow) at bottom of cards
- Indicator disappears after user scrolls
- Removed "Swipe to discover more people" hint

## Data Structure

### Favorites Tab

Combines two data sources:

```typescript
favoriteMeetups: ["meetup1", "meetup2", "meetup4", "meetup5"]  // 4 items
favoriteEvents: ["event1", "event2", "event3", "event5"]        // 4 items
Total: 8 favorites
```

### Joined Tab

Uses existing `userMeetups.ts` data:

```typescript
getUserJoinedMeetups(currentUser.uid);
// Returns meetups where:
// - user is in participants array
// - user is NOT the creator
// Currently returns ~3 meetups for user1
```

## User Flow

```
Home Screen
  ↓
Tap "Evertwine" logo
  ↓
Select "My Events"
  ↓
View My Events Page
  ├── Favorites (8)
  │   ├── 4 Meetups with images + Unfavorite button
  │   └── 4 Happy Hours with images + Unfavorite button
  └── Joined (3)
      └── 3 Meetups with images + Leave Meetup button
```

## Visual Design

**Card Layout:**

```
┌─────────────────────────────────┐
│  [Enhanced Meetup Card w/Image] │
│  Title, Details, etc.           │
│                 [Unfavorite] ←──┤ Floating button
└─────────────────────────────────┘
```

**Buttons:**

- **Unfavorite**: Red background, white text, heart-dislike icon
- **Leave Meetup**: Gray background, white text, exit icon
- Positioned absolutely at bottom-right of each card
- Rounded corners (borderRadius: 20)
- Shadow for depth

## Technical Implementation

### Components Used

- `EnhancedMeetupCard` - Rich card with images (same as Home feed)
- `EventCard` - Happy hour event cards
- Custom action buttons overlaid on cards

### State Management

- `useFavoritesStore()` - Manages favorited items
- `useAuthStore()` - Gets current user for joined meetups
- `getUserJoinedMeetups()` - Filters user's participated meetups

### Card Rendering

Three separate render functions:

1. `renderFavoriteMeetupCard()` - Meetup + Unfavorite button
2. `renderFavoriteHappyHourCard()` - Happy hour + Unfavorite button
3. `renderJoinedMeetupCard()` - Meetup + Leave button

## Files Modified

1. `src/screens/main/HomeScreen.tsx` - Updated dropdown label and icon
2. `src/screens/main/FavoritesScreen.tsx` - Added 3rd tab, action buttons, enhanced cards
3. `src/screens/main/AnimatedAvatarScreen.tsx` - Fixed button text, added scroll indicator

## Benefits

✅ Unified view for all user's event-related content  
✅ Clear distinction between saved and joined events  
✅ Beautiful card design with images (matches Home feed)  
✅ Easy management with Unfavorite/Leave buttons  
✅ Uses existing mock data from userMeetups.ts  
✅ 2 tabs fit perfectly in single line (no scrolling needed)  
✅ Better name: "My Events" includes both meetups and happy hours

## Mock Data Summary

- **Favorites Tab**: 8 items (4 meetups + 4 happy hours)
- **Joined Tab**: ~3 meetups (from userMeetups.ts where user1 is participant)
- **Total**: ~11 items across both tabs
