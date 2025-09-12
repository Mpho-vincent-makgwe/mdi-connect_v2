import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Application from '@/models/Application';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request, { params }) {
  await dbConnect();
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is admin
    const user = await User.findById(decoded.id);
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    const application = await Application.findById(id)
      .populate('user', 'name email phone')
      .populate('job', 'title company sector location');

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: application._id,
        name: application.user?.name,
        email: application.user?.email,
        phone: application.user?.phone,
        linkedin: application.linkedin,
        coverLetter: application.coverLetter,
        resume: application.resume,
        status: application.status,
        appliedDate: application.appliedDate,
        jobTitle: application.job?.title,
        company: application.job?.company,
        sector: application.job?.sector,
        location: application.job?.location,
        user: {
          name: application.user?.name,
          email: application.user?.email,
          phone: application.user?.phone
        }
      }
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch application', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  await dbConnect();
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is admin
    const user = await User.findById(decoded.id);
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const { status } = await request.json();

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: application._id,
        status: application.status
      }
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to update application', error: error.message },
      { status: 500 }
    );
  }
}