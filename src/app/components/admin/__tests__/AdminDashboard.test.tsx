import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminDashboard from '../AdminDashboard';
import { useAuth } from '@/app/utils/AuthContext';
import { useToast } from '@/app/utils/ToastContext';
import { getAllContentSections } from '@/app/utils/firebase-operations';
import { PermissionService } from '@/app/utils/permissions';

jest.mock('@/app/utils/AuthContext');
jest.mock('@/app/utils/ToastContext');
jest.mock('@/app/utils/firebase-operations');
jest.mock('@/app/utils/permissions');
jest.mock('@/app/components/auth/ProtectedRoute', () => {
  return function ProtectedRoute({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

const mockUseAuth = useAuth as jest.Mock;
const mockUseToast = useToast as jest.Mock;
const mockGetAllContentSections = getAllContentSections as jest.Mock;
const mockPermissionService = PermissionService as jest.Mocked<typeof PermissionService>;

// Helper function to render with QueryClient
const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

const mockUser = {
  uid: 'user123',
  email: 'admin@test.com'
};

const mockUserData = {
  uid: 'user123',
  email: 'admin@test.com',
  role: 'admin' as const,
  isActive: true
};

const mockSuperUserData = {
  uid: 'super123',
  email: 'super@test.com',
  role: 'super-admin' as const,
  isActive: true
};

const mockContentSections = [
  {
    id: 'section1',
    title: 'Site Logo',
    description: 'Main site logo',
    category: 'logo',
    type: 'image',
    key: 'site-logo'
  },
  {
    id: 'section2',
    title: 'About Us',
    description: 'About page content',
    category: 'about',
    type: 'rich_text',
    key: 'about-content'
  },
  {
    id: 'section3',
    title: 'Contact Info',
    description: 'Contact information',
    category: 'contact',
    type: 'contact',
    key: 'contact-info'
  }
];

describe('AdminDashboard', () => {
  const mockShowError = jest.fn();
  const mockShowSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseToast.mockReturnValue({
      showError: mockShowError,
      showSuccess: mockShowSuccess
    });
  });

  describe('Loading state', () => {
    it('should show loading spinner initially', async () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        userData: mockUserData
      });
      
      mockGetAllContentSections.mockImplementation(() => new Promise(() => {}));
      
      renderWithQueryClient(<AdminDashboard />);
      
      expect(screen.getByText('Loading admin dashboard...')).toBeInTheDocument();
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('Super admin permissions', () => {
    it('should show all content sections for super admin', async () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        userData: mockSuperUserData
      });
      
      mockGetAllContentSections.mockResolvedValue(mockContentSections);
      
      renderWithQueryClient(<AdminDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Site Logo' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'About Us' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Contact Info' })).toBeInTheDocument();
      });
    });

    it('should show Manage Users button for super admin', async () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        userData: mockSuperUserData
      });
      
      mockGetAllContentSections.mockResolvedValue(mockContentSections);
      
      renderWithQueryClient(<AdminDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Manage Users')).toBeInTheDocument();
      });
    });
  });

  describe('Regular admin permissions', () => {
    it('should only show authorized content sections for admin', async () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        userData: mockUserData
      });
      
      mockGetAllContentSections.mockResolvedValue(mockContentSections);
      mockPermissionService.getUserPermissions.mockResolvedValue(['section1', 'section3']);
      
      renderWithQueryClient(<AdminDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Site Logo' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Contact Info' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'About Us' })).not.toBeInTheDocument();
      });
    });

    it('should not show Manage Users button for admin', async () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        userData: mockUserData
      });
      
      mockGetAllContentSections.mockResolvedValue(mockContentSections);
      mockPermissionService.getUserPermissions.mockResolvedValue(['section1']);
      
      renderWithQueryClient(<AdminDashboard />);
      
      await waitFor(() => {
        expect(screen.queryByText('Manage Users')).not.toBeInTheDocument();
      });
    });
  });

  describe('Category filtering', () => {
    it('should show only relevant category buttons based on permissions', async () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        userData: mockUserData
      });
      
      mockGetAllContentSections.mockResolvedValue(mockContentSections);
      mockPermissionService.getUserPermissions.mockResolvedValue(['section1']);
      
      renderWithQueryClient(<AdminDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('All Sections')).toBeInTheDocument();
        expect(screen.getByText('Site Branding')).toBeInTheDocument();
        expect(screen.queryByText('About')).not.toBeInTheDocument();
        expect(screen.queryByText('Contact')).not.toBeInTheDocument();
      });
    });

    it('should filter content when category button is clicked', async () => {
      const user = userEvent.setup();
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        userData: mockSuperUserData
      });
      
      mockGetAllContentSections.mockResolvedValue(mockContentSections);
      
      renderWithQueryClient(<AdminDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Site Logo' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'About Us' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Contact Info' })).toBeInTheDocument();
      });
      
      const aboutButton = screen.getByRole('button', { name: 'About Us' });
      await user.click(aboutButton);
      
      expect(screen.queryByRole('heading', { name: 'Site Logo' })).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'About Us' })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Contact Info' })).not.toBeInTheDocument();
    });
  });

  describe('No permissions state', () => {
    it('should show no permissions message when admin has no content access', async () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        userData: mockUserData
      });
      
      mockGetAllContentSections.mockResolvedValue(mockContentSections);
      mockPermissionService.getUserPermissions.mockResolvedValue([]);
      
      renderWithQueryClient(<AdminDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('No content sections found')).toBeInTheDocument();
        expect(screen.getByText('You do not have permission to edit any content sections.')).toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('should show error message when content loading fails', async () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        userData: mockUserData
      });
      
      mockGetAllContentSections.mockRejectedValue(new Error('Failed to load'));
      
      renderWithQueryClient(<AdminDashboard />);
      
      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Error', 'Failed to load content sections');
      });
    });
  });

  describe('Edit links', () => {
    it('should render edit links for authorized sections', async () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        userData: mockUserData
      });
      
      mockGetAllContentSections.mockResolvedValue([mockContentSections[0]]);
      mockPermissionService.getUserPermissions.mockResolvedValue(['section1']);
      
      renderWithQueryClient(<AdminDashboard />);
      
      await waitFor(() => {
        const editLink = screen.getByRole('link', { name: /edit/i });
        expect(editLink).toHaveAttribute('href', '/admin/content/edit/section1');
      });
    });
  });
});