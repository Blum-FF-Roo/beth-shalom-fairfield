import { render, screen } from '@testing-library/react';
import HomePage from '../page';

describe('Under construction landing page', () => {
  it('shows the under construction heading', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /under construction/i })
    ).toBeInTheDocument();
  });

  it('identifies the congregation', () => {
    render(<HomePage />);

    expect(screen.getByText(/beth shalom fairfield/i)).toBeInTheDocument();
  });

  it('exposes no navigation into the rest of the site', () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll('a')).toHaveLength(0);
  });
});
