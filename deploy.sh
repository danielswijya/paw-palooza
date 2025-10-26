#!/bin/bash

echo "🚀 Paw Palooza Vercel Deployment Setup"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "Prepare for Vercel deployment"
    echo "✅ Changes committed!"
else
    echo "✅ All changes are committed!"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Go to vercel.com and create a new project"
echo "3. Import your GitHub repository"
echo "4. Set these environment variables in Vercel:"
echo "   - VITE_API_URL: https://your-app-name.vercel.app/api"
echo "   - SUPABASE_URL: https://bdzdrpigbtqrfnwdeibf.supabase.co"
echo "   - SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo "5. Deploy!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
