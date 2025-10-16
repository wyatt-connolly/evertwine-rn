<!-- 2375ad98-387a-409b-a4d9-34aab15bd549 12971e0c-f20c-4778-9799-747363866ece -->
# Onboarding Redesign with Evertwine Colors

## Overview

Transform the onboarding experience to match the Gleam app aesthetic while using Evertwine's dark theme color palette with purple/pink gradient as primary color.

## Phase 1: Update Theme Configuration

Update `src/hooks/useThemeStore.ts` to include Evertwine's color palette:

- Primary: Purple/Pink gradient (#8B5CF6 to #EC4899)
- Background: #1A1A2E (dark blue-gray/black)
- Secondary accent: Orange #FF7F27 (for specific highlights like dollar signs)
- Tertiary accent: Green #10B981 (for success states, checkmarks)
- Text: White #FFFFFF for primary, light gray for secondary
- Card backgrounds: Semi-transparent dark (rgba(255, 255, 255, 0.05)) with subtle borders

## Phase 2: Create Animated Components

Create `src/components/AnimatedCheckmark.tsx`:

- Loading spinner animation
- Fade in horizontal line below spinner
- Transform spinner to checkmark
- Props: delay, text, onComplete

Create `src/components/ProgressCircle.tsx`:

- Circular progress indicator
- Animated number counter (0 → 33 → 66 → 100)
- Orange stroke color to match Gleam screenshots
- Props: targetPercentage, duration

Create `src/components/OnboardingButton.tsx`:

- Reusable orange rounded button matching Gleam screenshot style
- Disabled state handling
- Props: title, onPress, disabled, style

Create `src/components/SelectableOption.tsx`:

- Semi-transparent dark rounded button
- Icon + text layout
- Selected state with purple/pink gradient border
- Props: icon, text, selected, onPress

## Phase 3: Create New Onboarding Screens

### 3.1 Name Input Screen

Create `src/screens/onboarding/NameInputScreen.tsx`:

- Dark gradient background (#1A1A2E with subtle texture)
- "What's your name?" title (large white serif-style)
- Input field with white underline
- Orange "Continue" button at bottom (matching Gleam)
- Fade-in animation on mount

### 3.2 Age Selection Screen

Create `src/screens/onboarding/AgeSelectionScreen.tsx`:

- "How old are you?" title
- Age range buttons: 18-24, 25-34, 35-44, 45-54, 55+
- Semi-transparent dark rounded buttons
- Orange continue button
- Staggered fade-in for options

### 3.3 Gender Selection Screen

Create `src/screens/onboarding/GenderSelectionScreen.tsx`:

- "What's your gender?" title
- Options: Male, Female, Non-binary, Prefer not to say
- SelectableOption components with appropriate icons
- Orange continue button

### 3.4 Goals Selection Screen

Create `src/screens/onboarding/GoalsSelectionScreen.tsx`:

- "What do you hope to improve with Evertwine?" title
- Options with icons:
- 🌟 Make new friends
- 💼 Expand my network
- 🎯 Find activity partners
- ❤️ Improve my dating life
- 🎉 Discover local events
- 🎨 Learn new hobbies
- 📍 Other
- Multiple selection allowed
- Staggered button animations

### 3.5 Obstacles Screen

Create `src/screens/onboarding/ObstaclesScreen.tsx`:

- "Is there anything holding you back from meeting new people?" title
- Options:
- 💡 I don't know where to start
- ⏳ I don't have time
- 👥 Social anxiety
- 🚀 Staying motivated
- 😊 Worried what others think
- ❌ Not really
- Single selection
- Animated options

### 3.6 Commitment Screen

Create `src/screens/onboarding/CommitmentScreen.tsx`:

- "Your Journey Starts Now" title
- Subtitle: "Congratulations on taking the first step..."
- Semi-transparent commitment text box
- Fingerprint icon (or custom Evertwine icon)
- "Hold to commit" with progress indicator
- "Creating your profile..." loading text

### 3.7 Feature Introduction Screen

Create `src/screens/onboarding/FeatureIntroScreen.tsx`:

- "Welcome to Evertwine" title
- Subtitle about connecting in 5 minutes
- Feature cards with icons (use purple, green, orange for variety):
- 📍 Discover Local Meetups (purple icon)
- 🎉 Find Happy Hours & Events (orange icon)
- 💬 Connect Before You Meet (green icon)
- 📊 Track Your Social Circle (purple icon)
- 🔔 Smart Notifications (green icon)
- AnimatedCheckmark for each feature
- Orange "Get Started" button

### 3.8 Loading/Progress Screen

Create `src/screens/onboarding/BuildingProfileScreen.tsx`:

- Orange glowing edges effect (matching Gleam screenshot)
- ProgressCircle component (0 → 33 → 66 → 100)
- "Just a moment" title
- "Building a personalized plan" subtitle
- AnimatedCheckmark list:
- "Analyzing your preferences"
- "Finding nearby meetups"
- "Personalizing your feed"
- Automatically navigate after completion

### 3.9 Social Benefits Screen

Create `src/screens/onboarding/SocialBenefitsScreen.tsx`:

- Header with back button and "Last step" progress bar (orange)
- Hero image/illustration (reuse or create Evertwine-themed)
- "Real connections transform your life" title
- Bullet points with AnimatedCheckmarks:
- "Join 50k+ people building real friendships"
- "Discover events tailored to your interests"
- "Safe, verified community members"
- "Free to join, easy to use"
- Source citation at bottom
- Orange "Continue" button

### 3.10 Learning Routine Screen

Create `src/screens/onboarding/RoutineSetupScreen.tsx`:

- "Let's set up your preferences!" title
- "How often would you like to attend meetups?" question
- Time options:
- Once a week - Casual
- 2-3 times a week - Regular
- 4+ times a week - Social butterfly
- Orange progress bar at top
- "Help me connect" button

## Phase 4: Update Navigation

Update `src/navigation/OnboardingStack.tsx`:

- Add all new screens to stack navigator
- Define proper flow order:

1. CinematicIntro
2. Welcome (existing, keep animations)
3. NameInputScreen
4. AgeSelectionScreen
5. GenderSelectionScreen
6. GoalsSelectionScreen
7. ObstaclesScreen
8. RoutineSetupScreen
9. FeatureIntroScreen
10. SocialBenefitsScreen
11. CommitmentScreen
12. BuildingProfileScreen
13. ProfileSetup (existing - photos)
14. InterestSelection (existing)
15. LocationPermission (existing)
16. OnboardingComplete

## Phase 5: Update Existing Screens

Update `src/screens/WelcomeScreen.tsx`:

- Keep current animations
- Update background to use dark theme (#1A1A2E)
- Keep auth.png background but add darker overlay
- Buttons remain orange to match Gleam style

Update `src/screens/onboarding/ProfileSetupScreen.tsx`:

- Apply new color scheme (dark background)
- Orange buttons for consistency with Gleam
- Maintain photo upload functionality

Update `src/screens/onboarding/InterestSelectionScreen.tsx`:

- Use SelectableOption components
- Apply AnimatedCheckmark animations
- Dark theme colors

## Phase 6: Create Animation Utilities

Create `src/utils/animations.ts`:

- `createFadeInAnimation(delay)`: Standard fade-in
- `createSlideUpAnimation(delay)`: Slide up from bottom
- `createStaggeredAnimations(count, baseDelay)`: Multiple items
- `createProgressAnimation(start, end, duration)`: Number counters

## Key Visual Details

**Color Usage:**

- Purple/Pink gradient: Main branding (logo, "Together" text, primary icons)
- Orange: Call-to-action buttons, progress bars, loading indicators
- Green: Success states, checkmarks, positive indicators
- Dark background: #1A1A2E throughout

**Typography:**

- Titles: 28-32px, white, bold
- Body: 16-18px, white/light gray
- Button text: 18px, white, bold

**Spacing:**

- Screen padding: 24px horizontal
- Element margins: 16-24px vertical
- Button height: 56px

**Animations:**

- Fade-in duration: 600ms
- Stagger delay: 200ms between items
- Checkmark sequence: 400ms per step
- Progress counter: 800ms per increment

**Backgrounds:**

- Main: #1A1A2E
- Cards: rgba(255, 255, 255, 0.05) with border
- Overlay: rgba(0, 0, 0, 0.3)
- Gradient edge glow: Orange radial gradient (on loading screen)

## Testing Considerations

- Test animation performance on older devices
- Verify smooth transitions between screens
- Ensure progress persists across app restarts
- Test with different screen sizes
- Validate color contrast for accessibility

### To-dos

- [ ] Update useThemeStore with Evertwine color palette
- [ ] Create AnimatedCheckmark component with loading → line → checkmark sequence
- [ ] Create ProgressCircle component with animated counter
- [ ] Create reusable OnboardingButton component
- [ ] Create SelectableOption component for multi-choice screens
- [ ] Create NameInputScreen with dark theme and animations
- [ ] Create AgeSelectionScreen with age range options
- [ ] Create GenderSelectionScreen with icon options
- [ ] Create GoalsSelectionScreen with multiple selection
- [ ] Create ObstaclesScreen for identifying barriers
- [ ] Create CommitmentScreen with fingerprint interaction
- [ ] Create FeatureIntroScreen with animated feature list
- [ ] Create BuildingProfileScreen with progress circle and checkmarks
- [ ] Create SocialBenefitsScreen with stats and benefits
- [ ] Create RoutineSetupScreen for meetup frequency
- [ ] Create animation utility functions
- [ ] Update OnboardingStack with new screen flow
- [ ] Update WelcomeScreen with new color scheme
- [ ] Update ProfileSetupScreen with dark theme
- [ ] Update InterestSelectionScreen with new animations