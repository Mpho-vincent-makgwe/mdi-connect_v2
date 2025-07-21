// components/UpcomingInterviews.js
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FiCalendar, FiClock, FiVideo } from 'react-icons/fi';

const interviews = [
  {
    id: '1',
    candidate: 'Sarah Johnson',
    position: 'Tour Guide',
    date: '2023-11-20T10:30:00',
    type: 'video',
    avatar: '/avatars/sarah.jpg'
  },
  {
    id: '2',
    candidate: 'David Kim',
    position: 'Mining Technician',
    date: '2023-11-21T14:00:00',
    type: 'in-person',
    avatar: '/avatars/david.jpg'
  },
  {
    id: '3',
    candidate: 'Lisa Wong',
    position: 'Quality Inspector',
    date: '2023-11-22T09:15:00',
    type: 'video',
    avatar: '/avatars/lisa.jpg'
  },
];

export default function UpcomingInterviews() {
  return (
    <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
      {interviews.map((interview) => (
        <div 
          key={interview.id} 
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            border: '1px solid rgba(140, 60, 30, 0.2)',
            borderRadius: '0.5rem',
            backgroundColor: '#F2ECE4',
            marginBottom: '1rem',
            transition: 'box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          className="hover:shadow-md"
        >
          <Avatar style={{ height: '2.5rem', width: '2.5rem' }}>
            <AvatarImage src={interview.avatar} />
            <AvatarFallback style={{ 
              backgroundColor: '#132857', 
              color: '#F2ECE4', 
              fontWeight: '500'
            }}>
              {interview.candidate.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div style={{ marginLeft: '1rem', flex: 1 }}>
            <p style={{ 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              lineHeight: '1.25rem', 
              color: '#4682B4'
            }}>
              {interview.candidate}
            </p>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'rgba(140, 60, 30, 0.8)'
            }}>
              {interview.position}
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              paddingTop: '0.25rem', 
              fontSize: '0.875rem', 
              color: 'rgba(140, 60, 30, 0.8)'
            }}>
              <FiCalendar style={{ marginRight: '0.25rem', height: '1rem', width: '1rem', color: 'rgba(140, 60, 30, 0.6)' }} />
              {new Date(interview.date).toLocaleDateString()}
              <FiClock style={{ marginLeft: '0.75rem', marginRight: '0.25rem', height: '1rem', width: '1rem', color: 'rgba(140, 60, 30, 0.6)' }} />
              {new Date(interview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <Button 
            variant={interview.type === 'video' ? 'secondary' : 'outline'} 
            size="sm" 
            style={{ marginLeft: 'auto' }}
          >
            {interview.type === 'video' ? (
              <FiVideo style={{ marginRight: '0.5rem', height: '1rem', width: '1rem' }} />
            ) : (
              <FiCalendar style={{ marginRight: '0.5rem', height: '1rem', width: '1rem' }} />
            )}
            Join
          </Button>
        </div>
      ))}
    </div>
  );
}