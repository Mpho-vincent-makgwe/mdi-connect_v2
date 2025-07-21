import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose'; // Add this import
import Job from '@/models/Job';
import User from '@/models/User';
import Application from '@/models/Application';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';

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

export async function POST(request,  {params}) {
  await dbConnect();
  
  try {
    // 1. Authentication and Authorization
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 2. Parse form data
    const formData = await request.formData();
     const { id } = params;
    const resumeFile = formData.get('resume');
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const linkedin = formData.get('linkedin');
    const coverLetter = formData.get('coverLetter');
    
    // 3. Validate required fields
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required' },
        { status: 400 }
      );
    }

    if (!resumeFile) {
      return NextResponse.json(
        { success: false, message: 'Resume file is required' },
        { status: 400 }
      );
    }

    // 4. Process the resume file
    let resumeUrl;
    try {
      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
      await fs.mkdir(uploadDir, { recursive: true });

      // Generate unique filename
      const fileExt = path.extname(resumeFile.name);
      const fileName = `resume_${userId}_${Date.now()}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);

      // Convert file to buffer and save
      const fileBuffer = await resumeFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(fileBuffer));

      // Create public URL
      resumeUrl = `/uploads/resumes/${fileName}`;
    } catch (fileError) {
      console.error('File upload error:', fileError);
      return NextResponse.json(
        { success: false, message: 'Failed to process resume file' },
        { status: 500 }
      );
    }

    // 5. Start Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 6. Check if job exists and is open
      const job = await Job.findById(id).session(session);
      if (!job) {
        throw new Error('Job not found');
      }
      
      if (job.status !== 'Open') {
        throw new Error('This job is no longer accepting applications');
      }

      // 7. Check for existing application
      const existingApplication = await Application.findOne({
        user: userId,
        job: id
      }).session(session);

      if (existingApplication) {
        throw new Error('You have already applied for this job');
      }

      // 8. Prepare application data
      const applicationData = {
        user: userId,
        job: id,
        status: 'applied',
        appliedDate: new Date(),
        resume: resumeUrl,
        name,
        email,
        phone,
        ...(linkedin && { linkedin }),
        ...(coverLetter && { coverLetter })
      };

      // 9. Update Job with new application
      const updatedJob = await Job.findByIdAndUpdate(
        id,
        {
          $push: {
            applications: {
              user: userId,
              status: 'applied',
              appliedDate: new Date(),
              resume: resumeUrl,
              name,
              email,
              phone,
              ...(linkedin && { linkedin }),
              ...(coverLetter && { coverLetter })
            }
          },
          ...(job.applications && job.applications.length + 1 >= job.requiredApplicants && { status: 'Closed' })
        },
        { new: true, session }
      );

      // 10. Create standalone Application document
      const application = await Application.create([applicationData], { session });

      // 11. Update User's applications
      await User.findByIdAndUpdate(
        userId,
        { $push: { applications: { job: id, status: 'applied' } } },
        { session }
      );

      // 12. Create notification
      await Notification.create([{
        user: userId,
        title: 'Application Submitted',
        message: `Your application for ${job.title} at ${job.company} has been submitted.`,
        type: 'application',
        relatedEntity: application[0]._id
      }], { session });

      // 13. Commit transaction
      await session.commitTransaction();

      return NextResponse.json({
        success: true,
        message: 'Application submitted successfully',
        data: {
          applicationId: application[0]._id,
          jobStatus: updatedJob.status,
          resumeUrl
        }
      }, { status: 201 });

    } catch (error) {
      // Rollback transaction on error
      await session.abortTransaction();
      
      console.error("Application error:", error);
      
      const statusCode = error.message.includes('already applied') || 
                        error.message.includes('no longer accepting') 
                        ? 400 : 500;

      return NextResponse.json(
        { 
          success: false, 
          message: error.message,
          error: error.message 
        },
        { status: statusCode }
      );
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error("Authentication/validation error:", error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Application failed', error: error.message },
      { status: 500 }
    );
  }
}