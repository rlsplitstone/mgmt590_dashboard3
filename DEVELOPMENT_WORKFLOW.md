# Recommended Development Workflow for NBA Dashboard

This document outlines the recommended workflow for continuing development on your NBA Analytics Dashboard project.

## Feature Branch Workflow

For ongoing development and adding new features like the League Overview, we recommend:

1. **Create a new branch for each feature:**
   ```bash
   # Create and checkout a new branch
   git checkout -b feature/league-overview
   ```

2. **Make your changes and test locally:**
   ```bash
   # Start development server
   pnpm run dev
   ```

3. **Build and deploy to staging for testing:**
   ```bash
   # Build the project
   pnpm run build
   
   # Deploy to staging environment
   firebase deploy --only hosting:staging
   ```

4. **After testing, merge to main for production:**
   ```bash
   # Switch to main branch
   git checkout main
   
   # Merge your feature branch
   git merge feature/league-overview
   
   # Build for production
   pnpm run build
   
   # Deploy to production
   firebase deploy --only hosting:production
   ```

## Troubleshooting

### Firebase Hosting Issues

If you encounter issues with creating the staging site:
1. Go to Firebase Console (https://console.firebase.google.com)
2. Navigate to your project
3. Go to Hosting
4. Add a new site with the name "nba-analytics-purdue-staging"

### Multi-site Configuration Issues

If your deployment targets are not working correctly:
```bash
# List your hosting targets to verify
firebase target:list hosting

# Re-apply targets if needed
firebase target:apply hosting production nba-analytics-purdue
firebase target:apply hosting staging nba-analytics-purdue-staging
```

## Best Practices

1. **Commit often** with clear, descriptive messages
2. **Test thoroughly** on staging before deploying to production
3. **Keep dependencies updated** using `pnpm update`
4. **Document new features** in code and README
5. **Optimize images and assets** before adding to the project

For more information on Firebase multi-site hosting, visit:
https://firebase.google.com/docs/hosting/multisites
