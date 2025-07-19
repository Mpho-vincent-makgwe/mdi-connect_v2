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
    <div className="space-y-4">
      {interviews.map((interview) => (
        <div key={interview.id} className="flex items-center p-4 border rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src={interview.avatar} />
            <AvatarFallback>{interview.candidate.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">{interview.candidate}</p>
            <p className="text-sm text-gray-500">{interview.position}</p>
            <div className="flex items-center pt-1 text-sm text-gray-500">
              <FiCalendar className="mr-1 h-4 w-4" />
              {new Date(interview.date).toLocaleDateString()}
              <FiClock className="ml-3 mr-1 h-4 w-4" />
              {new Date(interview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            {interview.type === 'video' ? (
              <FiVideo className="mr-2 h-4 w-4" />
            ) : (
              <FiCalendar className="mr-2 h-4 w-4" />
            )}
            Join
          </Button>
        </div>
      ))}
    </div>
  );
}