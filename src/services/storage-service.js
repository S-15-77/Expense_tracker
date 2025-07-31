// src/services/storage-service.js
import { BlobServiceClient } from '@azure/storage-blob';

// Azure Storage Configuration
const storageAccountName = process.env.REACT_APP_STORAGE_ACCOUNT_NAME;
const storageAccountKey = process.env.REACT_APP_STORAGE_ACCOUNT_KEY;
const containerName = process.env.REACT_APP_STORAGE_CONTAINER_NAME || 'receipts';

const blobServiceClient = new BlobServiceClient(
  `https://${storageAccountName}.blob.core.windows.net`,
  { accessKey: storageAccountKey }
);

const containerClient = blobServiceClient.getContainerClient(containerName);

export const storageService = {
  // Upload receipt image
  uploadReceipt: async (file, userId) => {
    try {
      const blobName = `${userId}/${Date.now()}-${file.name}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: {
          blobContentType: file.type
        }
      });

      return blockBlobClient.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Delete receipt image
  deleteReceipt: async (blobUrl) => {
    try {
      const blobName = blobUrl.split('/').pop();
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // Get all receipts for a user
  getUserReceipts: async (userId) => {
    try {
      const receipts = [];
      const prefix = `${userId}/`;
      
      for await (const blob of containerClient.listBlobsFlat({ prefix })) {
        receipts.push({
          name: blob.name,
          url: `${containerClient.url}/${blob.name}`,
          size: blob.properties.contentLength,
          lastModified: blob.properties.lastModified
        });
      }
      
      return receipts;
    } catch (error) {
      console.error('Error getting user receipts:', error);
      throw error;
    }
  }
}; 