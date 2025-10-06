# Vercel Deployment Guide

## Required Environment Variables

To deploy this application on Vercel, you need to set the following environment variables in your Vercel dashboard:

### 1. MONGODB_URI
- **Purpose**: MongoDB connection string
- **Example**: `mongodb+srv://username:password@cluster.mongodb.net/password-vault?retryWrites=true&w=majority`
- **How to get**: Create a MongoDB Atlas account and get your connection string

### 2. JWT_SECRET
- **Purpose**: Secret key for JWT token signing
- **Example**: `your-super-secret-jwt-key-change-this-in-production`
- **How to generate**: Use a strong random string (at least 32 characters)

## Steps to Deploy

1. **Set Environment Variables in Vercel**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add both `MONGODB_URI` and `JWT_SECRET`

2. **Deploy**:
   - Push your code to GitHub
   - Vercel will automatically deploy
   - The deployment should now work without the routes-manifest.json error

## Local Development

For local development, create a `.env.local` file with:

```
MONGODB_URI=mongodb://localhost:27017/password-vault
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Troubleshooting

If you still get the routes-manifest.json error:
1. Make sure all environment variables are set in Vercel
2. Check that your MongoDB connection string is correct
3. Ensure your JWT_SECRET is a strong random string
4. Try redeploying after setting the environment variables
