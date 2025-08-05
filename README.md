# 💰 BudgetWise - Personal Expense Tracker

A modern, feature-rich personal finance management application built with React and Firebase. Track your income and expenses, visualize your financial data with interactive charts, and manage your budget effectively.

![React](https://img.shields.io/badge/React-19%2B-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-v12%2B-orange?logo=firebase)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-green?logo=chart.js)

## ✨ Features

- **🔐 User Authentication**: Secure login and registration with Firebase Auth
- **💸 Transaction Management**: Add, edit, and delete income/expense transactions
- **📊 Data Visualization**: Interactive charts showing income vs expenses
- **🗂️ Category Filtering**: Filter transactions by predefined or custom categories
- **📈 Financial Overview**: Real-time balance, total income, and expense calculations
- **📁 Data Export**: Export transaction data to CSV format
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 19.1, React Router DOM
- **Backend**: Firebase (Authentication + Firestore Database)
- **Charts**: Chart.js with React Chart.js 2
- **Styling**: CSS3 with custom animations and gradients
- **Notifications**: React Toastify
- **File Export**: FileSaver.js

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git**
- A **Firebase account** ([Create one here](https://firebase.google.com/))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/S-15-77/Expense_tracker.git
cd expense-tracker
```

### 2. Install Dependencies

```bash
npm install
```

The following packages will be installed:

```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.7.1",
  "firebase": "^12.0.0",
  "chart.js": "^4.5.0",
  "react-chartjs-2": "^5.3.0",
  "react-toastify": "^11.0.5",
  "file-saver": "^2.0.5"
}
```

### 3. Firebase Setup

#### 3.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard

#### 3.2 Enable Authentication

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Click **Save**

#### 3.3 Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll set up security rules later)
4. Select a location close to your users

#### 3.4 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Web app** icon (`</>`)
4. Register your app with a nickname
5. Copy the Firebase configuration object

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

### 5. Configure Firestore Security Rules

In Firebase Console → **Firestore Database** → **Rules**, replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own transactions
    match /transactions/{docId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid);
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

Click **Publish** to save the rules.

### 6. Run the Application

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## 📱 Usage

### Getting Started
1. **Register**: Create a new account with your name, email and password
2. **Login**: Sign in to access your dashboard
3. **Add Transactions**: Start tracking your income and expenses

### Adding Transactions
- Choose transaction type (Income/Expense)
- Enter amount, title, and date
- Select or create custom categories
- Save the transaction

### Managing Data
- **Edit**: Click the edit button on any transaction
- **Delete**: Remove unwanted transactions
- **Filter**: Use category filters to view specific types
- **Export**: Download your data as CSV

## 🗂️ Project Structure

```
expense-tracker/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Dashboard.js         # Main dashboard component
│   │   ├── Dashboard.css        # Dashboard styles
│   │   ├── Login.js             # Login component
│   │   ├── Login.css            # Login styles
│   │   ├── Register.js          # Registration component
│   │   ├── Register.css         # Registration styles
│   │   ├── Onboarding.js        # Landing page
│   │   ├── Onboarding.css       # Onboarding styles
│   │   └── ChartComponent.js    # Chart visualization
│   ├── firebase.js              # Firebase configuration
│   ├── App.js                   # Main app component
│   ├── App.css                  # Global styles
│   └── index.js                 # App entry point
├── firestore.rules              # Firestore security rules
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🎨 Features Overview

### Dashboard
- **Financial Summary**: View total income, expenses, and current balance
- **Transaction Form**: Add new income/expense entries
- **Transaction List**: View, edit, and delete existing transactions
- **Category Filtering**: Filter by predefined or custom categories

### Charts & Analytics
- Interactive pie/doughnut charts showing income vs expenses
- Visual representation of spending patterns
- Real-time updates when data changes

### Data Management
- **CSV Export**: Download transaction history
- **Real-time Sync**: Changes sync instantly across devices
- **Secure Storage**: Data stored securely in Firebase Firestore

## 🔧 Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## 🐛 Troubleshooting

### Common Issues

**1. Firebase Connection Issues**
- Ensure your `.env` file has correct Firebase configuration
- Check that Firestore security rules are properly set
- Verify your Firebase project is active

**2. Authentication Problems**
- Make sure Email/Password authentication is enabled in Firebase Console
- Check browser console for specific error messages

**3. Data Not Saving**
- Verify Firestore security rules allow read/write operations
- Ensure user is properly authenticated
- Check browser network tab for failed requests

### Environment Variables
If you see `undefined` values in your Firebase config:
1. Restart your development server after creating/updating `.env`
2. Ensure all environment variables start with `REACT_APP_`
3. Check that there are no extra spaces in your `.env` file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Firebase](https://firebase.google.com/) - Backend services
- [Chart.js](https://www.chartjs.org/) - Chart library
- [React Router](https://reactrouter.com/) - Navigation
- [React Toastify](https://fkhadra.github.io/react-toastify/) - Notifications

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing [GitHub Issues](https://github.com/S-15-77/Expense_tracker/issues)
3. Create a new issue with detailed information

---

**Happy budgeting! 💰📊**

## 🚀 Deployment

You can deploy this application to several platforms. Here are the most popular options:

### Option 1: Vercel (Recommended) ⚡

Vercel is perfect for React apps and offers seamless deployment with automatic HTTPS.

#### Steps:
1. **Create a Vercel account** at [vercel.com](https://vercel.com)
2. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```
3. **Deploy via GitHub** (Recommended):
   - Push your code to GitHub
   - Connect your GitHub account to Vercel
   - Import your repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

4. **Or deploy via CLI**:
   ```bash
   npm run build
   vercel --prod
   ```

#### Environment Variables in Vercel:
Go to your Vercel project dashboard → Settings → Environment Variables and add:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Option 2: Netlify 🌐

Another excellent option for static React apps.

#### Steps:
1. **Create account** at [netlify.com](https://netlify.com)
2. **Build the app**:
   ```bash
   npm run build
   ```
3. **Deploy**:
   - Drag and drop the `build` folder to Netlify
   - Or connect your GitHub repository
4. **Add environment variables** in Site Settings → Environment Variables

### Option 3: Firebase Hosting 🔥

Since you're already using Firebase, this creates a unified solution.

#### Steps:
1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```
2. **Login to Firebase**:
   ```bash
   firebase login
   ```
3. **Initialize hosting**:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `build`
   - Configure as single-page app: `Yes`
   - Don't overwrite index.html: `No`

4. **Build and deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

### Option 4: GitHub Pages 📄

Free hosting directly from your GitHub repository.

#### Steps:
1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```
2. **Add to package.json**:
   ```json
   {
     "homepage": "https://S-15-77.github.io/Expense_tracker",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```
3. **Deploy**:
   ```bash
   npm run deploy
   ```

## ⚙️ Post-Deployment Configuration

### Firebase Security (Important!)

After deployment, update your Firebase configuration:

1. **Add your domain to Firebase**:
   - Go to Firebase Console → Authentication → Settings
   - Add your deployment URL to "Authorized domains"
   - Example: `your-app.vercel.app`

2. **Update CORS settings** if needed for Firestore

### Environment Variables Security

- ✅ **Safe to expose**: All `REACT_APP_` variables are safe in frontend
- ✅ **Public by design**: These are meant to be public in client-side apps
- ⚠️ **Firestore Security**: Your security comes from Firestore rules, not hidden API keys

### Performance Optimization

Your app includes several optimizations:
- **Code splitting** with React.lazy()
- **Bundle optimization** with Create React App
- **Firebase SDK tree-shaking**
- **CSS minification**

## 📊 Monitoring & Analytics

Consider adding:
- **Google Analytics** for user insights
- **Firebase Analytics** for app-specific metrics
- **Error tracking** with Sentry or LogRocket

## 🔄 Continuous Deployment

Set up automatic deployments:

### With Vercel:
- Push to `main` branch → Auto-deploy to production
- Push to other branches → Auto-deploy preview URLs

### With Netlify:
- Configure branch deploys
- Set up build hooks for external triggers

### With GitHub Actions:
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase Hosting
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
        env:
          REACT_APP_FIREBASE_API_KEY: ${{ secrets.REACT_APP_FIREBASE_API_KEY }}
          # Add other environment variables
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
```
