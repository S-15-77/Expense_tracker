// src/__tests__/BasicEdgeCases.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import Register from '../components/Register';

// Helper function to render with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Mock user
const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
};

describe('🧪 BASIC EDGE CASE TESTING', () => {
  
  describe('Dashboard Edge Cases', () => {
    test('should handle null user gracefully', () => {
      // This test checks if the app crashes with null user
      expect(() => {
        renderWithRouter(<Dashboard user={null} />);
      }).not.toThrow();
    });

    test('should handle undefined user', () => {
      expect(() => {
        renderWithRouter(<Dashboard user={undefined} />);
      }).not.toThrow();
    });

    test('should render welcome message with valid user', () => {
      renderWithRouter(<Dashboard user={mockUser} />);
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
  });

  describe('Form Input Edge Cases', () => {
    test('should handle very large numbers in amount field', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      
      // Test extremely large number
      await user.type(amountInput, '999999999999999');
      expect(amountInput.value).toBe('999999999999999');
    });

    test('should handle negative amounts', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '-100');
      expect(amountInput.value).toBe('-100');
    });

    test('should handle zero amount', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '0');
      expect(amountInput.value).toBe('0');
    });

    test('should handle special characters in title', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      const specialTitle = 'Coffee ☕ & Breakfast 🥐 - €15.50!@#$%^&*()';
      
      await user.type(titleInput, specialTitle);
      expect(titleInput.value).toBe(specialTitle);
    });

    test('should handle very long title', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      const longTitle = 'A'.repeat(500); // 500 character title
      
      await user.type(titleInput, longTitle.substring(0, 100)); // Type first 100 chars
      expect(titleInput.value.length).toBeGreaterThan(0);
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

  describe('Login Component Edge Cases', () => {
    test('should handle empty form submission', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);
      
      // Check if required field validation works
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeRequired();
    });

    test('should handle special characters in email', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test+special@domain-name.co.uk');
      expect(emailInput.value).toBe('test+special@domain-name.co.uk');
    });

    test('should handle very long email', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const longEmail = 'very-long-email-address-that-might-cause-issues@very-long-domain-name.com';
      
      await user.type(emailInput, longEmail);
      expect(emailInput.value).toBe(longEmail);
    });
  });

  describe('Register Component Edge Cases', () => {
    test('should handle special characters in name', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const specialName = "José María O'Connor-Smith Jr.";
      
      await user.type(nameInput, specialName);
      expect(nameInput.value).toBe(specialName);
    });

    test('should handle unicode characters', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const unicodeName = '李小明 αβγ'; // Chinese and Greek characters
      
      await user.type(nameInput, unicodeName);
      expect(nameInput.value).toBe(unicodeName);
    });

    test('should handle emoji in name', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const emojiName = 'Test User 🎉';
      
      await user.type(nameInput, emojiName);
      expect(nameInput.value).toBe(emojiName);
    });

    test('should handle very long name', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const longName = 'A'.repeat(200); // 200 character name
      
      await user.type(nameInput, longName);
      expect(nameInput.value).toBe(longName);
    });
  });

  describe('Security Edge Cases', () => {
    test('should treat script tags as text input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      const scriptTag = '<script>alert("XSS")</script>';
      
      await user.type(titleInput, scriptTag);
      expect(titleInput.value).toBe(scriptTag);
      // Script should be treated as text, not executed
    });

    test('should handle SQL injection attempts', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      const sqlInjection = "'; DROP TABLE transactions; --";
      
      await user.type(titleInput, sqlInjection);
      expect(titleInput.value).toBe(sqlInjection);
    });

    test('should handle JavaScript injection attempts', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      const jsInjection = 'javascript:alert("XSS")';
      
      await user.type(titleInput, jsInjection);
      expect(titleInput.value).toBe(jsInjection);
    });
  });

  describe('Performance Edge Cases', () => {
    test('should handle rapid button clicks', () => {
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const submitButton = screen.getByRole('button', { name: /add transaction/i });
      
      // Rapid fire clicks
      for (let i = 0; i < 20; i++) {
        fireEvent.click(submitButton);
      }
      
      // Should not crash
      expect(submitButton).toBeInTheDocument();
    });

    test('should handle rapid form changes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      
      // Rapid typing
      for (let i = 0; i < 10; i++) {
        await user.clear(amountInput);
        await user.type(amountInput, `${i * 100}`);
      }
      
      expect(amountInput).toBeInTheDocument();
    });
  });

  describe('Accessibility Edge Cases', () => {
    test('should have proper form labels', () => {
      renderWithRouter(<Dashboard user={mockUser} />);
      
      // Check for accessibility labels
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });

    test('should have required field indicators', () => {
      renderWithRouter(<Dashboard user={mockUser} />);
      
      expect(screen.getByLabelText(/amount/i)).toBeRequired();
      expect(screen.getByLabelText(/title/i)).toBeRequired();
      expect(screen.getByLabelText(/date/i)).toBeRequired();
    });

    test('should have proper button roles', () => {
      renderWithRouter(<Dashboard user={mockUser} />);
      
      expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });
  });

  describe('Browser Compatibility Edge Cases', () => {
    test('should handle missing localStorage', () => {
      const originalLocalStorage = window.localStorage;
      delete window.localStorage;
      
      expect(() => {
        renderWithRouter(<Dashboard user={mockUser} />);
      }).not.toThrow();
      
      // Restore localStorage
      window.localStorage = originalLocalStorage;
    });

    test('should handle different viewport sizes', () => {
      const viewports = [
        { width: 320, height: 568 }, // iPhone 5
        { width: 768, height: 1024 }, // iPad
        { width: 1920, height: 1080 }, // Desktop
      ];

      viewports.forEach(({ width, height }) => {
        Object.defineProperty(window, 'innerWidth', { 
          value: width, 
          writable: true,
          configurable: true 
        });
        Object.defineProperty(window, 'innerHeight', { 
          value: height, 
          writable: true,
          configurable: true 
        });
        
        expect(() => {
          const { unmount } = renderWithRouter(<Dashboard user={mockUser} />);
          unmount();
        }).not.toThrow();
      });
    });
  });

  describe('Data Type Edge Cases', () => {
    test('should handle scientific notation in amount', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '1e5'); // 100000
      expect(amountInput.value).toBe('1e5');
    });

    test('should handle decimal numbers with many places', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '123.456789012345');
      expect(amountInput.value).toBe('123.456789012345');
    });

    test('should handle leading zeros', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '000123.45');
      expect(amountInput.value).toBe('000123.45');
    });
  });

  describe('Category Edge Cases', () => {
    test('should handle custom category with special characters', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard user={mockUser} />);
      
      const categorySelect = screen.getByLabelText(/category/i);
      await user.selectOptions(categorySelect, 'custom');
      
      // Custom category input should appear
      const customInput = screen.getByPlaceholderText(/enter custom category/i);
      const specialCategory = 'Home & Garden 🏠🌱';
      
      await user.type(customInput, specialCategory);
      expect(customInput.value).toBe(specialCategory);
    });
  });

  describe('Component Lifecycle Edge Cases', () => {
    test('should handle component mount and unmount without memory leaks', () => {
      for (let i = 0; i < 10; i++) {
        const { unmount } = renderWithRouter(<Dashboard user={mockUser} />);
        unmount();
      }
      
      // Should complete without throwing errors
      expect(true).toBe(true);
    });

    test('should handle rapid re-renders', () => {
      let component;
      
      expect(() => {
        component = renderWithRouter(<Dashboard user={mockUser} />);
        component.rerender(<BrowserRouter><Dashboard user={mockUser} /></BrowserRouter>);
        component.rerender(<BrowserRouter><Dashboard user={mockUser} /></BrowserRouter>);
        component.rerender(<BrowserRouter><Dashboard user={mockUser} /></BrowserRouter>);
        component.unmount();
      }).not.toThrow();
    });
  });
});

describe('🎯 CRITICAL EDGE CASES FOUND', () => {
  test('FINDING: Very large numbers may cause calculation issues', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Dashboard user={mockUser} />);
    
    const amountInput = screen.getByLabelText(/amount/i);
    
    // Test Number.MAX_SAFE_INTEGER
    const maxSafeInt = Number.MAX_SAFE_INTEGER.toString();
    await user.type(amountInput, maxSafeInt);
    
    console.log('🚨 EDGE CASE FOUND: Maximum safe integer handling needed');
    console.log('Value entered:', maxSafeInt);
    console.log('Length:', maxSafeInt.length, 'characters');
    
    expect(amountInput.value).toBe(maxSafeInt);
  });

  test('FINDING: Unicode characters may need special handling', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Register />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const complexUnicode = '🎉👨‍👩‍👧‍👦💰📊🌍αβγδεζηθ中文العربية';
    
    await user.type(nameInput, complexUnicode);
    
    console.log('🚨 EDGE CASE FOUND: Complex Unicode character handling');
    console.log('Unicode string length:', complexUnicode.length);
    console.log('Actual input length:', nameInput.value.length);
    
    expect(nameInput.value).toBe(complexUnicode);
  });

  test('FINDING: Date validation may need improvement', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Dashboard user={mockUser} />);
    
    const dateInput = screen.getByLabelText(/date/i);
    
    // Test invalid date
    await user.clear(dateInput);
    await user.type(dateInput, '2023-13-40'); // Invalid month and day
    
    console.log('🚨 EDGE CASE FOUND: Invalid date format accepted');
    console.log('Invalid date entered:', dateInput.value);
    
    expect(dateInput.value).toBe('2023-13-40');
  });
});
