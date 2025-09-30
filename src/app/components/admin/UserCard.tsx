'use client';

import { useState } from 'react';
import { UserData } from '@/app/utils/users';
import { ContentSection } from '@/app/utils/firebase-operations';
import { Shield, ShieldCheck, Mail, Trash2, ToggleLeft, ToggleRight, Settings } from 'lucide-react';

interface UserCardProps {
  user: UserData;
  currentUserUid: string;
  contentSections: ContentSection[];
  userPermissions: string[]; // Array of content section IDs the user has permission for
  onToggleStatus: (uid: string, isActive: boolean) => void;
  onToggleRole: (uid: string, role: 'admin' | 'super-admin') => void;
  onDelete: (uid: string) => void;
  onSendPasswordReset: (email: string) => void;
  onToggleContentPermission: (userId: string, contentSectionId: string, hasPermission: boolean) => void;
}

export default function UserCard({ 
  user, 
  currentUserUid,
  contentSections,
  userPermissions,
  onToggleStatus, 
  onToggleRole,
  onDelete, 
  onSendPasswordReset,
  onToggleContentPermission
}: UserCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const isCurrentUser = user.uid === currentUserUid;
  const [showPermissions, setShowPermissions] = useState(false);

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

  return (
    <div className={`bg-white rounded-lg shadow-md border transition-all duration-200 ${
      user.isActive 
        ? 'border-gray-200 hover:shadow-lg' 
        : 'border-gray-300 bg-gray-50'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-lg font-semibold ${
                user.isActive ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {user.email}
              </h3>
              
              {isCurrentUser && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  You
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                user.role === 'super-admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.role === 'super-admin' ? (
                  <ShieldCheck className="h-3 w-3 mr-1" />
                ) : (
                  <Shield className="h-3 w-3 mr-1" />
                )}
                {user.role === 'super-admin' ? 'Super Admin' : 'Admin'}
              </div>
              
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                user.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Created: {formatDate(user.createdAt)}</p>
              {user.updatedAt.getTime() !== user.createdAt.getTime() && (
                <p>Updated: {formatDate(user.updatedAt)}</p>
              )}
              {user.lastLogin && (
                <p>Last Login: {formatDate(user.lastLogin)}</p>
              )}
              {!user.lastLogin && (
                <p>Last Login: Never</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-3">
          {/* Content Permissions (only for regular admins and super-admin viewing) */}
          {user.role === 'admin' && !isCurrentUser && (
            <div className="border border-gray-200 rounded-lg p-4">
              <button
                onClick={() => setShowPermissions(!showPermissions)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Content Permissions ({userPermissions.length}/{contentSections.length})
                  </span>
                </div>
                <span className="text-gray-400">
                  {showPermissions ? '−' : '+'}
                </span>
              </button>
              
              {showPermissions && (
                <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                  {contentSections.map((section) => {
                    const hasPermission = userPermissions.includes(section.id);
                    return (
                      <div key={section.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">{section.title}</span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getCategoryColor(section.category)}`}>
                            {section.category}
                          </span>
                        </div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={hasPermission}
                            onChange={(e) => onToggleContentPermission(user.uid, section.id, e.target.checked)}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* First row - Password reset (always available) */}
          <div className="flex justify-center">
            <button
              onClick={() => onSendPasswordReset(user.email)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
            >
              <Mail className="h-4 w-4 mr-2" />
              Reset Password
            </button>
          </div>

          {/* Second row - Role and Status controls (only for other users) */}
          {!isCurrentUser && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => onToggleRole(user.uid, user.role === 'admin' ? 'super-admin' : 'admin')}
                className={`flex-1 inline-flex items-center justify-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                  user.role === 'admin'
                    ? 'border-purple-300 text-purple-700 bg-white hover:bg-purple-50 focus:ring-purple-500'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500'
                }`}
              >
                {user.role === 'admin' ? 'Make Super Admin' : 'Make Admin'}
              </button>
              
              <button
                onClick={() => onToggleStatus(user.uid, !user.isActive)}
                className={`flex-1 inline-flex items-center justify-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                  user.isActive
                    ? 'border-red-300 text-red-700 bg-white hover:bg-red-50 focus:ring-red-500'
                    : 'border-green-300 text-green-700 bg-white hover:bg-green-50 focus:ring-green-500'
                }`}
              >
                {user.isActive ? (
                  <>
                    <ToggleLeft className="h-4 w-4 mr-1" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <ToggleRight className="h-4 w-4 mr-1" />
                    Activate
                  </>
                )}
              </button>
            </div>
          )}

          {/* Third row - Delete button (only for other users, centered and prominent) */}
          {!isCurrentUser && (
            <div className="flex justify-center">
              <button
                onClick={() => onDelete(user.uid)}
                className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}