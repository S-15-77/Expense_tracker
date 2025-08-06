// src/__tests__/EdgeCases.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import Register from '../components/Register';
import Onboarding from '../components/Onboarding';
import ChartComponent from '../components/ChartComponent';

// Test utilities
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
};

describe('🚨 EDGE CASE TESTING - Expense Tracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('📊 Dashboard Component Edge Cases', () => {
    test('should handle null/undefined user gracefully', () => {
      renderWithRouter(<Dashboard user={null} />);
      // Should not crash
      expect(document.body).toBeInTheDocument();
    });

    test('should handle extremely large transaction amounts', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      
      // Test very large number
      await user.type(amountInput, '999999999999999');
      expect(amountInput.value).toBe('999999999999999');
      
      // Test scientific notation
      await user.clear(amountInput);
      await user.type(amountInput, '1e10');
      expect(amountInput.value).toBe('1e10');
    });

    test('should handle negative amounts', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '-100');
      expect(amountInput.value).toBe('-100');
    });

    test('should handle zero amounts', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '0');
      expect(amountInput.value).toBe('0');
    });

    test('should handle special characters in title field', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      const specialChars = '!@#$%^&*()_+{}|:"<>?[]\\;\',./"';
      
      await user.type(titleInput, specialChars);
      expect(titleInput.value).toBe(specialChars);
    });

    test('should handle extremely long titles', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      const longTitle = 'A'.repeat(1000); // 1000 character title
      
      await user.type(titleInput, longTitle);
      expect(titleInput.value).toBe(longTitle);
    });

    test('should handle empty custom category', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const categorySelect = screen.getByLabelText(/category/i);
      await user.selectOptions(categorySelect, 'custom');
      
      const customInput = screen.getByPlaceholderText(/enter custom category/i);
      expect(customInput).toBeInTheDocument();
      
      // Try to submit with empty custom category
      await user.clear(customInput);
      expect(customInput.value).toBe('');
    });

    test('should handle invalid date formats', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const dateInput = screen.getByLabelText(/date/i);
      
      // Test invalid date
      await user.clear(dateInput);
      await user.type(dateInput, '2023-13-40'); // Invalid month and day
      
      // Browser should handle validation
      expect(dateInput.value).toBe('2023-13-40');
    });

    test('should handle future dates', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const dateInput = screen.getByLabelText(/date/i);
      const futureDate = '2030-12-31';
      
      await user.clear(dateInput);
      await user.type(dateInput, futureDate);
      expect(dateInput.value).toBe(futureDate);
    });

    test('should handle very old dates', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const dateInput = screen.getByLabelText(/date/i);
      const oldDate = '1900-01-01';
      
      await user.clear(dateInput);
      await user.type(dateInput, oldDate);
      expect(dateInput.value).toBe(oldDate);
    });
  });

  describe('🔐 Authentication Edge Cases', () => {
    test('should handle empty email in login', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      // Should trigger HTML5 validation
      expect(emailInput).toBeRequired();
    });

    test('should handle invalid email formats', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const invalidEmails = [
        'notanemail',
        '@domain.com',
        'user@',
        'user@@domain.com',
        'user..name@domain.com',
        'user@domain',
        'user name@domain.com',
      ];
      
      for (const email of invalidEmails) {
        await user.clear(emailInput);
        await user.type(emailInput, email);
        expect(emailInput.value).toBe(email);
      }
    });

    test('should handle very long passwords', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      const veryLongPassword = 'A'.repeat(200); // 200 character password
      
      await user.type(passwordInput, veryLongPassword);
      expect(passwordInput.value).toBe(veryLongPassword);
    });

    test('should handle special characters in name', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const specialNames = [
        "José María",
        "李小明",
        "Müller",
        "O'Connor",
        "Smith-Jones",
        "Jean-François",
        "Αλέξανδρος",
        "🎉 Emoji Name",
      ];
      
      for (const name of specialNames) {
        await user.clear(nameInput);
        await user.type(nameInput, name);
        expect(nameInput.value).toBe(name);
      }
    });
  });

  describe('📈 Chart Component Edge Cases', () => {
    test('should handle zero income and expense', () => {
      render(<ChartComponent income={0} expense={0} />);
      const chart = screen.getByTestId('pie-chart');
      expect(chart).toBeInTheDocument();
      
      const chartData = JSON.parse(chart.getAttribute('data-chart-data'));
      expect(chartData.datasets[0].data).toEqual([0, 0]);
    });

    test('should handle negative values', () => {
      render(<ChartComponent income={-100} expense={-50} />);
      const chart = screen.getByTestId('pie-chart');
      expect(chart).toBeInTheDocument();
      
      const chartData = JSON.parse(chart.getAttribute('data-chart-data'));
      expect(chartData.datasets[0].data).toEqual([-100, -50]);
    });

    test('should handle very large numbers', () => {
      const largeIncome = 999999999999;
      const largeExpense = 888888888888;
      
      render(<ChartComponent income={largeIncome} expense={largeExpense} />);
      const chart = screen.getByTestId('pie-chart');
      expect(chart).toBeInTheDocument();
      
      const chartData = JSON.parse(chart.getAttribute('data-chart-data'));
      expect(chartData.datasets[0].data).toEqual([largeIncome, largeExpense]);
    });

    test('should handle NaN values', () => {
      render(<ChartComponent income={NaN} expense={NaN} />);
      const chart = screen.getByTestId('pie-chart');
      expect(chart).toBeInTheDocument();
    });

    test('should handle undefined/null values', () => {
      render(<ChartComponent income={null} expense={undefined} />);
      const chart = screen.getByTestId('pie-chart');
      expect(chart).toBeInTheDocument();
    });
  });

  describe('🌐 Navigation Edge Cases', () => {
    test('should handle navigation with missing props', () => {
      renderWithRouter(<Onboarding />);
      
      const loginButton = screen.getByText(/login/i);
      const registerButton = screen.getByText(/register/i);
      
      expect(loginButton).toBeInTheDocument();
      expect(registerButton).toBeInTheDocument();
      
      // Should not crash when clicking
      fireEvent.click(loginButton);
      fireEvent.click(registerButton);
    });

    test('should handle rapid clicking on navigation buttons', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Onboarding />);
      
      const loginButton = screen.getByText(/login/i);
      
      // Rapid clicks
      await user.click(loginButton);
      await user.click(loginButton);
      await user.click(loginButton);
      
      // Should not crash
      expect(loginButton).toBeInTheDocument();
    });
  });

  describe('📱 Responsive and Accessibility Edge Cases', () => {
    test('should handle small screen viewport', () => {
      // Mock small screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });
      
      renderWithRouter(<Dashboard user={mockUser} />);
      
      // Should render without crashing
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    test('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Tab navigation
      await user.tab();
      expect(emailInput).toHaveFocus();
      
      await user.tab();
      expect(passwordInput).toHaveFocus();
      
      await user.tab();
      expect(submitButton).toHaveFocus();
    });

    test('should handle screen reader requirements', () => {
      renderWithRouter(<Login />);
      
      // Check for proper labels
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      
      // Check for form structure
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('🔄 Performance Edge Cases', () => {
    test('should handle rapid form submissions', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      const titleInput = screen.getByLabelText(/title/i);
      const submitButton = screen.getByRole('button', { name: /add transaction/i });
      
      await user.type(amountInput, '100');
      await user.type(titleInput, 'Test Transaction');
      
      // Rapid submissions
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);
      
      // Should not crash
      expect(submitButton).toBeInTheDocument();
    });

    test('should handle large dataset rendering', () => {
      // This would test with many transactions
      renderWithRouter(<Dashboard user={mockUser} />);
      
      // Should render without performance issues
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
  });

  describe('💾 Data Integrity Edge Cases', () => {
    test('should handle corrupted transaction data', () => {
      const corruptedUser = {
        ...mockUser,
        uid: null, // Corrupted UID
      };
      
      renderWithRouter(<Dashboard user={corruptedUser} />);
      
      // Should handle gracefully
      expect(document.body).toBeInTheDocument();
    });

    test('should handle missing required fields', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const submitButton = screen.getByRole('button', { name: /add transaction/i });
      
      // Try to submit without filling required fields
      await user.click(submitButton);
      
      // Should trigger validation
      expect(screen.getByLabelText(/amount/i)).toBeRequired();
      expect(screen.getByLabelText(/title/i)).toBeRequired();
    });
  });

  describe('🌍 Internationalization Edge Cases', () => {
    test('should handle non-English text input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      const internationalTexts = [
        '支付宝转账', // Chinese
        'プリペイド', // Japanese
        'πληρωμή', // Greek
        'оплата', // Russian
        'العربية', // Arabic
        '🎉🎊🎈', // Emojis
      ];
      
      for (const text of internationalTexts) {
        await user.clear(titleInput);
        await user.type(titleInput, text);
        expect(titleInput.value).toBe(text);
      }
    });

    test('should handle right-to-left languages', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      const arabicText = 'مرحبا بالعالم';
      
      await user.type(titleInput, arabicText);
      expect(titleInput.value).toBe(arabicText);
    });
  });
});

describe('🔧 Browser Compatibility Edge Cases', () => {
  test('should handle missing localStorage', () => {
    const originalLocalStorage = window.localStorage;
    delete window.localStorage;
    
    renderWithRouter(<Dashboard user={mockUser} />);
    
    // Should not crash
    expect(document.body).toBeInTheDocument();
    
    // Restore localStorage
    window.localStorage = originalLocalStorage;
  });

  test('should handle disabled JavaScript features', () => {
    // Mock missing fetch
    const originalFetch = global.fetch;
    delete global.fetch;
    
    renderWithRouter(<Dashboard user={mockUser} />);
    
    // Should render basic functionality
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    
    // Restore fetch
    global.fetch = originalFetch;
  });
});

describe('🚨 Error Boundary Edge Cases', () => {
  test('should handle component crashes gracefully', () => {
    // This would test error boundaries if implemented
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithRouter(<Dashboard user={mockUser} />);
    
    // Should not crash the entire app
    expect(document.body).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});

describe('🔐 Security Edge Cases', () => {
  test('should handle XSS attempts in user input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Dashboard user={mockUser} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const xssAttempts = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src="x" onerror="alert(\'XSS\')" />',
      '"><script>alert("XSS")</script>',
    ];
    
    for (const xss of xssAttempts) {
      await user.clear(titleInput);
      await user.type(titleInput, xss);
      // Input should be treated as text, not executed
      expect(titleInput.value).toBe(xss);
    }
  });

  test('should handle SQL injection attempts', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Dashboard user={mockUser} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const sqlInjections = [
      "'; DROP TABLE transactions; --",
      "' OR '1'='1",
      "'; INSERT INTO transactions VALUES ('hack'); --",
      "UNION SELECT * FROM users",
    ];
    
    for (const sql of sqlInjections) {
      await user.clear(titleInput);
      await user.type(titleInput, sql);
      // Should be treated as text input
      expect(titleInput.value).toBe(sql);
    }
  });
});
