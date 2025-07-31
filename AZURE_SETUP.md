# Azure Setup Guide for Expense Tracker

This guide will help you set up Azure services to replace Firebase in the expense tracker application.

## Prerequisites

- Azure subscription
- Node.js and npm installed

## 1. Azure AD B2C Setup

### Create Azure AD B2C Tenant
1. Go to Azure Portal
2. Create a new Azure AD B2C tenant
3. Note down your tenant name

### Register Application
1. In your B2C tenant, go to "App registrations"
2. Click "New registration"
3. Name: "Expense Tracker"
4. Supported account types: "Accounts in any identity provider or organizational directory"
5. Redirect URI: Web - `http://localhost:3000`
6. Note down the Application (client) ID

### Create User Flow
1. Go to "User flows"
2. Click "New user flow"
3. Choose "Sign up and sign in"
4. Name: "B2C_1_signupsignin"
5. Configure the flow as needed
6. Note down the user flow name

## 2. Azure Cosmos DB Setup

### Create Cosmos DB Account
1. Go to Azure Portal
2. Create a new Cosmos DB account
3. Choose "Core (SQL)" API
4. Note down the endpoint URL

### Create Database and Container
1. In your Cosmos DB account, create a new database named "expense-tracker"
2. Create a new container named "transactions"
3. Set partition key to "/userId"
4. Get the primary key from "Keys" section

## 3. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Azure AD B2C Configuration
REACT_APP_AZURE_CLIENT_ID=your_azure_b2c_client_id
REACT_APP_AZURE_TENANT_NAME=your_tenant_name
REACT_APP_AZURE_POLICY_NAME=B2C_1_signupsignin

# Azure Cosmos DB Configuration
REACT_APP_COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
REACT_APP_COSMOS_KEY=your_cosmos_db_primary_key
REACT_APP_COSMOS_DATABASE_ID=expense-tracker
REACT_APP_COSMOS_CONTAINER_ID=transactions
```

## 4. Install Dependencies

```bash
npm install @azure/msal-browser @azure/cosmos
```

## 5. Key Differences from Firebase

### Authentication
- Uses Azure AD B2C instead of Firebase Auth
- Popup-based authentication flow
- Different user object structure

### Database
- Uses Cosmos DB instead of Firestore
- SQL-like queries instead of Firestore queries
- Different document structure and IDs

### Real-time Updates
- Simplified polling mechanism instead of Firestore real-time listeners
- 5-second polling interval for updates

## 6. Security Considerations

- Store sensitive keys in environment variables
- Use Azure Key Vault for production deployments
- Configure CORS settings in Cosmos DB
- Set up proper B2C policies for user management

## 7. Production Deployment

For production:
1. Update redirect URIs in B2C app registration
2. Use Azure Key Vault for secrets
3. Configure proper CORS in Cosmos DB
4. Set up monitoring and logging
5. Consider using Azure CDN for static assets

## Troubleshooting

### Common Issues
1. **CORS errors**: Configure CORS in Cosmos DB
2. **Authentication errors**: Check B2C configuration and redirect URIs
3. **Database errors**: Verify Cosmos DB connection string and permissions

### Debug Mode
Enable debug logging by adding to your code:
```javascript
// In azure.js
const msalConfig = {
  // ... existing config
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        console.log(message);
      },
      logLevel: LogLevel.Verbose
    }
  }
};
``` 