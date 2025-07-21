import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Job from '@/models/Job';

export async function GET(request, { params }) {
  await dbConnect();
  
  try {
    const { id } = params;
    
    const job = await Job.findById(id)
      .select('-applications')
      .lean();

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        id: job._id,
        title: job.title,
        company: job.company,
        sector: job.sector,
        loc: job.location,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements,
        img: job.img,
        status: job.status,
        deadline: job.deadline,
        createdAt: job.createdAt
      }
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch job', error: error.message },
      { status: 500 }
    );
  }
}