import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserManagement from '../UserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getAllUsers, updateUser, deleteUser, createUser } from '@/lib/users';
import { getAllContentSections } from '@/lib/content-schema';
import { PermissionService } from '@/lib/permissions';

jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/ToastContext');
jest.mock('@/lib/users');
jest.mock('@/lib/content-schema');
jest.mock('@/lib/permissions');
jest.mock('@/components/auth/ProtectedRoute', () => {
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
    updatedAt: new Date()
  },
  {
    uid: 'user2',
    email: 'admin2@test.com',
    role: 'admin' as const,
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date()
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
  });

  describe('Loading state', () => {
    it('should show loading spinner initially', async () => {
      mockGetAllUsers.mockImplementation(() => new Promise(() => {}));
      
      render(<UserManagement />);
      
      expect(screen.getByText('Loading user management...')).toBeInTheDocument();
    });
  });

  describe('User list display', () => {
    it('should display all users with their information', async () => {
      mockPermissionService.getUserPermissions
        .mockResolvedValueOnce(['section1'])
        .mockResolvedValueOnce(['section2']);
      
      render(<UserManagement />);
      
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
      
      render(<UserManagement />);
      
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
      
      render(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('Add User')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Add User'));
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByText('Add User', { selector: 'button' });
      
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
      
      render(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('Add User')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Add User'));
      await user.click(screen.getByText('Add User', { selector: 'button' }));
      
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
      
      render(<UserManagement />);
      
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
      
      render(<UserManagement />);
      
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
      
      render(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText(superAdminUser.email)).toBeInTheDocument();
        expect(screen.queryByText('Delete')).not.toBeInTheDocument();
      });
    });
  });

  describe('Permission management', () => {
    it('should display content permissions for admin users', async () => {
      mockPermissionService.getUserPermissions
        .mockResolvedValueOnce(['section1'])
        .mockResolvedValueOnce([]);
      
      render(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('Content Permissions')).toBeInTheDocument();
        expect(screen.getByText('Site Logo')).toBeInTheDocument();
        expect(screen.getByText('About Us')).toBeInTheDocument();
      });
    });

    it('should toggle content permissions when clicked', async () => {
      const user = userEvent.setup();
      mockPermissionService.getUserPermissions.mockResolvedValue(['section1']);
      mockPermissionService.grantPermission.mockResolvedValue(undefined);
      
      render(<UserManagement />);
      
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
      
      render(<UserManagement />);
      
      await waitFor(() => {
        expect(screen.getByText(superAdminUser.email)).toBeInTheDocument();
        expect(screen.queryByText('Content Permissions')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('should show error when user loading fails', async () => {
      mockGetAllUsers.mockRejectedValue(new Error('Failed to load users'));
      
      render(<UserManagement />);
      
      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Error', 'Failed to load user management data');
      });
    });
  });
});