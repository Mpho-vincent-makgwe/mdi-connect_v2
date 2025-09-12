'use client';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CompleteRegistrationPage() {
  const { updateUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    email: '',
    oldPassword: '',
    role: 'unskilled',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [invitationValid, setInvitationValid] = useState(false);
  const [invitationLoading, setInvitationLoading] = useState(!!invitationToken);
  const [userData, setUserData] = useState(null);

  // Check invitation token on component mount
  useEffect(() => {
    const checkInvitation = async () => {
      if (!invitationToken) {
        setInvitationLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/validate-invitation?token=${invitationToken}`);
        const data = await response.json();
        
        if (data.success) {
          setUserData(data.user);
          setFormData(prev => ({
            ...prev,
            email: data.user.email,
            role: data.user.role
          }));
          setInvitationValid(true);
        } else {
          setError('Invalid or expired invitation link');
        }
      } catch (err) {
        setError('Failed to validate invitation');
      } finally {
        setInvitationLoading(false);
      }
    };

    checkInvitation();
  }, [invitationToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate all required fields
    if (!formData.email || !formData.oldPassword || !formData.newPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/complete-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationToken,
          email: formData.email,
          oldPassword: formData.oldPassword,
          role: formData.role,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update user context
        await updateUser({ completedQuestionnaire: true });
        
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/questionnaire');
        }
      } else {
        setError(data.message || 'Failed to complete registration');
      }
    } catch (err) {
      setError('Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking invitation
  if (invitationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating invitation...</p>
        </div>
      </div>
    );
  }

  // Show error if invitation is invalid
  if (invitationToken && !invitationValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invitation</h2>
          <p className="text-gray-600 mb-6">{error || 'This invitation link is invalid or has expired.'}</p>
          <Link
            href="/auth/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You've been invited by an administrator
        </p>
        {userData && (
          <p className="mt-1 text-center text-sm text-gray-600">
            Welcome, {userData.name} ({userData.email})
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                disabled={!!userData} // Disable if email is pre-filled from invitation
              />
            </div>

            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                Temporary Password
              </label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                required
                value={formData.oldPassword}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter temporary password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'skilled' }))}
                  className={`py-2 px-4 border rounded-md text-sm font-medium ${formData.role === 'skilled' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Skilled Worker
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'unskilled' }))}
                  className={`py-2 px-4 border rounded-md text-sm font-medium ${formData.role === 'unskilled' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Unskilled Worker
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={6}
                value={formData.newPassword}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm new password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Completing Registration...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}