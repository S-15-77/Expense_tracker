// src/azure-simple.js
import { CosmosClient } from '@azure/cosmos';

console.log(process.env.REACT_APP_COSMOS_ENDPOINT);
console.log(process.env.REACT_APP_COSMOS_KEY);
console.log(process.env.REACT_APP_COSMOS_DATABASE_ID);
console.log(process.env.REACT_APP_COSMOS_CONTAINER_ID);
// Azure Cosmos DB Configuration
const cosmosConfig = {
  endpoint: process.env.REACT_APP_COSMOS_ENDPOINT,
  key: process.env.REACT_APP_COSMOS_KEY,
  databaseId: process.env.REACT_APP_COSMOS_DATABASE_ID || 'expense-tracker',
  containerId: process.env.REACT_APP_COSMOS_CONTAINER_ID || 'transactions'
};

// Initialize Cosmos DB
const cosmosClient = new CosmosClient({
  endpoint: cosmosConfig.endpoint,
  key: cosmosConfig.key
});
console.log(cosmosConfig);

const database = cosmosClient.database(cosmosConfig.databaseId);
const container = database.container(cosmosConfig.containerId);

// Simple Authentication (using localStorage for demo)
export const auth = {
  // Sign in with email/password
  signInWithEmailAndPassword: async (email, password) => {
    try {
      // For demo purposes, we'll use simple validation
      // In production, you'd want to use Azure App Service Authentication
      if (email && password) {
        const user = {
          uid: Date.now().toString(),
          email: email,
          displayName: email.split('@')[0]
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { user };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    }
  },

  // Create user with email/password
  createUserWithEmailAndPassword: async (email, password) => {
    try {
      // Simple user creation for demo
      const user = {
        uid: Date.now().toString(),
        email: email,
        displayName: email.split('@')[0]
      };
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { user };
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    const user = auth.getCurrentUser();
    callback(user);

    // Set up a simple listener for auth changes
    const checkAuthState = () => {
      const currentUser = auth.getCurrentUser();
      callback(currentUser);
    };

    // Check auth state every second (simplified approach)
    const interval = setInterval(checkAuthState, 1000);

    return () => clearInterval(interval);
  }
};

// Database functions
export const db = {
  // Add document
  addDoc: async (collectionRef, data) => {
    try {
      const item = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString()
      };
      
      const { resource } = await container.items.create(item);
      return { id: resource.id, ...resource };
    } catch (error) {
      throw error;
    }
  },

  // Get documents with query
  query: (collectionRef, ...queryConstraints) => {
    let query = 'SELECT * FROM c';
    const parameters = [];

    queryConstraints.forEach(constraint => {
      if (constraint.type === 'where') {
        if (constraint.field === 'userId') {
          query += ' WHERE c.userId = @userId';
          parameters.push({ name: '@userId', value: constraint.value });
        }
      }
    });

    return {
      onSnapshot: (callback) => {
        const executeQuery = async () => {
          try {
            const { resources } = await container.items.query({
              query,
              parameters
            });
            
            const docs = resources.map(doc => ({
              id: doc.id,
              ...doc
            }));
            
            callback({ docs });
          } catch (error) {
            console.error('Query error:', error);
          }
        };

        executeQuery();
        
        // Set up polling for real-time updates
        const interval = setInterval(executeQuery, 5000);
        
        return () => clearInterval(interval);
      }
    };
  },

  // Update document
  updateDoc: async (docRef, data) => {
    try {
      const { id } = docRef;
      const { resource: existingDoc } = await container.item(id, id).read();
      
      const updatedDoc = {
        ...existingDoc,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      const { resource } = await container.item(id, id).replace(updatedDoc);
      return resource;
    } catch (error) {
      throw error;
    }
  },

  // Delete document
  deleteDoc: async (docRef) => {
    try {
      const { id } = docRef;
      await container.item(id, id).delete();
    } catch (error) {
      throw error;
    }
  },

  // Document reference helper
  doc: (collectionRef, id) => ({ id, collectionRef })
};

// Collection reference helper
export const collection = (db, collectionName) => collectionName;

export { cosmosClient, database, container }; 