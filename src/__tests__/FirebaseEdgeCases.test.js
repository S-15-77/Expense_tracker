// src/__tests__/FirebaseEdgeCases.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import Register from '../components/Register';

// Import Firebase mocks
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  query,
  where,
} from 'firebase/firestore';

describe('🔥 FIREBASE EDGE CASES', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('🔐 Authentication Edge Cases', () => {
    test('should handle Firebase auth service unavailable', async () => {
      const user = userEvent.setup();
      
      // Mock Firebase service unavailable
      signInWithEmailAndPassword.mockRejectedValue({
        code: 'auth/unavailable',
        message: 'The service is currently unavailable.',
      });

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Should handle service unavailable gracefully
      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalled();
      });
    });

    test('should handle network connectivity issues', async () => {
      const user = userEvent.setup();
      
      // Mock network error
      signInWithEmailAndPassword.mockRejectedValue({
        code: 'auth/network-request-failed',
        message: 'A network error has occurred.',
      });

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalled();
      });
    });

    test('should handle quota exceeded errors', async () => {
      const user = userEvent.setup();
      
      // Mock quota exceeded
      createUserWithEmailAndPassword.mockRejectedValue({
        code: 'auth/quota-exceeded',
        message: 'The quota for this operation has been exceeded.',
      });

      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalled();
      });
    });

    test('should handle invalid API key errors', async () => {
      const user = userEvent.setup();
      
      // Mock invalid API key
      signInWithEmailAndPassword.mockRejectedValue({
        code: 'auth/invalid-api-key',
        message: 'Your API key is invalid.',
      });

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalled();
      });
    });

    test('should handle password reset edge cases', async () => {
      const user = userEvent.setup();
      
      // Mock various password reset errors
      const errors = [
        { code: 'auth/user-not-found', message: 'User not found' },
        { code: 'auth/invalid-email', message: 'Invalid email' },
        { code: 'auth/too-many-requests', message: 'Too many requests' },
      ];

      for (const error of errors) {
        sendPasswordResetEmail.mockRejectedValueOnce(error);
        
        render(
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        );

        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, 'test@example.com');
        
        const resetButton = screen.getByText(/forgot password/i);
        await user.click(resetButton);

        await waitFor(() => {
          expect(sendPasswordResetEmail).toHaveBeenCalled();
        });
        
        // Clear mocks for next iteration
        jest.clearAllMocks();
      }
    });
  });

  describe('🗄️ Firestore Edge Cases', () => {
    const mockUser = {
      uid: 'test-user-123',
      email: 'test@example.com',
    };

    test('should handle Firestore permission errors', async () => {
      const user = userEvent.setup();
      
      // Mock permission denied
      addDoc.mockRejectedValue({
        code: 'permission-denied',
        message: 'Missing or insufficient permissions.',
      });

      render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      const amountInput = screen.getByLabelText(/amount/i);
      const titleInput = screen.getByLabelText(/title/i);
      const submitButton = screen.getByRole('button', { name: /add transaction/i });

      await user.type(amountInput, '100');
      await user.type(titleInput, 'Test Transaction');
      await user.click(submitButton);

      await waitFor(() => {
        expect(addDoc).toHaveBeenCalled();
      });
    });

    test('should handle Firestore quota limits', async () => {
      const user = userEvent.setup();
      
      // Mock quota exceeded
      addDoc.mockRejectedValue({
        code: 'resource-exhausted',
        message: 'Quota exceeded.',
      });

      render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      const amountInput = screen.getByLabelText(/amount/i);
      const titleInput = screen.getByLabelText(/title/i);
      const submitButton = screen.getByRole('button', { name: /add transaction/i });

      await user.type(amountInput, '100');
      await user.type(titleInput, 'Test Transaction');
      await user.click(submitButton);

      await waitFor(() => {
        expect(addDoc).toHaveBeenCalled();
      });
    });

    test('should handle Firestore connection loss', () => {
      // Mock connection loss
      onSnapshot.mockImplementation((query, callback, errorCallback) => {
        errorCallback({
          code: 'unavailable',
          message: 'The service is currently unavailable.',
        });
        return jest.fn(); // unsubscribe function
      });

      render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      // Should handle connection loss gracefully
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    test('should handle large document operations', async () => {
      const user = userEvent.setup();
      
      // Mock document too large error
      addDoc.mockRejectedValue({
        code: 'invalid-argument',
        message: 'Document too large.',
      });

      render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      const amountInput = screen.getByLabelText(/amount/i);
      const titleInput = screen.getByLabelText(/title/i);
      const submitButton = screen.getByRole('button', { name: /add transaction/i });

      await user.type(amountInput, '100');
      // Very large title
      await user.type(titleInput, 'A'.repeat(10000));
      await user.click(submitButton);

      await waitFor(() => {
        expect(addDoc).toHaveBeenCalled();
      });
    });

    test('should handle concurrent write conflicts', async () => {
      const user = userEvent.setup();
      
      // Mock aborted transaction
      updateDoc.mockRejectedValue({
        code: 'aborted',
        message: 'The transaction was aborted.',
      });

      render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      // Should handle concurrent writes gracefully
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    test('should handle Firestore security rule violations', async () => {
      const user = userEvent.setup();
      
      // Mock security rule violation
      addDoc.mockRejectedValue({
        code: 'permission-denied',
        message: 'False for \'create\' @ L7',
      });

      render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      const amountInput = screen.getByLabelText(/amount/i);
      const titleInput = screen.getByLabelText(/title/i);
      const submitButton = screen.getByRole('button', { name: /add transaction/i });

      await user.type(amountInput, '100');
      await user.type(titleInput, 'Test Transaction');
      await user.click(submitButton);

      await waitFor(() => {
        expect(addDoc).toHaveBeenCalled();
      });
    });
  });

  describe('🔄 Real-time Updates Edge Cases', () => {
    const mockUser = {
      uid: 'test-user-123',
      email: 'test@example.com',
    };

    test('should handle rapid real-time updates', () => {
      let snapshotCallback;
      
      // Mock rapid updates
      onSnapshot.mockImplementation((query, callback) => {
        snapshotCallback = callback;
        return jest.fn(); // unsubscribe function
      });

      render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      // Simulate rapid updates
      for (let i = 0; i < 100; i++) {
        if (snapshotCallback) {
          snapshotCallback({
            docs: [
              {
                id: `doc-${i}`,
                data: () => ({
                  amount: i * 10,
                  type: 'expense',
                  category: 'Test',
                  title: `Transaction ${i}`,
                  userId: mockUser.uid,
                }),
              },
            ],
          });
        }
      }

      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    test('should handle corrupted real-time data', () => {
      let snapshotCallback;
      
      onSnapshot.mockImplementation((query, callback) => {
        snapshotCallback = callback;
        return jest.fn();
      });

      render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      // Simulate corrupted data
      if (snapshotCallback) {
        snapshotCallback({
          docs: [
            {
              id: 'corrupted-doc',
              data: () => ({
                amount: null,
                type: undefined,
                category: {},
                title: [],
                userId: mockUser.uid,
              }),
            },
          ],
        });
      }

      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    test('should handle listener cleanup on unmount', () => {
      const unsubscribeMock = jest.fn();
      
      onSnapshot.mockReturnValue(unsubscribeMock);

      const { unmount } = render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      unmount();

      // Should call unsubscribe
      expect(unsubscribeMock).toHaveBeenCalled();
    });
  });

  describe('📊 Data Migration Edge Cases', () => {
    test('should handle schema version mismatches', () => {
      const mockUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
      };

      // Mock old data format
      onSnapshot.mockImplementation((query, callback) => {
        callback({
          docs: [
            {
              id: 'old-format-doc',
              data: () => ({
                // Old format without required fields
                cost: 100, // old field name
                kind: 'expense', // old field name
                userId: mockUser.uid,
              }),
            },
          ],
        });
        return jest.fn();
      });

      render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      // Should handle old format gracefully
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    test('should handle missing user data', () => {
      const mockUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
      };

      // Mock empty user document
      onSnapshot.mockImplementation((query, callback) => {
        callback({
          docs: [],
        });
        return jest.fn();
      });

      render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      // Should handle missing data gracefully
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
  });

  describe('🌐 Offline/Online Edge Cases', () => {
    test('should handle offline data persistence', () => {
      const mockUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
      };

      // Mock offline scenario
      addDoc.mockRejectedValue({
        code: 'unavailable',
        message: 'The service is currently unavailable.',
      });

      render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      // Should handle offline state
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    test('should handle coming back online', () => {
      const mockUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
      };

      // Mock coming back online
      onSnapshot.mockImplementation((query, callback) => {
        // First call - offline/empty
        callback({ docs: [] });
        
        // Second call - online with data
        setTimeout(() => {
          callback({
            docs: [
              {
                id: 'online-doc',
                data: () => ({
                  amount: 100,
                  type: 'expense',
                  category: 'Test',
                  title: 'Online Transaction',
                  userId: mockUser.uid,
                }),
              },
            ],
          });
        }, 100);
        
        return jest.fn();
      });

      render(
        <BrowserRouter>
          <Dashboard user={mockUser} />
        </BrowserRouter>
      );

      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
  });
});
