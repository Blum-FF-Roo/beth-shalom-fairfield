import React from 'react';
import { render, screen } from '@testing-library/react';
import TzedakahPage from '../page';

// Mock PayPalProvider to avoid PayPal SDK issues in tests
jest.mock('../../components/PayPalProvider', () => {
  return function MockPayPalProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

// Mock the ToastContext to avoid provider issues in tests
jest.mock('../../utils/ToastContext', () => ({
  useToast: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
  }),
}));

describe('TzedakahPage', () => {
  test('renders tzedakah page with main heading', () => {
    render(<TzedakahPage />);
    
    expect(screen.getByText('TZEDAKAH/DONATIONS')).toBeInTheDocument();
    expect(screen.getByText('Temple Beth Shalom values your contribution to any of its funds')).toBeInTheDocument();
  });

  test('displays tzedakah fund description', () => {
    render(<TzedakahPage />);
    
    expect(screen.getByText('Tzedakah Fund')).toBeInTheDocument();
    expect(screen.getByText('"Whosoever practices Tzedakah finds life, prosperity, and honor." Talmud')).toBeInTheDocument();
  });

  test('shows donation now section with PayPal component', () => {
    render(<TzedakahPage />);
    
    expect(screen.getByText('Donate Now')).toBeInTheDocument();
    expect(screen.getByText('Support our congregation with a secure online donation through PayPal')).toBeInTheDocument();
    
    // PayPal donation component should be rendered
    expect(screen.getByText('Select Donation Amount')).toBeInTheDocument();
  });

  test('displays donation funds information', () => {
    render(<TzedakahPage />);
    
    expect(screen.getByText('Donation Funds')).toBeInTheDocument();
    expect(screen.getByText(/General Fund:/)).toBeInTheDocument();
    expect(screen.getByText(/Yahrzeit Contributions:/)).toBeInTheDocument();
    expect(screen.getByText(/Tzedakah\/Tikkun Olam Fund:/)).toBeInTheDocument();
    expect(screen.getByText(/Building Fund:/)).toBeInTheDocument();
    expect(screen.getByText(/Library Fund:/)).toBeInTheDocument();
  });

  test('displays honor a third party section', () => {
    render(<TzedakahPage />);
    
    expect(screen.getByText('Honor a Third Party')).toBeInTheDocument();
    expect(screen.getByText(/A minimum gift of chai/)).toBeInTheDocument();
  });

  test('displays mail donation instructions', () => {
    render(<TzedakahPage />);
    
    expect(screen.getByText('Mail Your Donation')).toBeInTheDocument();
    expect(screen.getByText('Congregation Beth Shalom')).toBeInTheDocument();
    expect(screen.getByText('Location: 308 South B Street')).toBeInTheDocument();
    expect(screen.getByText('Fairfield, Iowa 52556')).toBeInTheDocument();
  });

  test('displays biblical quote', () => {
    render(<TzedakahPage />);
    
    expect(screen.getByText('"In Tzedakah\'s way is Life; on its path is immortality." — Proverbs 12:28')).toBeInTheDocument();
  });

  test('includes personal message functionality in PayPal donation', () => {
    render(<TzedakahPage />);
    
    // Verify personal message input is present (from PayPalDonation component)
    expect(screen.getByText('Personal Message (Optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a personal message that will be visible to synagogue staff...')).toBeInTheDocument();
  });
});