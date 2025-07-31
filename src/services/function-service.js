// src/services/function-service.js

// Azure Functions Configuration
const functionAppUrl = process.env.REACT_APP_FUNCTION_APP_URL;

export const functionService = {
  // Process expense data
  processExpense: async (expenseData) => {
    try {
      const response = await fetch(`${functionAppUrl}/api/process-expense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData)
      });

      if (!response.ok) {
        throw new Error('Failed to process expense');
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing expense:', error);
      throw error;
    }
  },

  // Get expense insights
  getExpenseInsights: async (userId, timeRange = 'month') => {
    try {
      const response = await fetch(
        `${functionAppUrl}/api/expense-insights?userId=${userId}&timeRange=${timeRange}`
      );

      if (!response.ok) {
        throw new Error('Failed to get insights');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting insights:', error);
      throw error;
    }
  },

  // Send budget alerts
  sendBudgetAlert: async (userId, alertData) => {
    try {
      const response = await fetch(`${functionAppUrl}/api/budget-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...alertData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send alert');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending alert:', error);
      throw error;
    }
  },

  // Generate expense report
  generateReport: async (userId, reportType, dateRange) => {
    try {
      const response = await fetch(`${functionAppUrl}/api/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          reportType,
          dateRange
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}; 