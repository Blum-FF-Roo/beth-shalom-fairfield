import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import EditContentPage from '../[id]/page';
import { getContentSectionById } from '@/app/utils/firebase-operations';
import { useAuth } from '@/app/utils/AuthContext';
import { useToast } from '@/app/utils/ToastContext';

// Mock all dependencies
jest.mock('next/navigation');
jest.mock('@/app/utils/firebase-operations');
jest.mock('@/app/utils/AuthContext');
jest.mock('@/app/utils/ToastContext');
jest.mock('@tanstack/react-query');
jest.mock('@/app/components/auth/ProtectedRoute', () => {
  return function ProtectedRoute({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});
jest.mock('@/app/components/admin/RichTextEditor', () => {
  return function RichTextEditor(props: React.ComponentProps<'textarea'>) {
    return <textarea {...props} data-testid="rich-text-editor" />;
  };
});
jest.mock('@/app/components/admin/ImageUpload', () => {
  return function ImageUpload(props: React.ComponentProps<'input'>) {
    return <input {...props} data-testid="image-upload" type="file" />;
  };
});

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockGetContentSectionById = getContentSectionById as jest.MockedFunction<typeof getContentSectionById>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockUseMutation = useMutation as jest.MockedFunction<typeof useMutation>;
const mockUseQueryClient = useQueryClient as jest.MockedFunction<typeof useQueryClient>;


describe('Admin Toggle Functionality', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockShowSuccess = jest.fn();
  const mockShowError = jest.fn();

  const mockProgramsToggleSection = {
    id: 'home-programs-toggle',
    key: 'programs_toggle_setting',
    title: 'Programs Toggle Setting',
    description: 'Toggle between High Holy Days and Passover for the second program',
    type: 'toggle' as const,
    category: 'home' as const,
    content: 'highHolyDays',
    isEditable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'test-user',
    updatedBy: 'test-user'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    const mockQueryClient = {
      invalidateQueries: jest.fn(),
      getQueryData: jest.fn(),
      setQueryData: jest.fn(),
      prefetchQuery: jest.fn(),
      fetchQuery: jest.fn(),
      getQueriesData: jest.fn(),
      setQueriesData: jest.fn(),
      refetchQueries: jest.fn(),
      cancelQueries: jest.fn(),
      removeQueries: jest.fn(),
      resetQueries: jest.fn(),
      isFetching: jest.fn(),
      isMutating: jest.fn(),
      clear: jest.fn(),
      mount: jest.fn(),
      unmount: jest.fn(),
      getMutationCache: jest.fn(),
      getQueryCache: jest.fn(),
      getLogger: jest.fn(),
      getDefaultOptions: jest.fn(),
      setDefaultOptions: jest.fn(),
      setMutationDefaults: jest.fn(),
      getMutationDefaults: jest.fn(),
      setQueryDefaults: jest.fn(),
      getQueryDefaults: jest.fn(),
      resumePausedMutations: jest.fn(),
      ensureQueryData: jest.fn(),
      getQueryState: jest.fn(),
      fetchInfiniteQuery: jest.fn(),
      prefetchInfiniteQuery: jest.fn(),
    } as unknown as ReturnType<typeof useQueryClient>;
    
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseAuth.mockReturnValue({
      user: { uid: 'test-user' },
      userData: { role: 'super-admin' },
    } as ReturnType<typeof useAuth>);
    mockUseToast.mockReturnValue({
      toasts: [],
      addToast: jest.fn(),
      removeToast: jest.fn(),
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showWarning: jest.fn(),
      showInfo: jest.fn(),
    } as ReturnType<typeof useToast>);
    
    mockUseQueryClient.mockReturnValue(mockQueryClient);
    
    // Mock useMutation to return a function that captures and executes the callbacks
    let savedOnSuccess: ((data: { success: boolean }, variables: unknown, context: unknown) => void) | null = null;
    
    const mockMutate = jest.fn().mockImplementation((variables) => {
      if (savedOnSuccess) {
        savedOnSuccess({ success: true }, variables, {});
      }
    });
    
    mockUseMutation.mockImplementation((options) => {
      savedOnSuccess = options.onSuccess || null;
      return {
        mutate: mockMutate,
        isPending: false,
        isError: false,
        isSuccess: false,
        data: undefined,
        error: null,
        reset: jest.fn(),
        isIdle: true,
        mutateAsync: jest.fn(),
        status: 'idle' as const,
        variables: undefined,
        context: undefined,
        failureCount: 0,
        failureReason: null,
        isLoadingError: false,
        isPaused: false,
        submittedAt: 0,
      } as unknown as ReturnType<typeof useMutation>;
    });
  });

  test('loads programs toggle setting correctly', async () => {
    mockGetContentSectionById.mockResolvedValue(mockProgramsToggleSection);

    const params = Promise.resolve({ id: 'home-programs-toggle' });
    render(<EditContentPage params={params} />);

    // Wait for the component to load and render
    await waitFor(() => {
      expect(screen.getByText('Edit: Programs Toggle Setting')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText('High Holy Days')).toBeInTheDocument();
      expect(screen.getByLabelText('Passover')).toBeInTheDocument();
    });

    // Should have High Holy Days selected by default
    expect(screen.getByLabelText('High Holy Days')).toBeChecked();
    expect(screen.getByLabelText('Passover')).not.toBeChecked();
  });

  test('allows switching from High Holy Days to Passover', async () => {
    mockGetContentSectionById.mockResolvedValue(mockProgramsToggleSection);

    const params = Promise.resolve({ id: 'home-programs-toggle' });
    render(<EditContentPage params={params} />);

    // Wait for the component to fully load
    await waitFor(() => {
      expect(screen.getByText('Edit: Programs Toggle Setting')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Passover')).toBeInTheDocument();
      expect(screen.getByLabelText('High Holy Days')).toBeChecked();
    });

    // Switch to Passover - this should update the UI state
    fireEvent.click(screen.getByLabelText('Passover'));
    expect(screen.getByLabelText('Passover')).toBeChecked();
    expect(screen.getByLabelText('High Holy Days')).not.toBeChecked();
  });

  test('allows switching from Passover to High Holy Days', async () => {
    const passoverToggleSection = {
      ...mockProgramsToggleSection,
      content: 'passover'
    };
    
    mockGetContentSectionById.mockResolvedValue(passoverToggleSection);

    const params = Promise.resolve({ id: 'home-programs-toggle' });
    render(<EditContentPage params={params} />);

    // Wait for the component to fully load
    await waitFor(() => {
      expect(screen.getByText('Edit: Programs Toggle Setting')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Passover')).toBeChecked();
    });

    // Switch to High Holy Days - this should update the UI state
    fireEvent.click(screen.getByLabelText('High Holy Days'));
    expect(screen.getByLabelText('High Holy Days')).toBeChecked();
    expect(screen.getByLabelText('Passover')).not.toBeChecked();
  });


  test('save button is present and clickable', async () => {
    mockGetContentSectionById.mockResolvedValue(mockProgramsToggleSection);

    const params = Promise.resolve({ id: 'home-programs-toggle' });
    render(<EditContentPage params={params} />);

    // Wait for the component to fully load
    await waitFor(() => {
      expect(screen.getByText('Edit: Programs Toggle Setting')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Passover')).toBeInTheDocument();
    });

    // Check that save button is present and enabled
    const saveButton = screen.getByText('Save Changes');
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();

    // Click save button (this should not cause errors even if the mutation is mocked)
    fireEvent.click(saveButton);
    
    // The button should still be present after clicking
    expect(saveButton).toBeInTheDocument();
  });
});