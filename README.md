# Paw Palooza 🐕

A dog dating and matching application built with React, TypeScript, and Supabase.

## Project Structure

```
paw-palooza/
├── frontend/          # React frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/           # Python backend compatibility system
│   ├── vector_embedding.py
│   ├── cosine_similarity.py
│   ├── sentiment_analysis.py
│   ├── compatibilitywithReviewsandRatings.py
│   ├── test_compatibility.py
│   └── requirements.txt
├── supabase/         # Database migrations and config
└── package.json      # Root package.json with workspace scripts
```

## Project info

**URL**: https://lovable.dev/projects/918349dd-49d5-408f-afb6-269737a0dcf2

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/918349dd-49d5-408f-afb6-269737a0dcf2) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd paw-palooza

# Step 3: Install the necessary dependencies.
npm run install:frontend

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

The development server will be available at `http://localhost:8080`

## Backend Setup

To run the Python backend compatibility system:

```sh
# Install Python dependencies
cd backend
pip install -r requirements.txt

# Run the compatibility tests
python test_compatibility.py

# Run individual modules
python compatibilitywithReviewsandRatings.py
```

## Google Maps Integration

To enable Google Maps on dog profile pages:

1. **Get a Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Create a new project or select existing one
   - Enable the "Maps JavaScript API"
   - Create credentials (API Key)
   - Restrict the API key to your domain for security

2. **Add the API Key:**
   ```sh
   # Create .env file in frontend directory
   echo "VITE_GOOGLE_MAPS_API_KEY=your_api_key_here" > frontend/.env
   ```

3. **Install Dependencies:**
   ```sh
   cd frontend
   npm install @googlemaps/js-api-loader
   ```

The map will show the exact location of each dog with a marker. For now, all dogs are set to Cambridge, MA coordinates.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/918349dd-49d5-408f-afb6-269737a0dcf2) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
