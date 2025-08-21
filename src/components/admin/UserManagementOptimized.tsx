'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Users as UsersIcon, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserCard from '@/components/admin/UserCard';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useAuth } from '@/contexts/AuthContext';
import { UserData, getAllUsers, updateUser, deleteUser, sendUserPasswordReset, createUser } from '@/lib/users';
import { UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ContentSection } from '@/types/content';
import { 
  getAllContentSections, 
  grantContentPermission, 
  revokeContentPermission
} from '@/lib/content-schema';
import { getBatchUserContentPermissions } from '@/lib/user-permissions-optimized';

export default function UserManagementOptimized() {
  const { userData } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [userPermissions, setUserPermissions] = useState<Record<string, string[]>>({});
  
  // Separate loading states for progressive loading
  const [usersLoading, setUsersLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();
  
  // Add user form state
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('admin');
  const [addingUser, setAddingUser] = useState(false);

  useEffect(() => {
    loadUsersOptimized();
  }, []);

  const loadUsersOptimized = async () => {
    // Progressive loading: load users first, then content sections, then permissions
    try {
      // Step 1: Load users immediately
      setUsersLoading(true);
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
      setUsersLoading(false);

      // Step 2: Load content sections in parallel with permissions
      const contentPromise = (async () => {
        setContentLoading(true);
        try {
          const sections = await getAllContentSections();
          setContentSections(sections);
        } catch (err) {
          console.error('Error loading content sections:', err);
        } finally {
          setContentLoading(false);
        }
      })();

      // Step 3: Load permissions for all admin users at once
      const permissionsPromise = (async () => {
        setPermissionsLoading(true);
        try {
          const adminUsers = fetchedUsers.filter(user => user.role === 'admin');
          if (adminUsers.length > 0) {
            const adminUserIds = adminUsers.map(user => user.uid);
            const batchPermissions = await getBatchUserContentPermissions(adminUserIds);
            setUserPermissions(batchPermissions);
          }
        } catch (err) {
          console.error('Error loading permissions:', err);
        } finally {
          setPermissionsLoading(false);
        }
      })();

      // Wait for both content and permissions to complete
      await Promise.all([contentPromise, permissionsPromise]);

    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
      setUsersLoading(false);
      setContentLoading(false);
      setPermissionsLoading(false);
    }
  };

  const handleToggleStatus = async (uid: string, isActive: boolean) => {
    try {
      await updateUser(uid, { isActive });
      setUsers(users.map(user => 
        user.uid === uid 
          ? { ...user, isActive, updatedAt: new Date() }
          : user
      ));
      setSuccess(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update user status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleRole = async (uid: string, role: UserRole) => {
    try {
      await updateUser(uid, { role });
      setUsers(users.map(user => 
        user.uid === uid 
          ? { ...user, role, updatedAt: new Date() }
          : user
      ));
      setSuccess(`User role updated successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update user role');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteUser = (uid: string) => {
    setUserToDelete(uid);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete);
      setUsers(users.filter(user => user.uid !== userToDelete));
      showSuccess('User Deleted', 'The user has been successfully deleted.');
    } catch {
      showError('Delete Failed', 'There was an error deleting the user. Please try again.');
    } finally {
      setUserToDelete(null);
    }
  };

  const handleSendPasswordReset = async (email: string) => {
    try {
      await sendUserPasswordReset(email);
      setSuccess(`Password reset email sent to ${email}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to send password reset email');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleContentPermission = async (userId: string, contentSectionId: string, hasPermission: boolean) => {
    try {
      if (hasPermission) {
        await grantContentPermission(userId, contentSectionId, userData?.uid || '');
      } else {
        await revokeContentPermission(userId, contentSectionId);
      }

      // Update local state
      setUserPermissions(prev => ({
        ...prev,
        [userId]: hasPermission 
          ? [...(prev[userId] || []), contentSectionId]
          : (prev[userId] || []).filter(id => id !== contentSectionId)
      }));

      showSuccess(
        'Permission Updated', 
        `Content permission ${hasPermission ? 'granted' : 'revoked'} successfully.`
      );
    } catch (error) {
      console.error('Error updating content permission:', error);
      showError('Update Failed', 'Failed to update content permission. Please try again.');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserEmail || !newUserPassword) {
      setError('Email and password are required');
      return;
    }

    try {
      setAddingUser(true);
      const uid = await createUser(newUserEmail, newUserPassword, newUserRole);
      
      // Add new user to the list
      const newUser: UserData = {
        uid,
        email: newUserEmail,
        role: newUserRole,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setUsers([newUser, ...users]);
      setSuccess('User created successfully');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('admin');
      setShowAddUser(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      setTimeout(() => setError(''), 3000);
    } finally {
      setAddingUser(false);
    }
  };

  // Show initial loading only if users haven't loaded yet
  const isInitialLoading = usersLoading && users.length === 0;

  if (isInitialLoading) {
    return (
      <ProtectedRoute requiredRole="super-admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#F58C28'}}></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="super-admin">
      <div className="min-h-screen bg-gray-50 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <Link
                href="/admin"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  User Management
                  {(contentLoading || permissionsLoading) && (
                    <span className="ml-3 inline-flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b border-gray-400" />
                      <span className="ml-2 text-sm text-gray-500">Loading permissions...</span>
                    </span>
                  )}
                </h1>
                <p className="mt-2 text-gray-600">Manage admin users and permissions</p>
              </div>
              <button
                onClick={() => setShowAddUser(!showAddUser)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-sm"
                style={{backgroundColor: '#F58C28'}}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New User
              </button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-md bg-green-50 p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">{success}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Add User Form */}
          {showAddUser && (
            <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Add New User</h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Temporary Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter temporary password"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="admin">Admin</option>
                      <option value="super-admin">Super Admin</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddUser(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingUser}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                    style={{backgroundColor: '#F58C28'}}
                  >
                    {addingUser ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users Stats */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-gray-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter(user => user.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Super Admins</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter(user => user.role === 'super-admin').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Users List */}
          {users.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserCard
                  key={user.uid}
                  user={user}
                  currentUserUid={userData?.uid || ''}
                  contentSections={contentSections}
                  userPermissions={userPermissions[user.uid] || []}
                  onToggleStatus={handleToggleStatus}
                  onToggleRole={handleToggleRole}
                  onDelete={handleDeleteUser}
                  onSendPasswordReset={handleSendPasswordReset}
                  onToggleContentPermission={handleToggleContentPermission}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </ProtectedRoute>
  );
}