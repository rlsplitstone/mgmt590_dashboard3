# NBA Analytics Dashboard - Deployment Instructions

## Overview
This is a streamlined NBA Analytics Dashboard with three analytical views (GM, Coach, Scout) featuring interactive charts and player/team filters. The dashboard is built with React, Vite, Tailwind CSS, and ShadCN/UI components.

## Features
- **GM View**: Salary vs Performance analysis, Team Payroll Efficiency, Financial metrics
- **Coach View**: Player Efficiency by Position, Load Management Status, Player status cards
- **Scout View**: Value vs Age analysis, Market Opportunities, Target players list
- **Interactive Filters**: Team and Position filters that work across all views
- **Real Data**: Loads from CSV files with fallback sample data
- **Responsive Design**: Works on desktop and mobile devices
- **Professional UI**: NBA-themed design with Purdue University branding

## Project Structure
```
nba-dashboard-streamlined/
├── dist/                    # Production build (ready for deployment)
├── public/
│   └── data/               # CSV data files
├── src/
│   ├── components/         # React components
│   │   ├── charts/        # Chart components
│   │   └── ui/            # UI components (ShadCN)
│   ├── utils/             # Utility functions
│   └── App.jsx            # Main application
├── package.json           # Dependencies and scripts
└── vite.config.js         # Build configuration
```

## Firebase Deployment

### Option 1: Firebase Hosting (Recommended)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in the project directory: `firebase init`
   - Select "Hosting"
   - Choose your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: Yes
   - Set up automatic builds: No (optional)
4. Deploy: `firebase deploy`

### Option 2: Manual Upload to Firebase Console
1. Go to Firebase Console (https://console.firebase.google.com)
2. Select your project
3. Go to Hosting section
4. Upload the entire `dist` folder contents
5. Your dashboard will be available at your Firebase URL

## Local Development

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Setup
1. Extract the project files
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm run dev`
4. Open http://localhost:5173

### Available Scripts
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build locally

## Data Management
The dashboard loads data from CSV files in the `public/data/` directory:
- `financial_player_data.csv` - Player financial data
- `financial_team_data.csv` - Team financial data
- `operations_player_efficiency.csv` - Player operations data
- `operations_team_efficiency.csv` - Team operations data

To update data:
1. Replace CSV files in `public/data/`
2. Rebuild the project: `pnpm run build`
3. Redeploy to Firebase

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes
- Initial bundle size: ~682KB (gzipped: ~193KB)
- Charts are optimized for performance with Recharts
- Data is cached after initial load
- Responsive images and lazy loading implemented

## Troubleshooting

### Build Issues
- Ensure Node.js 18+ is installed
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Check for TypeScript errors: `pnpm run build`

### Data Loading Issues
- Verify CSV files are in `public/data/` directory
- Check browser console for network errors
- Dashboard will use fallback data if CSV files are missing

### Firebase Deployment Issues
- Ensure Firebase CLI is updated: `npm update -g firebase-tools`
- Check Firebase project permissions
- Verify `dist` folder exists and contains built files

## Support
For technical issues or questions, refer to:
- React Documentation: https://react.dev
- Vite Documentation: https://vitejs.dev
- Firebase Hosting: https://firebase.google.com/docs/hosting
- ShadCN/UI: https://ui.shadcn.com

## License
This project is for educational purposes (MGMT 5900 Final Project - Team DN8).

