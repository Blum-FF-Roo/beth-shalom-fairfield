import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserManagement from '../UserManagement';
import { useAuth } from '@/app/utils/AuthContext';
import { useToast } from '@/app/utils/ToastContext';
import { getAllUsers, updateUser, deleteUser, createUser } from '@/app/utils/users';
import { getAllContentSections } from '@/app/utils/firebase-operations';
import { PermissionService } from '@/app/utils/permissions';
import { getAllPermissionSections, groupPermissionsByCategory, getCategoryDisplayName } from '@/app/utils/admin-permissions';

jest.mock('@/app/utils/AuthContext');
jest.mock('@/app/utils/ToastContext');
jest.mock('@/app/utils/users');
jest.mock('@/app/utils/firebase-operations');
jest.mock('@/app/utils/permissions');
jest.mock('@/app/utils/admin-permissions');
jest.mock('@/app/components/auth/ProtectedRoute', () => {
  return function ProtectedRoute({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

const mockUseAuth = useAuth as jest.Mock;
const mockUseToast = useToast as jest.Mock;
const mockGetAllUsers = getAllUsers as jest.Mock;
const mockUpdateUser = updateUser as jest.Mock;
const mockDeleteUser = deleteUser as jest.Mock;
const mockCreateUser = createUser as jest.Mock;
const mockGetAllContentSections = getAllContentSections as jest.Mock;
const mockPermissionService = PermissionService as jest.Mocked<typeof PermissionService>;
const mockGetAllPermissionSections = getAllPermissionSections as jest.Mock;
const mockGroupPermissionsByCategory = groupPermissionsByCategory as jest.Mock;
const mockGetCategoryDisplayName = getCategoryDisplayName as jest.Mock;

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

const mockSuperUserData = {
  uid: 'super123',
  email: 'super@test.com',
  role: 'super-admin' as const,
  isActive: true
};

const mockUsers = [
  {
    uid: 'user1',
    email: 'admin1@test.com',
    role: 'admin' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: ['section1']
  },
  {
    uid: 'user2',
    email: 'admin2@test.com',
    role: 'admin' as const,
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: []
  }
];

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
  }
];

const mockPermissionSections = [
  {
    id: 'section1',
    title: 'Site Logo',
    description: 'Main site logo',
    category: 'logo',
    type: 'content' as const
  },
  {
    id: 'section2',
    title: 'About Us',
    description: 'About page content',
    category: 'about',
    type: 'content' as const
  },
  {
    id: 'posts-parshah',
    title: 'Parashah Articles',
    description: 'Weekly Torah portion articles',
    category: 'posts',
    type: 'posts' as const
  }
];

const mockGroupedPermissions = {
  'logo': [mockPermissionSections[0]],
  'about': [mockPermissionSections[1]],
  'posts': [mockPermissionSections[2]]
};

describe('UserManagement', () => {
  const mockShowError = jest.fn();
  const mockShowSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      userData: mockSuperUserData
    });
    
    mockUseToast.mockReturnValue({
      showError: mockShowError,
      showSuccess: mockShowSuccess
    });
    
    mockGetAllUsers.mockResolvedValue(mockUsers);
    mockGetAllContentSections.mockResolvedValue(mockContentSections);
    mockGetAllPermissionSections.mockResolvedValue(mockPermissionSections);
    mockGroupPermissionsByCategory.mockReturnValue(mockGroupedPermissions);
    mockGetCategoryDisplayName.mockImplementation((category: string) => `🏠 ${category}`);
    
    // Mock PermissionService.getUserPermissions for each user
    mockPermissionService.getUserPermissions
      .mockResolvedValueOnce(['section1']) // For user1
      .mockResolvedValueOnce([]); // For user2
  });

  describe('Loading state', () => {
    it('should show loading spinner initially', async () => {
      mockGetAllUsers.mockImplementation(() => new Promise(() => {}));
      
      renderWithQueryClient(<UserManagement />);
      
      expect(screen.getByText('Loading user management...')).toBeInTheDocument();
    });
  });

  describe('User list display', () => {
    it('should display all users with their information', async () => {
      mockPermissionService.getUserPermissions
        .mockResolvedValueOnce(['section1'])
        .mockResolvedValueOnce(['section2']);
      
      renderWithQueryClient(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('admin1@test.com')).toBeInTheDocument();
        expect(screen.getByText('admin2@test.com')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('Inactive')).toBeInTheDocument();
      });
    });
  });

  describe('Add user functionality', () => {
    it('should show add user form when Add User button is clicked', async () => {
      const user = userEvent.setup();
      
      renderWithQueryClient(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('Add User')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Add User'));
      
      expect(screen.getByText('Add New User')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('should create new user when form is submitted', async () => {
      const user = userEvent.setup();
      mockCreateUser.mockResolvedValue('new-user-id');
      
      renderWithQueryClient(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('Add User')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Add User'));
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButtons = screen.getAllByText('Add User');
      const submitButton = submitButtons[1]; // The second "Add User" button is the submit button
      
      await user.type(emailInput, 'newuser@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalledWith('newuser@test.com', 'password123', 'admin');
        expect(mockShowSuccess).toHaveBeenCalledWith('Success', 'User created successfully');
      });
    });

    it('should show error when required fields are missing', async () => {
      const user = userEvent.setup();
      
      renderWithQueryClient(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('Add User')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Add User'));
      const submitButtons = screen.getAllByText('Add User');
      await user.click(submitButtons[1]); // The submit button
      
      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Error', 'Please fill in all fields');
      });
    });
  });

  describe('User status management', () => {
    it('should toggle user active status', async () => {
      const user = userEvent.setup();
      mockUpdateUser.mockResolvedValue(undefined);
      mockPermissionService.getUserPermissions.mockResolvedValue([]);
      
      renderWithQueryClient(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('admin1@test.com')).toBeInTheDocument();
      });
      
      const deactivateButton = screen.getByText('Deactivate');
      await user.click(deactivateButton);
      
      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith('user1', { isActive: false });
        expect(mockShowSuccess).toHaveBeenCalledWith('Success', 'User deactivated successfully');
      });
    });
  });

  describe('User deletion', () => {
    it('should allow deletion of non-super-admin users', async () => {
      const user = userEvent.setup();
      mockDeleteUser.mockResolvedValue(undefined);
      mockPermissionService.getUserPermissions.mockResolvedValue([]);
      
      renderWithQueryClient(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('admin1@test.com')).toBeInTheDocument();
      });
      
      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(mockDeleteUser).toHaveBeenCalledWith('user1');
        expect(mockShowSuccess).toHaveBeenCalledWith('Success', 'User deleted successfully');
      });
    });

    it('should not show delete button for super-admin users', async () => {
      const superAdminUser = {
        ...mockUsers[0],
        role: 'super-admin' as const
      };
      
      mockGetAllUsers.mockResolvedValue([superAdminUser]);
      mockPermissionService.getUserPermissions.mockResolvedValue([]);
      
      renderWithQueryClient(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText(superAdminUser.email)).toBeInTheDocument();
      });
      
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });
  });

  describe('Permission management', () => {
    it('should display content permissions for admin users', async () => {
      const user = userEvent.setup();
      mockUseAuth.mockReturnValue({
        userData: mockSuperUserData // Keep super-admin for viewing permissions
      });
      
      mockPermissionService.getUserPermissions
        .mockResolvedValueOnce(['section1'])
        .mockResolvedValueOnce([]);
      
      renderWithQueryClient(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getAllByText('Content Permissions')).toHaveLength(2);
      });
      
      // Click on the first user's permissions to expand them
      const permissionButtons = screen.getAllByText('Content Permissions');
      await user.click(permissionButtons[0]);
      
      // Now check if we can find permissions content after expansion
      await waitFor(() => {
        expect(screen.getByText('Site Logo')).toBeInTheDocument();
        expect(screen.getByText('About Us')).toBeInTheDocument();
      });
    });

    it('should toggle content permissions when clicked', async () => {
      const user = userEvent.setup();
      mockUseAuth.mockReturnValue({
        userData: mockSuperUserData // Keep super-admin
      });
      
      mockPermissionService.getUserPermissions.mockResolvedValue(['section1']);
      mockPermissionService.grantPermission.mockResolvedValue(undefined);
      
      renderWithQueryClient(<UserManagement />);
      
      // First expand the permissions section
      await waitFor(() => {
        expect(screen.getAllByText('Content Permissions')).toHaveLength(2);
      });
      
      const permissionButtons = screen.getAllByText('Content Permissions');
      await user.click(permissionButtons[0]); // Expand first user's permissions
      
      await waitFor(() => {
        expect(screen.getByText('Site Logo')).toBeInTheDocument();
      });
      
      const aboutButton = screen.getByText('About Us');
      await user.click(aboutButton);
      
      await waitFor(() => {
        expect(mockPermissionService.grantPermission).toHaveBeenCalledWith('user1', 'section2', 'super123');
        expect(mockShowSuccess).toHaveBeenCalledWith('Success', 'Permission updated successfully');
      });
    });

    it('should not show permissions section for super-admin users', async () => {
      const superAdminUser = {
        ...mockUsers[0],
        role: 'super-admin' as const
      };
      
      mockGetAllUsers.mockResolvedValue([superAdminUser]);
      
      renderWithQueryClient(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText(superAdminUser.email)).toBeInTheDocument();
        expect(screen.queryByText('Content Permissions')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('should show error when user loading fails', async () => {
      mockGetAllUsers.mockRejectedValue(new Error('Failed to load users'));
      
      renderWithQueryClient(<UserManagement />);
      
      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Error', 'Failed to load user management data');
      });
    });
  });
});