import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MembershipCart from '../MembershipCart';

// Mock PayPalProvider
const MockPayPalProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="paypal-provider">{children}</div>;
};

jest.mock('../PayPalProvider', () => ({
  __esModule: true,
  default: MockPayPalProvider,
}));

// Mock the useToast hook
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();

jest.mock('../../utils/ToastContext', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

describe('MembershipCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShowSuccess.mockClear();
    mockShowError.mockClear();
  });

  test('renders membership options', () => {
    render(<MembershipCart />);
    
    expect(screen.getByText('Select Your Membership')).toBeInTheDocument();
    expect(screen.getByText('Sustaining Membership')).toBeInTheDocument();
    expect(screen.getByText('Sponsoring Membership')).toBeInTheDocument();
    expect(screen.getByText('Family Membership')).toBeInTheDocument();
    expect(screen.getByText('Single Membership')).toBeInTheDocument();
    expect(screen.getByText('College Faculty, Staff Family')).toBeInTheDocument();
    expect(screen.getByText('College Faculty, Staff Single')).toBeInTheDocument();
  });

  test('shows correct prices for membership options', () => {
    render(<MembershipCart />);
    
    expect(screen.getByText('$1000')).toBeInTheDocument(); // Sustaining
    expect(screen.getByText('$500')).toBeInTheDocument();  // Sponsoring
    expect(screen.getByText('$295')).toBeInTheDocument();  // Family
    expect(screen.getByText('$165')).toBeInTheDocument();  // Single
    expect(screen.getByText('$145')).toBeInTheDocument();  // Faculty Family
    expect(screen.getByText('$95')).toBeInTheDocument();   // Faculty Single
  });

  test('adds items to cart when Add to Cart button is clicked', () => {
    render(<MembershipCart />);
    
    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]); // Add Sustaining Membership
    
    expect(screen.getByText('Your Cart (1 items)')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
    // Check for total price in the total section
    const totalSection = screen.getByText('Total:').closest('div');
    expect(totalSection).toHaveTextContent('$1000');
  });

  test('shows and hides cart details with chevron icons', () => {
    render(<MembershipCart />);
    
    // Add item to cart first
    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);
    
    // Initially cart details should be hidden - check for cart item details
    expect(screen.queryByText('$1000 each')).not.toBeInTheDocument();
    
    // Click show details
    const showDetailsButton = screen.getByRole('button', { name: /show details/i });
    expect(showDetailsButton).toBeInTheDocument();
    
    fireEvent.click(showDetailsButton);
    
    // Cart details should now be visible
    expect(screen.getByText('Hide Details')).toBeInTheDocument();
    expect(screen.getByText('$1000 each')).toBeInTheDocument();
    
    // Click hide details
    const hideDetailsButton = screen.getByRole('button', { name: /hide details/i });
    fireEvent.click(hideDetailsButton);
    
    // Cart details should be hidden again
    expect(screen.getByText('Show Details')).toBeInTheDocument();
  });

  test('updates quantity of items in cart', () => {
    render(<MembershipCart />);
    
    // Add item to cart
    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);
    
    // Show cart details
    const showDetailsButton = screen.getByRole('button', { name: /show details/i });
    fireEvent.click(showDetailsButton);
    
    // Check initial quantity
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Increase quantity
    const plusButton = screen.getByTestId('plus-button');
    fireEvent.click(plusButton);
    
    expect(screen.getByText('Your Cart (2 items)')).toBeInTheDocument();
    // Check for doubled total
    const totalSection = screen.getByText('Total:').closest('div');
    expect(totalSection).toHaveTextContent('$2000');
  });

  test('removes items from cart', () => {
    render(<MembershipCart />);
    
    // Add item to cart
    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);
    
    // Show cart details
    const showDetailsButton = screen.getByRole('button', { name: /show details/i });
    fireEvent.click(showDetailsButton);
    
    // Remove item
    const removeButton = screen.getByTestId('remove-button');
    fireEvent.click(removeButton);
    
    // Cart should be empty
    expect(screen.getByText('Your cart is empty. Select a membership level above to get started.')).toBeInTheDocument();
  });

  test('displays PayPal buttons when cart has items', () => {
    render(<MembershipCart />);
    
    // Add item to cart
    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);
    
    // PayPal buttons should be visible
    expect(screen.getByTestId('paypal-buttons')).toBeInTheDocument();
    expect(screen.getByText('Ready to Complete Your Membership?')).toBeInTheDocument();
  });

  test('handles PayPal payment success', async () => {
    render(<MembershipCart />);
    
    // Add item to cart
    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);
    
    // Click PayPal button
    const paypalButton = screen.getByTestId('paypal-button');
    fireEvent.click(paypalButton);
    
    // Wait for success toast
    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Membership Purchase Successful!',
        expect.stringContaining('Thank you'),
        8000
      );
    });
    
    // Should show success screen instead of empty cart
    expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
    expect(screen.getByText(/Thank you.*Test User/)).toBeInTheDocument();
  });

  test('handles PayPal payment error', async () => {
    render(<MembershipCart />);
    
    // Add item to cart
    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);
    
    // Click error button
    const errorButton = screen.getByTestId('paypal-error-button');
    fireEvent.click(errorButton);
    
    // Wait for error toast
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        'PayPal Error',
        'There was an error with PayPal. Please try again or contact us directly for assistance.'
      );
    });
  });

  test('shows configuration message when PayPal client ID is missing', () => {
    // Mock missing PayPal client ID
    const originalEnv = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = '';
    
    render(<MembershipCart />);
    
    // Add item to cart
    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);
    
    // Should show configuration message
    expect(screen.getByText('PayPal Configuration Needed')).toBeInTheDocument();
    expect(screen.getByText('PayPal Checkout (Setup Required)')).toBeInTheDocument();
    
    // Restore original env
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = originalEnv;
  });

  test('calculates correct total for multiple items', () => {
    render(<MembershipCart />);
    
    const addToCartButtons = screen.getAllByText('Add to Cart');
    
    // Add multiple items
    fireEvent.click(addToCartButtons[0]); // $1000
    fireEvent.click(addToCartButtons[1]); // $500
    fireEvent.click(addToCartButtons[2]); // $295
    
    expect(screen.getByText('Your Cart (3 items)')).toBeInTheDocument();
    // Check total
    const totalSection = screen.getByText('Total:').closest('div');
    expect(totalSection).toHaveTextContent('$1795');
  });
});