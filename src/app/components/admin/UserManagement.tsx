'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Users as UsersIcon, CheckCircle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import { useAuth } from '@/app/utils/AuthContext';
import { UserData, getAllUsers, updateUser, deleteUser, createUser } from '@/app/utils/users';
import { UserRole } from '@/app/utils/AuthContext';
import { useToast } from '@/app/utils/ToastContext';
import { getAllPermissionSections, groupPermissionsByCategory, getCategoryDisplayName, PermissionSection } from '@/app/utils/admin-permissions';
import { PermissionService } from '@/app/utils/permissions';

interface UserWithPermissions extends UserData {
  permissions: string[];
}

export default function UserManagement() {
  const { userData } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [permissionSections, setPermissionSections] = useState<PermissionSection[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, PermissionSection[]>>({});
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('admin');
  const [addingUser, setAddingUser] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState<string | null>(null);
  const [expandedPermissions, setExpandedPermissions] = useState<Set<string>>(new Set());

  const loadData = useCallback(async (): Promise<void> => {
    try {
      const [usersData, allPermissionSections] = await Promise.all([
        getAllUsers(),
        getAllPermissionSections()
      ]);

      const usersWithPermissions = await Promise.all(
        usersData.map(async (user) => ({
          ...user,
          permissions: await PermissionService.getUserPermissions(user.uid)
        }))
      );

      const grouped = groupPermissionsByCategory(allPermissionSections);

      setUsers(usersWithPermissions);
      setPermissionSections(allPermissionSections);
      setGroupedPermissions(grouped);
    } catch {
      showError('Error', 'Failed to load user management data');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddUser = async (): Promise<void> => {
    if (!newUserEmail || !newUserPassword) {
      showError('Error', 'Please fill in all fields');
      return;
    }

    setAddingUser(true);
    try {
      await createUser(newUserEmail, newUserPassword, newUserRole);
      showSuccess('Success', 'User created successfully');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('admin');
      setShowAddUser(false);
      loadData();
    } catch {
      showError('Error', 'Failed to create user');
    } finally {
      setAddingUser(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean): Promise<void> => {
    try {
      await updateUser(userId, { isActive });
      setUsers(users.map(user => 
        user.uid === userId ? { ...user, isActive } : user
      ));
      showSuccess('Success', `User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch {
      showError('Error', 'Failed to update user status');
    }
  };

  const handleTogglePermission = async (userId: string, sectionId: string, hasPermission: boolean): Promise<void> => {
    if (!userData) return;

    try {
      if (hasPermission) {
        await PermissionService.revokePermission(userId, sectionId);
      } else {
        await PermissionService.grantPermission(userId, sectionId, userData.uid);
      }

      setUsers(users.map(user => {
        if (user.uid === userId) {
          const permissions = hasPermission 
            ? user.permissions.filter(id => id !== sectionId)
            : [...user.permissions, sectionId];
          return { ...user, permissions };
        }
        return user;
      }));

      showSuccess('Success', 'Permission updated successfully');
    } catch (error) {
      console.error('Error updating permission:', error);
      showError('Error', 'Failed to update permission');
    }
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.uid !== userId));
      showSuccess('Success', 'User deleted successfully');
    } catch {
      showError('Error', 'Failed to delete user');
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: UserRole): Promise<void> => {
    try {
      await updateUser(userId, { role: newRole });
      setUsers(users.map(user => 
        user.uid === userId ? { ...user, role: newRole } : user
      ));
      showSuccess('Success', `User role changed to ${newRole === 'super-admin' ? 'Super Admin' : 'Admin'}`);
    } catch {
      showError('Error', 'Failed to change user role');
    }
  };

  const handleSelectAllPermissions = async (userId: string): Promise<void> => {
    if (!userData || loadingPermissions === userId) return;

    setLoadingPermissions(userId);
    try {
      const user = users.find(u => u.uid === userId);
      if (!user) return;

      const allSectionIds = permissionSections.map(section => section.id);
      const sectionsToGrant = allSectionIds.filter(id => !user.permissions.includes(id));

      // Grant all missing permissions
      await Promise.all(
        sectionsToGrant.map(sectionId => 
          PermissionService.grantPermission(userId, sectionId, userData.uid)
        )
      );

      // Update local state
      setUsers(users.map(u => 
        u.uid === userId 
          ? { ...u, permissions: allSectionIds }
          : u
      ));

      showSuccess('Success', `Granted all permissions to ${user.email}`);
    } catch (error) {
      console.error('Error granting all permissions:', error);
      showError('Error', 'Failed to grant all permissions');
    } finally {
      setLoadingPermissions(null);
    }
  };

  const handleClearAllPermissions = async (userId: string): Promise<void> => {
    if (loadingPermissions === userId) return;

    setLoadingPermissions(userId);
    try {
      const user = users.find(u => u.uid === userId);
      if (!user) return;

      // Revoke all current permissions
      await Promise.all(
        user.permissions.map(sectionId => 
          PermissionService.revokePermission(userId, sectionId)
        )
      );

      // Update local state
      setUsers(users.map(u => 
        u.uid === userId 
          ? { ...u, permissions: [] }
          : u
      ));

      showSuccess('Success', `Cleared all permissions for ${user.email}`);
    } catch (error) {
      console.error('Error clearing all permissions:', error);
      showError('Error', 'Failed to clear all permissions');
    } finally {
      setLoadingPermissions(null);
    }
  };

  const togglePermissionsExpanded = (userId: string) => {
    const newExpanded = new Set(expandedPermissions);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedPermissions(newExpanded);
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="super-admin">
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#F58C28'}}></div>
              <p className="text-gray-600">Loading user management...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="super-admin">
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="mb-4">
              <Link
                href="/admin"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <UsersIcon className="h-8 w-8 mr-3" />
                  User Management
                </h1>
                <p className="mt-2 text-gray-600">Manage user accounts and permissions</p>
              </div>

              <button
                onClick={() => setShowAddUser(!showAddUser)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                style={{ backgroundColor: '#F58C28' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {showAddUser && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={handleAddUser}
                  disabled={addingUser}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                  style={{ backgroundColor: '#F58C28' }}
                >
                  {addingUser ? 'Adding...' : 'Add User'}
                </button>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {users.map(user => (
              <div key={user.uid} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{user.email}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeUserRole(user.uid, e.target.value as UserRole)}
                        className={`px-2 py-1 text-xs font-medium rounded border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          user.role === 'super-admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <option value="admin">Admin</option>
                        <option value="super-admin">Super Admin</option>
                      </select>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {user.lastLogin && (
                      <p className="text-xs text-gray-500 mt-1">
                        Last login: {typeof user.lastLogin === 'object' && user.lastLogin && 'toDate' in user.lastLogin && typeof user.lastLogin.toDate === 'function'
                          ? new Date(user.lastLogin.toDate()).toLocaleString()
                          : new Date(user.lastLogin as Date).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleUserStatus(user.uid, !user.isActive)}
                      className={`px-3 py-1.5 text-xs font-medium rounded text-white ${
                        user.isActive 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    {user.uid !== userData?.uid && user.role !== 'super-admin' && (
                      <button
                        onClick={() => handleDeleteUser(user.uid)}
                        className="px-3 py-1.5 text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {user.role !== 'super-admin' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => togglePermissionsExpanded(user.uid)}
                        className="flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 focus:outline-none"
                      >
                        {expandedPermissions.has(user.uid) ? (
                          <ChevronDown className="h-4 w-4 mr-1" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-1" />
                        )}
                        Content Permissions
                        <span className="ml-2 text-xs text-gray-500">
                          ({user.permissions.length}/{permissionSections.length})
                        </span>
                      </button>
                      {expandedPermissions.has(user.uid) && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSelectAllPermissions(user.uid)}
                            disabled={loadingPermissions === user.uid}
                            className="px-3 py-1 text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingPermissions === user.uid ? 'Processing...' : 'Select All'}
                          </button>
                          <button
                            onClick={() => handleClearAllPermissions(user.uid)}
                            disabled={loadingPermissions === user.uid}
                            className="px-3 py-1 text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingPermissions === user.uid ? 'Processing...' : 'Clear All'}
                          </button>
                        </div>
                      )}
                    </div>
                    {expandedPermissions.has(user.uid) && (
                      <div className="space-y-4">
                        {Object.entries(groupedPermissions).map(([category, sections]) => (
                        <div key={category}>
                          <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                            {getCategoryDisplayName(category)}
                            <span className="ml-2 text-gray-500 font-normal">
                              ({sections.filter(s => user.permissions.includes(s.id)).length}/{sections.length})
                            </span>
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {sections.map(section => {
                              const hasPermission = user.permissions.includes(section.id);
                              return (
                                <button
                                  key={section.id}
                                  onClick={() => handleTogglePermission(user.uid, section.id, hasPermission)}
                                  className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded border transition-colors duration-200 ${
                                    hasPermission
                                      ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
                                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  <div className="text-left flex-1">
                                    <div className="truncate font-medium">{section.title}</div>
                                    <div className="truncate text-gray-500 text-xs">{section.description}</div>
                                  </div>
                                  {hasPermission ? (
                                    <CheckCircle className="h-3 w-3 text-green-600 ml-2 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-gray-400 ml-2 flex-shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}