// components/AdminDashboard/AddUser.js
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiMail, FiUser, FiArrowLeft } from 'react-icons/fi';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'unskilled'
  });
  const [loading, setLoading] = useState(false);
  
  const { inviteUser } = useAdmin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await inviteUser(formData);
      if (success) {
        // Reset form
        setFormData({ name: '', email: '', role: 'unskilled' });
      }
    } catch (error) {
      console.error('Error inviting user:', error);
      toast.error('Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/admin/users">
        <Button variant="outline" className="mb-4">
          <FiArrowLeft className="mr-2" />
          Back to Users
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Invite New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="unskilled">Unskilled Worker</option>
                <option value="skilled">Skilled Worker</option>
              </select>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              <FiMail className="mr-2" />
              {loading ? 'Sending Invitation...' : 'Send Invitation'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}