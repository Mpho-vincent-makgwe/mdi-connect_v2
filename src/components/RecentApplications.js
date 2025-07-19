'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FiExternalLink } from 'react-icons/fi';


export default function RecentApplications() {
const applications = [
  {
    id: 'APL-1024',
    candidate: 'John Smith',
    position: 'Mining Engineer',
    date: '2023-11-15',
    status: 'review',
    sector: 'Mining'
  },
  {
    id: 'APL-1023',
    candidate: 'Sarah Johnson',
    position: 'Tour Guide',
    date: '2023-11-14',
    status: 'interview',
    sector: 'Tourism'
  },
  {
    id: 'APL-1022',
    candidate: 'Michael Chen',
    position: 'Production Supervisor',
    date: '2023-11-12',
    status: 'hired',
    sector: 'Manufacturing'
  },
  {
    id: 'APL-1021',
    candidate: 'Emma Wilson',
    position: 'Geologist',
    date: '2023-11-10',
    status: 'rejected',
    sector: 'Mining'
  },
];

const statusVariants = {
    review: 'bg-yellow-100 text-yellow-800',
    interview: 'bg-blue-100 text-blue-800',
    hired: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Application ID</TableHead>
          <TableHead>Candidate</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Sector</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="font-medium">{app.id}</TableCell>
            <TableCell>{app.candidate}</TableCell>
            <TableCell>{app.position}</TableCell>
            <TableCell>
              <Badge variant="outline">{app.sector}</Badge>
            </TableCell>
            <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge className={statusVariants[app.status]}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <button className="text-blue-600 hover:text-blue-800">
                <FiExternalLink className="h-4 w-4" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}