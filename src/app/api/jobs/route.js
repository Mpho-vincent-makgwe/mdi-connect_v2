import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Job from '@/models/Job';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const sector = searchParams.get('sector');
    const location = searchParams.get('location');
    
    let query = { status: 'Open' };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (sector && sector !== 'all') {
      query.sector = sector;
    }
    
    if (location && location !== 'all') {
      query.location = location;
    }
    
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .select('-applications'); // Don't return applications in listing
    
    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();
  const token = await getToken({ req: request });
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { jobId, ...applicationData } = await request.json();
    
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Check if user already applied
    const alreadyApplied = job.applications.some(app => 
      app.userId.toString() === token.id
    );
    
    if (alreadyApplied) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 400 }
      );
    }
    
    // Add application
    job.applications.push({
      userId: token.id,
      ...applicationData
    });
    
    // Close job if required applicants reached
    if (job.applications.length >= job.requiredApplicants) {
      job.status = 'Closed';
    }
    
    await job.save();
    
    return NextResponse.json(
      { success: true, message: 'Application submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}