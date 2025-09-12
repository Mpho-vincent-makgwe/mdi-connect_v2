// app/api/admin/jobs/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Job from '@/models/Job';
import Application from '@/models/Application';
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

// GET /api/admin/jobs/[id] - Get a specific job
export async function GET(request, { params }) {
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

    const { id } = params;
    
    // Get job with applications populated
    const job = await Job.findById(id).populate({
      path: 'applications',
      populate: {
        path: 'applicant',
        select: 'name email'
      }
    });
    
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while fetching job' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/jobs/[id] - Update a job
export async function PUT(request, { params }) {
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

    const { id } = params;
    const body = await request.json();
    
    // Find and update job
    const job = await Job.findByIdAndUpdate(
      id, 
      body, 
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while updating job' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/jobs/[id] - Delete a job
export async function DELETE(request, { params }) {
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

    const { id } = params;
    
    // Find job and check if it has applications
    const job = await Job.findById(id);
    
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Delete all applications associated with this job
    await Application.deleteMany({ job: id });
    
    // Delete the job
    await Job.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while deleting job' },
      { status: 500 }
    );
  }
}