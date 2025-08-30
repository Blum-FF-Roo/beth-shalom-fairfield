import { render, screen, waitFor } from '@testing-library/react';
import ProgramsSection from '../ProgramsSection';
import { useContentRefresh } from '@/hooks/useContentRefresh';

// Mock the useContentRefresh hook
jest.mock('@/hooks/useContentRefresh');
const mockUseContentRefresh = useContentRefresh as jest.MockedFunction<typeof useContentRefresh>;

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('ProgramsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows High Holy Days when toggle is set to highHolyDays', async () => {
    // Mock the hook to return 'highHolyDays'
    mockUseContentRefresh.mockReturnValue(['highHolyDays', false]);

    render(<ProgramsSection />);

    await waitFor(() => {
      expect(screen.getByText('High Holy Days')).toBeInTheDocument();
      expect(screen.queryByText('Passover')).not.toBeInTheDocument();
    });
  });

  test('shows Passover when toggle is set to passover', async () => {
    // Mock the hook to return 'passover'
    mockUseContentRefresh.mockReturnValue(['passover', false]);

    render(<ProgramsSection />);

    await waitFor(() => {
      expect(screen.getByText('Passover')).toBeInTheDocument();
      expect(screen.queryByText('High Holy Days')).not.toBeInTheDocument();
    });
  });

  test('defaults to High Holy Days when toggle value is null', async () => {
    // Mock the hook to return null (content not found)
    mockUseContentRefresh.mockReturnValue([null, false]);

    render(<ProgramsSection />);

    await waitFor(() => {
      expect(screen.getByText('High Holy Days')).toBeInTheDocument();
      expect(screen.queryByText('Passover')).not.toBeInTheDocument();
    });
  });

  test('shows loading state when content is loading', async () => {
    // Mock the hook to return loading state
    mockUseContentRefresh.mockReturnValue([null, true]);

    render(<ProgramsSection />);

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  test('uses correct content key for toggle setting', () => {
    mockUseContentRefresh.mockReturnValue(['highHolyDays', false]);

    render(<ProgramsSection />);

    // Verify the hook was called with the correct key
    expect(mockUseContentRefresh).toHaveBeenCalledWith('programs_toggle_setting');
  });

  test('always shows Shabbat Services as first program', async () => {
    mockUseContentRefresh.mockReturnValue(['passover', false]);

    render(<ProgramsSection />);

    await waitFor(() => {
      expect(screen.getByText('Shabbat Services')).toBeInTheDocument();
    });
  });
});