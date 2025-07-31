// src/services/ai-service.js
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

// Azure Cognitive Services Configuration
const computerVisionKey = process.env.REACT_APP_COMPUTER_VISION_KEY;
const computerVisionEndpoint = process.env.REACT_APP_COMPUTER_VISION_ENDPOINT;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': computerVisionKey } }),
  computerVisionEndpoint
);

export const aiService = {
  // Extract text from receipt images
  extractReceiptText: async (imageUrl) => {
    try {
      const result = await computerVisionClient.read(imageUrl);
      const operation = result.operationLocation.split('/').pop();
      
      // Wait for the operation to complete
      let operationResult;
      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        operationResult = await computerVisionClient.getReadResult(operation);
      } while (operationResult.status === 'Running' || operationResult.status === 'NotStarted');

      // Extract text from the result
      const extractedText = operationResult.analyzeResult.readResults
        .map(page => page.lines.map(line => line.text).join(' '))
        .join(' ');

      return extractedText;
    } catch (error) {
      console.error('Error extracting text:', error);
      throw error;
    }
  },

  // Categorize expenses based on text
  categorizeExpense: (text) => {
    const categories = {
      'food': ['restaurant', 'cafe', 'pizza', 'burger', 'coffee', 'lunch', 'dinner', 'breakfast'],
      'transport': ['uber', 'lyft', 'taxi', 'bus', 'train', 'gas', 'fuel', 'parking'],
      'shopping': ['amazon', 'walmart', 'target', 'mall', 'store', 'shop'],
      'entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'game', 'concert'],
      'utilities': ['electricity', 'water', 'gas', 'internet', 'phone', 'utility'],
      'rent': ['rent', 'lease', 'apartment', 'house'],
      'healthcare': ['doctor', 'pharmacy', 'medical', 'health', 'dental']
    };

    const lowerText = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }
    
    return 'other';
  },

  // Extract amount from receipt text
  extractAmount: (text) => {
    const amountRegex = /\$?\d+\.\d{2}/g;
    const amounts = text.match(amountRegex);
    
    if (amounts && amounts.length > 0) {
      // Return the largest amount (usually the total)
      return Math.max(...amounts.map(amt => parseFloat(amt.replace('$', ''))));
    }
    
    return null;
  }
}; 