# Vercel Deployment Guide for Paw Palooza

## Prerequisites
1. Vercel account (sign up at vercel.com)
2. GitHub account (if not already connected)
3. Your project pushed to GitHub

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Environment Variables Needed
You'll need to set these in Vercel dashboard:

**Frontend Environment Variables:**
- `VITE_API_URL` = `https://your-app-name.vercel.app/api`

**Backend Environment Variables:**
- `SUPABASE_URL` = `https://bdzdrpigbtqrfnwdeibf.supabase.co`
- `SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkemRycGlnYnRxcmZud2RlaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDI0NDksImV4cCI6MjA3Njk3ODQ0OX0.PuOjYconkFQ3UWT-UZX1sUliG5EKPwjsjF5nnR2m-BA`

## Step 2: Deploy on Vercel

### 2.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select your `paw-palooza-2` repository

### 2.2 Configure Project
1. **Framework Preset**: Select "Other" or "Vite"
2. **Root Directory**: Leave as root (since we have vercel.json)
3. **Build Command**: `cd frontend && npm run build`
4. **Output Directory**: `frontend/dist`

### 2.3 Set Environment Variables
In the Vercel dashboard:
1. Go to your project settings
2. Click "Environment Variables"
3. Add the variables listed above

### 2.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## Step 3: Update API URLs (After First Deployment)

After your first deployment, you'll get a URL like `https://paw-palooza-2-abc123.vercel.app`

1. Go back to Environment Variables in Vercel
2. Update `VITE_API_URL` to `https://your-actual-url.vercel.app/api`
3. Redeploy your project

## Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Test the authentication flow
3. Test creating dog profiles
4. Test the compatibility matching
5. Test the email functionality

## Troubleshooting

### Common Issues:
1. **API calls failing**: Check that `VITE_API_URL` is set correctly
2. **Supabase errors**: Verify environment variables are set
3. **Build failures**: Check that all dependencies are in package.json
4. **Python scripts**: Vercel doesn't support Python by default - you may need to use Vercel Functions or external services

### Python Script Alternative:
Since Vercel doesn't support Python, you have a few options:
1. Use Vercel Functions with a Python runtime
2. Deploy Python scripts to a separate service (like Railway, Render, or Heroku)
3. Convert Python logic to JavaScript/Node.js

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure analytics
3. Set up monitoring
4. Consider using Vercel's edge functions for better performance
