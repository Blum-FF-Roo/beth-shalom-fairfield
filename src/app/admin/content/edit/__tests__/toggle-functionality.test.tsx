import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import EditContentPage from '../[id]/page';
import { getContentSectionById, updateContentSectionContent } from '@/app/utils/firebase-operations';
import { useAuth } from '@/app/utils/AuthContext';
import { useToast } from '@/app/utils/ToastContext';

// Mock all dependencies
jest.mock('next/navigation');
jest.mock('@/app/utils/firebase-content');
jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/ToastContext');

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockGetContentSectionById = getContentSectionById as jest.MockedFunction<typeof getContentSectionById>;
const mockUpdateContentSectionContent = updateContentSectionContent as jest.MockedFunction<typeof updateContentSectionContent>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

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
    
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseAuth.mockReturnValue({
      user: { uid: 'test-user' },
      userData: { role: 'super-admin' },
    } as ReturnType<typeof useAuth>);
    mockUseToast.mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    } as ReturnType<typeof useToast>);
  });

  test('loads programs toggle setting correctly', async () => {
    mockGetContentSectionById.mockResolvedValue(mockProgramsToggleSection);

    const params = Promise.resolve({ id: 'home-programs-toggle' });
    render(<EditContentPage params={params} />);

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
    mockUpdateContentSectionContent.mockResolvedValue();

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
      expect(mockUpdateContentSectionContent).toHaveBeenCalledWith(
        'home-programs-toggle',
        'passover',
        'test-user'
      );
    });
  });

  test('allows switching from Passover to High Holy Days', async () => {
    const passoverToggleSection = {
      ...mockProgramsToggleSection,
      content: 'passover'
    };
    
    mockGetContentSectionById.mockResolvedValue(passoverToggleSection);
    mockUpdateContentSectionContent.mockResolvedValue();

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
      expect(mockUpdateContentSectionContent).toHaveBeenCalledWith(
        'home-programs-toggle',
        'highHolyDays',
        'test-user'
      );
    });
  });

  test('dispatches contentUpdated event after successful save', async () => {
    mockGetContentSectionById.mockResolvedValue(mockProgramsToggleSection);
    mockUpdateContentSectionContent.mockResolvedValue();

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
    mockUpdateContentSectionContent.mockResolvedValue();

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
        'Programs Toggle Setting has been updated and should appear immediately.'
      );
    });
  });
});