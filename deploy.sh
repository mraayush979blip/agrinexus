#!/bin/bash

# AgriNexus Cloud Run Deployment Script
# This script automates the process of building and deploying to Google Cloud Run.

# 1. Configuration - EDIT THESE
PROJECT_ID="your-project-id" # Change this to your Google Cloud Project ID
REGION="us-central1"
SERVICE_NAME="agrinexus"

echo "🚀 Starting deployment for $SERVICE_NAME..."

# Check if Project ID is set
if [ "$PROJECT_ID" == "your-project-id" ]; then
    echo "❌ Error: Please edit deploy.sh and set your PROJECT_ID."
    exit 1
fi

# 2. Build the image using Cloud Builds (No local Docker needed)
echo "📦 Building image in the cloud..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# 3. Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="NODE_ENV=production"

echo "✅ Done! Your app should be live soon."
echo "🔗 Check the Cloud Run console for your service URL."
echo "⚠️  Remember to manually add your GEMINI_API_KEY and Firebase variables in the Cloud Run Console."
