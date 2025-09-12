// JobApplicationModal.js
'use client';

import { useState, useEffect } from 'react';
import { useJobs } from '@/context/JobsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';

export default function JobApplicationModal({ job, open, onOpenChange }) {
  const { applyForJob } = useJobs();
  const [application, setApplication] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    coverLetter: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to apply for jobs');
      }

      const formData = new FormData();
      formData.append('jobId', job._id || job.id);
      formData.append('name', application.name);
      formData.append('email', application.email);
      formData.append('phone', application.phone);
      formData.append('linkedin', application.linkedin || '');
      formData.append('coverLetter', application.coverLetter);
      
      if (resumeFile) {
        formData.append('resume', resumeFile);
      } else {
        throw new Error('Please upload your resume');
      }

      const result = await applyForJob(job._id || job.id, formData);
      
      if (result.success) {
        toast.success('Application submitted successfully!');
        onOpenChange(false);
      } else {
        setError(result.message || 'Failed to submit application');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Application error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setApplication({
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        coverLetter: '',
      });
      setResumeFile(null);
      setError('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: '#F2ECE4',
        borderRadius: '0.5rem'
      }}>
        <DialogHeader>
          <DialogTitle style={{ color: '#1A1A1A' }}>Apply for {job.title}</DialogTitle>
          <DialogDescription style={{ color: 'rgba(140, 60, 30, 0.7)' }}>
            Complete the form to apply for this position at {job.company}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="name" style={{ color: '#1A1A1A' }}>Full Name</Label>
            <Input
              id="name"
              name="name"
              value={application.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="email" style={{ color: '#1A1A1A' }}>Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={application.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="phone" style={{ color: '#1A1A1A' }}>Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={application.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="linkedin" style={{ color: '#1A1A1A' }}>LinkedIn Profile (Optional)</Label>
            <Input
              id="linkedin"
              name="linkedin"
              type="url"
              value={application.linkedin}
              onChange={handleChange}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="coverLetter" style={{ color: '#1A1A1A' }}>Cover Letter</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              value={application.coverLetter}
              onChange={handleChange}
              required
              style={{ minHeight: '7.5rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="resume" style={{ color: '#1A1A1A' }}>Resume (PDF or DOCX)</Label>
            <Input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
            />
          </div>
          
          {error && (
            <p style={{ color: '#8B0000', fontSize: '0.875rem' }}>{error}</p>
          )}
          
          <DialogFooter style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            paddingTop: '1rem'
          }}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
              style={{
                borderColor: '#8C3C1E',
                color: '#8C3C1E',
                backgroundColor: 'transparent'
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} style={{
              backgroundColor: '#132857',
              color: '#F2ECE4'
            }}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}