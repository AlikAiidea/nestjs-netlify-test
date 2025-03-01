# Netlify Deployment Instructions

This document provides instructions for deploying this Nest.js application to Netlify.

## Setup

1. We have set up the following configuration for Netlify deployment:
   - `netlify.toml`: Configuration file for Netlify build settings
   - `netlify/functions/server.js`: Serverless function to serve the Nest.js application
   - Added necessary scripts to `package.json`

## Local Development

To run the application locally with Netlify's development environment:

```bash
npm run netlify:dev
```

This will start the Netlify dev server, which will serve your application locally as it would be served on Netlify.

## Deployment

### Method 1: Using Netlify CLI

1. First, log in to Netlify:
   ```bash
   npx netlify login
   ```

2. Initialize your site (first time only):
   ```bash
   npx netlify init
   ```

3. Deploy to production:
   ```bash
   npm run netlify:deploy
   ```

### Method 2: Connecting to GitHub

1. Push your code to a GitHub repository
2. Log in to the Netlify web UI (https://app.netlify.com/)
3. Click "Add new site" > "Import an existing project"
4. Connect to your GitHub account and select your repository
5. Configure build settings (should be automatically detected from netlify.toml)
6. Click "Deploy site"

## Environment Variables

Make sure to configure any required environment variables in the Netlify dashboard under:
Site settings > Build & deploy > Environment > Environment variables

## Notes

- The application is served as a serverless function and might have cold start times
- For optimal performance, consider adjusting the `functions.js.node_bundler` setting in `netlify.toml` based on your needs
- Serverless functions on Netlify have a 10-second execution limit by default. For large applications, you might need to optimize for this constraint. 