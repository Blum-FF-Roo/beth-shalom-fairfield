'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function DebugPage() {
  const { user, userData, loading } = useAuth();

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div>
            <h2 className="font-semibold">Loading:</h2>
            <p className="text-gray-600">{loading ? 'true' : 'false'}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">User (Firebase Auth):</h2>
            <pre className="text-gray-600 bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(user ? {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified
              } : null, null, 2)}
            </pre>
          </div>
          
          <div>
            <h2 className="font-semibold">UserData (Firestore):</h2>
            <pre className="text-gray-600 bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}