# Unsplash API Setup Guide

## Overview

This guide explains how to set up the Unsplash API for image suggestions in the meetup creation flow.

## Step 1: Create Unsplash Developer Account

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Click "Register a new application"
3. Fill out the application form:
   - **Application name**: Evertwine Mobile
   - **Description**: Mobile app for creating and discovering meetups
   - **Website URL**: Your app's website (can be placeholder)
4. Accept the API terms and submit

## Step 2: Get Your Access Key

1. After registration, you'll be redirected to your application dashboard
2. Copy the "Access Key" (starts with your app ID)
3. Keep this key secure - it's your API credential

## Step 3: Configure the App

### Option A: Environment Variables (Recommended)

Create a `.env` file in your project root:

```bash
UNSPLASH_ACCESS_KEY=your_access_key_here
```

Then update `src/services/UnsplashService.ts`:

```typescript
private static readonly ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';
```

### Option B: Direct Configuration

Update `src/services/UnsplashService.ts` line 12:

```typescript
private static readonly ACCESS_KEY = 'your_actual_access_key_here';
```

## Step 4: Test the Integration

1. Run the app
2. Navigate to Create Meetup
3. Enter a title like "Golfing with friends"
4. Click "Add cover image"
5. You should see suggested images appear

## API Limits

- **Free tier**: 50 requests per hour
- **Rate limiting**: 50 requests per hour per application
- **Attribution**: Required for all images (handled automatically)

## Troubleshooting

### No images appearing?

1. Check that your API key is correctly configured
2. Verify the title contains meaningful keywords
3. Check console logs for API errors
4. Ensure you have internet connectivity

### API errors?

1. Verify your access key is correct
2. Check if you've exceeded the rate limit
3. Ensure your application is approved (usually instant for free tier)

## Security Notes

- Never commit API keys to version control
- Use environment variables for production
- Consider implementing API key rotation for production apps
- Monitor your API usage to avoid rate limits

## Attribution Requirements

Unsplash requires attribution for all images. The service automatically includes attribution text under each suggested image. This satisfies Unsplash's attribution requirements.
