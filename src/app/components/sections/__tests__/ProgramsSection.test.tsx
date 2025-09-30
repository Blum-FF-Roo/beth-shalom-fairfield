import { render, screen, waitFor } from '@testing-library/react';
import ProgramsSection from '../ProgramsSection';
import { useQuery } from '@tanstack/react-query';

// Mock TanStack Query
jest.mock('@tanstack/react-query');
const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

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
    // Mock useQuery to return 'highHolyDays'
    mockUseQuery.mockReturnValue({
      data: { content: 'highHolyDays' },
      isLoading: false,
      error: null,
      isError: false,
      refetch: jest.fn(),
      isSuccess: true,
      status: 'success' as const,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isPending: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetchError: false,
      isStale: false,
      fetchStatus: 'idle' as const,
      failureReason: null,
      isInitialLoading: false,
      isPaused: false,
      isEnabled: true,
      promise: Promise.resolve(),
    } as unknown as ReturnType<typeof useQuery>);

    render(<ProgramsSection />);

    await waitFor(() => {
      expect(screen.getByText('High Holy Days')).toBeInTheDocument();
      expect(screen.queryByText('Passover')).not.toBeInTheDocument();
    });
  });

  test('shows Passover when toggle is set to passover', async () => {
    // Mock useQuery to return 'passover'
    mockUseQuery.mockReturnValue({
      data: { content: 'passover' },
      isLoading: false,
      error: null,
      isError: false,
      refetch: jest.fn(),
      isSuccess: true,
      status: 'success' as const,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isPending: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetchError: false,
      isStale: false,
      fetchStatus: 'idle' as const,
      failureReason: null,
      isInitialLoading: false,
      isPaused: false,
      isEnabled: true,
      promise: Promise.resolve(),
    } as unknown as ReturnType<typeof useQuery>);

    render(<ProgramsSection />);

    await waitFor(() => {
      expect(screen.getByText('Passover')).toBeInTheDocument();
      expect(screen.queryByText('High Holy Days')).not.toBeInTheDocument();
    });
  });

  test('defaults to High Holy Days when toggle value is null', async () => {
    // Mock useQuery to return null (content not found)
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isError: false,
      refetch: jest.fn(),
      isSuccess: true,
      status: 'success' as const,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isPending: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetchError: false,
      isStale: false,
      fetchStatus: 'idle' as const,
      failureReason: null,
      isInitialLoading: false,
      isPaused: false,
      isEnabled: true,
      promise: Promise.resolve(),
    } as unknown as ReturnType<typeof useQuery>);

    render(<ProgramsSection />);

    await waitFor(() => {
      expect(screen.getByText('High Holy Days')).toBeInTheDocument();
      expect(screen.queryByText('Passover')).not.toBeInTheDocument();
    });
  });

  test('shows loading state when content is loading', async () => {
    // Mock useQuery to return loading state
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      isError: false,
      refetch: jest.fn(),
      isSuccess: false,
      status: 'pending' as const,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: true,
      isRefetching: false,
      isLoadingError: false,
      isPending: true,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetchError: false,
      isStale: false,
      fetchStatus: 'fetching' as const,
      failureReason: null,
      isInitialLoading: true,
      isPaused: false,
      isEnabled: true,
      promise: Promise.resolve(),
    } as unknown as ReturnType<typeof useQuery>);

    render(<ProgramsSection />);

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  test('always shows Shabbat Services as first program', async () => {
    mockUseQuery.mockReturnValue({
      data: { content: 'passover' },
      isLoading: false,
      error: null,
      isError: false,
      refetch: jest.fn(),
      isSuccess: true,
      status: 'success' as const,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isPending: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetchError: false,
      isStale: false,
      fetchStatus: 'idle' as const,
      failureReason: null,
      isInitialLoading: false,
      isPaused: false,
      isEnabled: true,
      promise: Promise.resolve(),
    } as unknown as ReturnType<typeof useQuery>);

    render(<ProgramsSection />);

    await waitFor(() => {
      expect(screen.getByText('Shabbat Services')).toBeInTheDocument();
    });
  });
});