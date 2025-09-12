import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Job from '@/models/Job';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Helper function to check admin authentication
const checkAdminAuth = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, message: 'No token provided' };
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return { success: false, message: 'Invalid token' };
  }

  return { success: true, user: decoded };
};

// GET /api/admin/jobs - Get all jobs with optional filtering
export async function GET(request) {
  try {
    // Check authentication
    const authResult = checkAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search');
    const sector = searchParams.get('sector');
    const location = searchParams.get('location');
    const status = searchParams.get('status');
    
    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (sector && sector !== 'all') {
      filter.sector = sector;
    }
    
    if (location && location !== 'all') {
      filter.location = location;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get jobs with filters and pagination
    const jobs = await Job.find(filter)
      .populate('applications', 'status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Job.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    // Format response with application counts
    const jobsWithCounts = jobs.map(job => {
      const jobObj = job.toObject();
      jobObj.applicationCount = job.applications.length;
      return jobObj;
    });

    return NextResponse.json({
      success: true,
      data: jobsWithCounts,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while fetching jobs' },
      { status: 500 }
    );
  }
}

// POST /api/admin/jobs - Create a new job
export async function POST(request) {
  try {
    // Check authentication
    const authResult = checkAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    await dbConnect();

    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const { title, company, description, requirements, location, sector, deadline, salary, requiredApplicants } = body;
    
    if (!title || !company || !description || !requirements || !location || !sector || !deadline || !salary) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new job with all required fields
    const job = await Job.create({
      title,
      company,
      description,
      requirements: Array.isArray(requirements) ? requirements : requirements.split('\n').filter(req => req.trim() !== ''),
      location,
      sector: sector.charAt(0).toUpperCase() + sector.slice(1), // Capitalize first letter
      salary,
      requiredApplicants: requiredApplicants || 1,
      deadline: new Date(deadline),
      postedBy: authResult.user.id,
      status: 'Open',
      img: body.img || '/images/default-job.jpg' // Default image
    });
    
    return NextResponse.json(
      { success: true, data: job },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Server error while creating job' 
      },
      { status: 500 }
    );
  }
}