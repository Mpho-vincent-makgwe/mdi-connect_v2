// components/AdminDashboard/UserManagement.js
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FiSearch, 
  FiUser, 
  FiMail, 
  FiCalendar,
  FiBriefcase,
  FiEye
} from 'react-icons/fi';
import { useAdmin } from '@/context/AdminContext';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const {
    users,
    loading,
    pagination,
    fetchAllUsers,
    fetchUserDetails
  } = useAdmin();

  useEffect(() => {
    fetchAllUsers(currentPage, 10);
  }, [currentPage, fetchAllUsers]);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewUserDetails = async (userId) => {
    try {
      const userDetails = await fetchUserDetails(userId);
      if (userDetails) {
        setSelectedUser(userDetails);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  if (loading && users.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading users...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">
                <FiSearch className="mr-2" />
                Search
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">User</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-left py-2">Applications</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <FiUser className="text-gray-600" />
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' 
                            ? 'bg-blue-100 text-blue-800' 
                            : user.role === 'skilled'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3">{user.applicationCount || 0}</td>
                      <td className="py-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewUserDetails(user._id)}
                          disabled={loading}
                        >
                          <FiEye className="mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span>Page {currentPage} of {pagination.users.totalPages}</span>
              <Button 
                variant="outline" 
                disabled={currentPage === pagination.users.totalPages || loading}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Details Sidebar */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedUser ? 'User Details' : 'Select a User'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <FiUser className="text-gray-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Role</label>
                    <p className="font-medium">{selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <p className="font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedUser.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedUser.status || 'active'}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Joined</label>
                  <p className="font-medium">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {selectedUser.applications && selectedUser.applications.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recent Applications</h4>
                    <div className="space-y-2">
                      {selectedUser.applications.slice(0, 3).map((app) => (
                        <div key={app._id} className="p-2 bg-gray-50 rounded">
                          <p className="text-sm font-medium">{app.jobTitle}</p>
                          <p className="text-xs text-gray-600">
                            Applied on {new Date(app.appliedDate).toLocaleDateString()}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            app.status === 'accepted' 
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Select a user to view details
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}