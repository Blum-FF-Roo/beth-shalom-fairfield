'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Plus, Trash2, Shield } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ContentSection, ContentPermission } from '@/types/content';
import { UserData, getAllUsers } from '@/lib/users';
import { 
  getAllContentSections, 
  grantContentPermission, 
  revokeContentPermission,
  getContentSectionPermissions 
} from '@/lib/content';

export default function ContentPermissionsPage() {
  const { userData } = useAuth();
  const { showSuccess, showError } = useToast();
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [permissions, setPermissions] = useState<Record<string, ContentPermission[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [granting, setGranting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sectionsData, usersData] = await Promise.all([
        getAllContentSections(),
        getAllUsers()
      ]);
      
      setContentSections(sectionsData);
      // Filter out super-admins and current user from the list
      setUsers(usersData.filter(user => 
        user.role !== 'super-admin' && 
        user.uid !== userData?.uid &&
        user.isActive
      ));

      // Load permissions for each section
      const permissionsData: Record<string, ContentPermission[]> = {};
      for (const section of sectionsData) {
        const sectionPermissions = await getContentSectionPermissions(section.id);
        permissionsData[section.id] = sectionPermissions;
      }
      setPermissions(permissionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      showError('Load Failed', 'Failed to load permissions data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantPermission = async () => {
    if (!selectedSection || !selectedUser || !userData?.uid) {
      showError('Invalid Selection', 'Please select both a content section and a user.');
      return;
    }

    try {
      setGranting(true);
      await grantContentPermission(selectedUser, selectedSection, userData.uid);
      
      // Refresh permissions for this section
      const sectionPermissions = await getContentSectionPermissions(selectedSection);
      setPermissions(prev => ({
        ...prev,
        [selectedSection]: sectionPermissions
      }));

      setSelectedSection('');
      setSelectedUser('');
      showSuccess('Permission Granted', 'User can now edit this content section.');
    } catch (error) {
      console.error('Error granting permission:', error);
      showError('Grant Failed', 'Failed to grant permission. Please try again.');
    } finally {
      setGranting(false);
    }
  };

  const handleRevokePermission = async (userId: string, sectionId: string) => {
    try {
      await revokeContentPermission(userId, sectionId);
      
      // Refresh permissions for this section
      const sectionPermissions = await getContentSectionPermissions(sectionId);
      setPermissions(prev => ({
        ...prev,
        [sectionId]: sectionPermissions
      }));

      showSuccess('Permission Revoked', 'User can no longer edit this content section.');
    } catch (error) {
      console.error('Error revoking permission:', error);
      showError('Revoke Failed', 'Failed to revoke permission. Please try again.');
    }
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.uid === userId);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'home': 'bg-blue-100 text-blue-800',
      'hero': 'bg-purple-100 text-purple-800',
      'about': 'bg-green-100 text-green-800',
      'contact': 'bg-yellow-100 text-yellow-800',
      'membership': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="super-admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#F58C28'}}></div>
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
                href="/admin/content"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Content Management
              </Link>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Permissions</h1>
              <p className="mt-2 text-gray-600">Manage who can edit specific content sections</p>
            </div>
          </div>

          {/* Grant Permission Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Grant New Permission</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select a content section</option>
                  {contentSections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title} ({section.category})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.uid} value={user.uid}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleGrantPermission}
                  disabled={!selectedSection || !selectedUser || granting}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  style={{backgroundColor: '#10B981'}}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {granting ? 'Granting...' : 'Grant Permission'}
                </button>
              </div>
            </div>
          </div>

          {/* Permissions List */}
          <div className="space-y-6">
            {contentSections.map((section) => {
              const sectionPermissions = permissions[section.id] || [];
              
              return (
                <div key={section.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(section.category)}`}>
                          {section.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>{sectionPermissions.length} user{sectionPermissions.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{section.description}</p>
                  </div>
                  
                  <div className="px-6 py-4">
                    {sectionPermissions.length === 0 ? (
                      <div className="text-center py-8">
                        <Shield className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No users have permission to edit this section</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {sectionPermissions.map((permission) => {
                          const user = getUserById(permission.userId);
                          if (!user) return null;
                          
                          return (
                            <div key={permission.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {user.email.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                                  <p className="text-xs text-gray-500">
                                    Granted {permission.grantedAt.toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRevokePermission(permission.userId, section.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
                                title="Revoke permission"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}