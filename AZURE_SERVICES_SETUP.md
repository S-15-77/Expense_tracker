# Azure Services Setup Guide for Expense Tracker

This guide covers all the Azure services you can use in your expense tracker application without requiring Azure AD B2C.

## 🚀 Available Azure Services

### **1. Azure Cosmos DB (Database)**
- **Purpose**: Store transaction data
- **Setup**: Easy - just create account and get connection string
- **Cost**: Pay-per-use, very affordable for small apps

### **2. Azure Cognitive Services (AI)**
- **Purpose**: Extract text from receipts, categorize expenses
- **Setup**: Create Computer Vision resource
- **Cost**: Pay per API call

### **3. Azure Blob Storage (File Storage)**
- **Purpose**: Store receipt images and documents
- **Setup**: Create storage account and container
- **Cost**: Very cheap for file storage

### **4. Azure Functions (Serverless)**
- **Purpose**: Process data, generate reports, send notifications
- **Setup**: Create Function App
- **Cost**: Pay only when functions run

### **5. Azure App Service (Hosting)**
- **Purpose**: Host your React app
- **Setup**: Deploy your app to Azure
- **Cost**: Free tier available

## 📋 Setup Instructions

### **Step 1: Azure Cosmos DB**
1. Go to Azure Portal
2. Create a new Cosmos DB account
3. Choose "Core (SQL)" API
4. Create database named "expense-tracker"
5. Create container named "transactions" with partition key "/userId"
6. Get connection string from "Keys" section

### **Step 2: Azure Cognitive Services**
1. Go to Azure Portal
2. Create a new "Computer Vision" resource
3. Choose a region close to you
4. Get the endpoint URL and API key

### **Step 3: Azure Blob Storage**
1. Go to Azure Portal
2. Create a new Storage Account
3. Create a container named "receipts"
4. Get the account name and access key

### **Step 4: Azure Functions (Optional)**
1. Go to Azure Portal
2. Create a new Function App
3. Deploy your functions (see examples below)
4. Get the function app URL

## 🔧 Environment Variables

Create a `.env` file with these variables:

```env
# Azure Cosmos DB
REACT_APP_COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
REACT_APP_COSMOS_KEY=your_cosmos_db_primary_key
REACT_APP_COSMOS_DATABASE_ID=expense-tracker
REACT_APP_COSMOS_CONTAINER_ID=transactions

# Azure Cognitive Services
REACT_APP_COMPUTER_VISION_KEY=your_computer_vision_key
REACT_APP_COMPUTER_VISION_ENDPOINT=https://your-resource.cognitiveservices.azure.com/

# Azure Blob Storage
REACT_APP_STORAGE_ACCOUNT_NAME=your_storage_account_name
REACT_APP_STORAGE_ACCOUNT_KEY=your_storage_account_key
REACT_APP_STORAGE_CONTAINER_NAME=receipts

# Azure Functions (Optional)
REACT_APP_FUNCTION_APP_URL=https://your-function-app.azurewebsites.net
```

## 💰 Cost Estimation

### **Free Tier (Monthly)**
- **Cosmos DB**: 1000 RU/s, 25 GB storage
- **Cognitive Services**: 5000 transactions
- **Blob Storage**: 5 GB storage
- **Functions**: 1 million executions
- **App Service**: 1 GB RAM, 1 hour/day

### **Estimated Monthly Cost (Small App)**
- **Cosmos DB**: $0-5
- **Cognitive Services**: $0-10
- **Blob Storage**: $0-1
- **Functions**: $0-5
- **Total**: $0-21/month

## 🎯 Features You Can Add

### **AI-Powered Features**
- 📸 **Receipt Scanning**: Upload receipt photos, extract text automatically
- 🏷️ **Smart Categorization**: AI automatically categorizes expenses
- 💰 **Amount Extraction**: Extract amounts from receipt images
- 📊 **Expense Insights**: AI-powered spending analysis

### **File Management**
- 📁 **Receipt Storage**: Store receipt images securely
- 🔍 **Receipt Search**: Search through uploaded receipts
- 📱 **Mobile Upload**: Upload receipts from mobile devices

### **Advanced Analytics**
- 📈 **Trend Analysis**: Analyze spending patterns over time
- 🎯 **Budget Alerts**: Get notified when approaching budget limits
- 📋 **Report Generation**: Generate detailed expense reports
- 🔔 **Smart Notifications**: Get insights and recommendations

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Azure services** (follow steps above)

3. **Configure environment variables**

4. **Start the app**:
   ```bash
   npm start
   ```

## 🔒 Security Best Practices

1. **Use environment variables** for all secrets
2. **Enable CORS** in Cosmos DB and Storage
3. **Use Shared Access Signatures** for storage access
4. **Implement proper authentication** (consider Azure App Service Auth)
5. **Regular security audits** of your Azure resources

## 📞 Support

- **Azure Documentation**: https://docs.microsoft.com/azure/
- **Azure Pricing Calculator**: https://azure.microsoft.com/pricing/calculator/
- **Azure Free Account**: https://azure.microsoft.com/free/

## 🎉 Benefits of This Setup

✅ **No B2C required** - Simple authentication  
✅ **Pay-per-use pricing** - Only pay for what you use  
✅ **Scalable** - Grows with your needs  
✅ **AI-powered** - Smart features out of the box  
✅ **Secure** - Enterprise-grade security  
✅ **Global** - Available worldwide 