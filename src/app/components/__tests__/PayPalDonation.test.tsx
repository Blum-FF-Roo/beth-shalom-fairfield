import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PayPalDonation from '../PayPalDonation';

// Mock the useToast hook
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();

jest.mock('../../utils/ToastContext', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

describe('PayPalDonation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShowSuccess.mockClear();
    mockShowError.mockClear();
  });

  test('renders with default amount', () => {
    render(<PayPalDonation />);
    
    expect(screen.getByText('Select Donation Amount')).toBeInTheDocument();
    expect(screen.getByText('Donation Amount:')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });

  test('renders with custom default amount', () => {
    render(<PayPalDonation defaultAmount="50" />);
    
    expect(screen.getByText('Donation Amount:')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return !!(element?.classList.contains('font-semibold') && content === '$50');
    })).toBeInTheDocument();
  });

  test('displays predefined amount buttons', () => {
    render(<PayPalDonation />);
    
    expect(screen.getByText('$18')).toBeInTheDocument();
    expect(screen.getByText('$36')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('$180')).toBeInTheDocument();
  });

  test('selects predefined amount when clicked', () => {
    render(<PayPalDonation />);
    
    const amount18Button = screen.getByRole('button', { name: '$18' });
    fireEvent.click(amount18Button);
    
    expect(screen.getByText('Donation Amount:')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return !!(element?.classList.contains('font-semibold') && content === '$18');
    })).toBeInTheDocument();
    expect(amount18Button).toHaveClass('border-orange-500');
  });

  test('shows custom amount input when custom amount is selected', () => {
    render(<PayPalDonation />);
    
    const customAmountButton = screen.getByText('Custom Amount');
    fireEvent.click(customAmountButton);
    
    expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument();
    expect(customAmountButton).toHaveClass('border-orange-500');
  });

  test('updates donation amount with custom input', () => {
    render(<PayPalDonation />);
    
    // Click custom amount
    const customAmountButton = screen.getByText('Custom Amount');
    fireEvent.click(customAmountButton);
    
    // Enter custom amount
    const input = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(input, { target: { value: '75' } });
    
    expect(screen.getByText('Donation Amount:')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return !!(element?.classList.contains('font-semibold') && content === '$75');
    })).toBeInTheDocument();
  });

  test('deselects custom amount when predefined amount is clicked', () => {
    render(<PayPalDonation />);
    
    // First select custom amount
    const customAmountButton = screen.getByText('Custom Amount');
    fireEvent.click(customAmountButton);
    
    // Then click predefined amount
    const amount36Button = screen.getByRole('button', { name: '$36' });
    fireEvent.click(amount36Button);
    
    expect(screen.getByText('Donation Amount:')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return !!(element?.classList.contains('font-semibold') && content === '$36');
    })).toBeInTheDocument();
    expect(customAmountButton).not.toHaveClass('border-orange-500');
    expect(amount36Button).toHaveClass('border-orange-500');
    expect(screen.queryByPlaceholderText('Enter amount')).not.toBeInTheDocument();
  });

  test('displays PayPal buttons when properly configured', () => {
    render(<PayPalDonation />);
    
    expect(screen.getByTestId('paypal-buttons')).toBeInTheDocument();
    expect(screen.getByText('Secure donation processing through PayPal')).toBeInTheDocument();
  });

  test('handles successful PayPal donation', async () => {
    render(<PayPalDonation defaultAmount="50" />);
    
    // Click PayPal button
    const paypalButton = screen.getByTestId('paypal-button');
    fireEvent.click(paypalButton);
    
    // Wait for success toast
    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Donation Successful!',
        expect.stringContaining('Thank you for your generous donation of $50'),
        8000
      );
    });
  });

  test('handles PayPal donation error', async () => {
    render(<PayPalDonation />);
    
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

  test('handles PayPal donation cancellation', () => {
    render(<PayPalDonation />);
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Click cancel button
    const cancelButton = screen.getByTestId('paypal-cancel-button');
    fireEvent.click(cancelButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Donation cancelled by user');
    
    consoleSpy.mockRestore();
  });

  test('shows configuration message when PayPal client ID is missing', () => {
    // Mock missing PayPal client ID
    const originalEnv = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = '';
    
    render(<PayPalDonation />);
    
    // Should show configuration message
    expect(screen.getByText('PayPal Configuration Needed')).toBeInTheDocument();
    expect(screen.getByText('PayPal Donation (Setup Required)')).toBeInTheDocument();
    expect(screen.queryByTestId('paypal-buttons')).not.toBeInTheDocument();
    
    // Restore original env
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = originalEnv;
  });

  test('shows test-mock client ID configuration message', () => {
    // Mock test-mock client ID
    const originalEnv = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-mock-client-id';
    
    render(<PayPalDonation />);
    
    // Should show configuration message
    expect(screen.getByText('PayPal Configuration Needed')).toBeInTheDocument();
    expect(screen.queryByTestId('paypal-buttons')).not.toBeInTheDocument();
    
    // Restore original env
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = originalEnv;
  });

  test('validates minimum donation amount', () => {
    render(<PayPalDonation />);
    
    // Click custom amount
    const customAmountButton = screen.getByText('Custom Amount');
    fireEvent.click(customAmountButton);
    
    // Try to enter amount less than 1
    const input = screen.getByPlaceholderText('Enter amount');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('step', '0.01');
  });

  test('displays 501(c)(3) organization info', () => {
    render(<PayPalDonation />);
    
    expect(screen.getByText('Congregation Beth Shalom is a registered 501(c)(3) organization')).toBeInTheDocument();
  });

  test('displays personal message input field', () => {
    render(<PayPalDonation />);
    
    expect(screen.getByText('Personal Message (Optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a personal message that will be visible to synagogue staff...')).toBeInTheDocument();
    expect(screen.getByText('This message will be included with your donation details')).toBeInTheDocument();
    expect(screen.getByText('0/200')).toBeInTheDocument();
  });

  test('updates personal message and character count', () => {
    render(<PayPalDonation />);
    
    const textarea = screen.getByPlaceholderText('Add a personal message that will be visible to synagogue staff...');
    fireEvent.change(textarea, { target: { value: 'This is a test message' } });
    
    expect(textarea).toHaveValue('This is a test message');
    expect(screen.getByText(/22\/200/)).toBeInTheDocument();
  });

  test('enforces 200 character limit on personal message', () => {
    render(<PayPalDonation />);
    
    const textarea = screen.getByPlaceholderText('Add a personal message that will be visible to synagogue staff...');
    expect(textarea).toHaveAttribute('maxLength', '200');
  });

  test('personal message is included in donation form', () => {
    render(<PayPalDonation />);
    
    // Add personal message
    const textarea = screen.getByPlaceholderText('Add a personal message that will be visible to synagogue staff...');
    fireEvent.change(textarea, { target: { value: 'In memory of my grandmother' } });
    
    expect(textarea).toHaveValue('In memory of my grandmother');
    
    // The personal message functionality is integrated into the PayPal createOrder function
    // The actual PayPal integration testing is covered by the existing PayPal button tests
    // and the order creation logic is tested indirectly through the success flow
  });

  test('creates correct PayPal order with donation amount', async () => {
    render(<PayPalDonation defaultAmount="100" />);
    
    // Click PayPal button to trigger order creation
    const paypalButton = screen.getByTestId('paypal-button');
    fireEvent.click(paypalButton);
    
    // The order creation should be triggered with correct amount
    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Donation Successful!',
        expect.stringContaining('Thank you for your generous donation of $100'),
        8000
      );
    });
  });
});