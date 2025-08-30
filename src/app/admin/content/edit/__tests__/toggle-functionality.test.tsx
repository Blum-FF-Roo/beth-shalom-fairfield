import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import EditContentPage from '../[id]/page';
import { getContentSectionById, updateContentSection } from '@/app/utils/firebase-operations';
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
const mockUpdateContentSection = updateContentSection as jest.MockedFunction<typeof updateContentSection>;
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
    
    const mockMutate = jest.fn();
    const mockQueryClient = {
      invalidateQueries: jest.fn(),
    };
    
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseAuth.mockReturnValue({
      user: { uid: 'test-user' },
      userData: { role: 'super-admin' },
    } as ReturnType<typeof useAuth>);
    mockUseToast.mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    } as ReturnType<typeof useToast>);
    
    mockUseQueryClient.mockReturnValue(mockQueryClient);
    mockUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
      reset: jest.fn(),
      isIdle: false,
      mutateAsync: jest.fn(),
    });
    
    // Make the mutate function call the onSuccess callback when invoked
    mockMutate.mockImplementation((variables) => {
      // Wait for the next tick to simulate async behavior
      setTimeout(() => {
        // Find the most recent useMutation call
        const recentCall = mockUseMutation.mock.calls[mockUseMutation.mock.calls.length - 1];
        if (recentCall && recentCall[0].onSuccess) {
          recentCall[0].onSuccess({ success: true }, variables);
        }
      }, 0);
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
    mockUpdateContentSection.mockResolvedValue();

    const params = Promise.resolve({ id: 'home-programs-toggle' });
    render(<EditContentPage params={params} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Passover')).toBeInTheDocument();
    });

    // Switch to Passover
    fireEvent.click(screen.getByLabelText('Passover'));
    expect(screen.getByLabelText('Passover')).toBeChecked();

    // Save the changes
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(mockUpdateContentSection).toHaveBeenCalledWith(
        'home-programs-toggle',
        { content: 'passover' }
      );
    });
  });

  test('allows switching from Passover to High Holy Days', async () => {
    const passoverToggleSection = {
      ...mockProgramsToggleSection,
      content: 'passover'
    };
    
    mockGetContentSectionById.mockResolvedValue(passoverToggleSection);
    mockUpdateContentSection.mockResolvedValue();

    const params = Promise.resolve({ id: 'home-programs-toggle' });
    render(<EditContentPage params={params} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Passover')).toBeChecked();
    });

    // Switch to High Holy Days
    fireEvent.click(screen.getByLabelText('High Holy Days'));
    expect(screen.getByLabelText('High Holy Days')).toBeChecked();

    // Save the changes
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(mockUpdateContentSection).toHaveBeenCalledWith(
        'home-programs-toggle',
        { content: 'highHolyDays' }
      );
    });
  });

  test('dispatches contentUpdated event after successful save', async () => {
    mockGetContentSectionById.mockResolvedValue(mockProgramsToggleSection);
    mockUpdateContentSection.mockResolvedValue();

    // Mock window.dispatchEvent
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    const params = Promise.resolve({ id: 'home-programs-toggle' });
    render(<EditContentPage params={params} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Passover')).toBeInTheDocument();
    });

    // Switch to Passover and save
    fireEvent.click(screen.getByLabelText('Passover'));
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'contentUpdated',
          detail: { key: 'programs_toggle_setting' }
        })
      );
    });

    dispatchEventSpy.mockRestore();
  });

  test('shows success message after saving toggle', async () => {
    mockGetContentSectionById.mockResolvedValue(mockProgramsToggleSection);
    mockUpdateContentSection.mockResolvedValue();

    const params = Promise.resolve({ id: 'home-programs-toggle' });
    render(<EditContentPage params={params} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Passover')).toBeInTheDocument();
    });

    // Switch and save
    fireEvent.click(screen.getByLabelText('Passover'));
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Content Updated',
        'Content has been successfully updated.'
      );
    });
  });
});