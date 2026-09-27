import React from 'react';
import { render, screen } from '@testing-library/react';
import TzedakahPage from '../page';
import { CartProvider } from '@/app/utils/CartContext';

function renderPage() {
  return render(
    <CartProvider>
      <TzedakahPage />
    </CartProvider>
  );
}

describe('TzedakahPage', () => {
  test('renders tzedakah page with main heading', () => {
    renderPage();

    expect(screen.getByText('TZEDAKAH/DONATIONS')).toBeInTheDocument();
    expect(screen.getByText('Temple Beth Shalom values your contribution to any of its funds')).toBeInTheDocument();
  });

  test('displays tzedakah fund description', () => {
    renderPage();

    expect(screen.getByText('Tzedakah Fund')).toBeInTheDocument();
    expect(screen.getByText('"Whosoever practices Tzedakah finds life, prosperity, and honor." Talmud')).toBeInTheDocument();
  });

  test('shows donation now section with amount picker', () => {
    renderPage();

    expect(screen.getByText('Donate Now')).toBeInTheDocument();
    expect(screen.getByText('Support our congregation with a secure online donation through PayPal')).toBeInTheDocument();
    expect(screen.getByText('Select Donation Amount')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
  });

  test('displays donation funds information', () => {
    renderPage();

    expect(screen.getByText('Donation Funds')).toBeInTheDocument();
    expect(screen.getByText(/General Fund:/)).toBeInTheDocument();
    expect(screen.getByText(/Yahrzeit Contributions:/)).toBeInTheDocument();
    expect(screen.getByText(/Tzedakah\/Tikkun Olam Fund:/)).toBeInTheDocument();
    expect(screen.getByText(/Building Fund:/)).toBeInTheDocument();
    expect(screen.getByText(/Library Fund:/)).toBeInTheDocument();
  });

  test('displays honor a third party section', () => {
    renderPage();

    expect(screen.getByText('Honor a Third Party')).toBeInTheDocument();
    expect(screen.getByText(/A minimum gift of chai/)).toBeInTheDocument();
  });

  test('displays mail donation instructions', () => {
    renderPage();

    expect(screen.getByText('Mail Your Donation')).toBeInTheDocument();
    expect(screen.getByText('Congregation Beth Shalom')).toBeInTheDocument();
    expect(screen.getByText('Location: 308 South B Street')).toBeInTheDocument();
    expect(screen.getByText('Fairfield, Iowa 52556')).toBeInTheDocument();
  });

  test('displays biblical quote', () => {
    renderPage();

    expect(screen.getByText('"In Tzedakah\'s way is Life; on its path is immortality." — Proverbs 12:28')).toBeInTheDocument();
  });
});
